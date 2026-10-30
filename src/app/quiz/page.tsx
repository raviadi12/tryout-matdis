"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  completeServerSession,
  getRandomQuizQuestions,
  QuestionItem,
  recordAttempt,
  StudentAnswer,
  verifyServerSession,
} from "@/lib/supabase";
import QuestionContentRenderer from "@/components/QuestionContentRenderer";
import LatexRenderer from "@/components/LatexRenderer";

export default function QuizPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [sessionToken, setSessionToken] = useState<string>("");

  useEffect(() => {
    const savedName = sessionStorage.getItem("matdis_student_name");
    if (!savedName) {
      router.push("/");
      return;
    }
    setStudentName(savedName);

    const token = sessionStorage.getItem("matdis_server_session_token") || "";
    setSessionToken(token);

    // Verify session on server
    const checkServerSession = async () => {
      if (token) {
        const { valid } = await verifyServerSession(token);
        if (!valid) {
          alert("Sesi ujian Anda telah kedaluwarsa atau dibatalkan di server.");
          router.push("/");
          return;
        }
      }
    };
    checkServerSession();

    const cachedQuestionsStr = sessionStorage.getItem("matdis_quiz_selected_questions");
    const cachedAnswersStr = sessionStorage.getItem("matdis_quiz_answers");
    const cachedIndexStr = sessionStorage.getItem("matdis_quiz_current_index");

    if (cachedQuestionsStr) {
      try {
        const parsedQ = JSON.parse(cachedQuestionsStr);
        setQuestions(parsedQ);
        if (cachedAnswersStr) {
          const parsedA = JSON.parse(cachedAnswersStr);
          setAnswers(parsedA);
        }
        if (cachedIndexStr) {
          setCurrentIndex(parseInt(cachedIndexStr, 10) || 0);
        }
        setLoading(false);
      } catch (e) {
        initNewQuestions();
      }
    } else {
      initNewQuestions();
    }
  }, [router]);

  useEffect(() => {
    if (loading || submitting) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitting]);

  const initNewQuestions = async () => {
    setLoading(true);
    try {
      const qList = await getRandomQuizQuestions(20);
      setQuestions(qList);
      sessionStorage.setItem("matdis_quiz_selected_questions", JSON.stringify(qList));
      sessionStorage.setItem("matdis_quiz_current_index", "0");
      sessionStorage.setItem("matdis_quiz_answers", JSON.stringify([]));
    } catch (e) {
      console.error("Error loading questions:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIndex];

  const handleEvaluate = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQ.correct_answer;
    const answerRecord: StudentAnswer = {
      questionId: currentQ.id || currentIndex + 1,
      question: currentQ.question,
      topic: currentQ.topic,
      options: currentQ.options,
      studentAnswer: selectedOption,
      correctAnswer: currentQ.correct_answer,
      isCorrect,
      explanation: currentQ.explanation,
    };

    const updatedAnswers = [...answers, answerRecord];
    setAnswers(updatedAnswers);
    sessionStorage.setItem("matdis_quiz_answers", JSON.stringify(updatedAnswers));
    setIsEvaluated(true);
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption("");
      setIsEvaluated(false);
      sessionStorage.setItem("matdis_quiz_current_index", nextIdx.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitting(true);
      const totalQ = questions.length;
      const correctCount = answers.filter((a) => a.isCorrect).length;
      const calculatedScore = Math.round((correctCount / totalQ) * 100 * 10) / 10;

      const attemptRecord = {
        student_name: studentName,
        score: calculatedScore,
        total_questions: totalQ,
        correct_count: correctCount,
        incorrect_count: totalQ - correctCount,
        answers: answers,
        time_spent_seconds: secondsElapsed,
        created_at: new Date().toISOString(),
      };

      // 1. Mark session as COMPLETED on server
      if (sessionToken) {
        await completeServerSession(sessionToken);
      }

      // 2. Save attempt to server
      try {
        await recordAttempt(attemptRecord);
      } catch (err) {
        console.error("Failed to save attempt to server:", err);
      }

      // 3. Save to local storage
      try {
        const existingHistoryStr = localStorage.getItem("matdis_history");
        const existing = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
        const newHistory = [attemptRecord, ...existing];
        localStorage.setItem("matdis_history", JSON.stringify(newHistory));
        sessionStorage.setItem("matdis_last_attempt", JSON.stringify(attemptRecord));
      } catch (err) {
        console.error("Failed to save local history:", err);
      }

      sessionStorage.removeItem("matdis_quiz_active");
      sessionStorage.removeItem("matdis_quiz_selected_questions");
      sessionStorage.removeItem("matdis_quiz_answers");
      sessionStorage.removeItem("matdis_quiz_current_index");
      sessionStorage.removeItem("matdis_server_session_token");

      router.push("/result");
    }
  };

  if (loading || !currentQ) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 font-mono">
        <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        <p className="text-xs text-slate-400">
          Memuat 20 butir soal CBT Matematika Diskrit...
        </p>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const isAnswerCorrect = selectedOption === currentQ.correct_answer;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 font-mono">
      {/* Top Header Card */}
      <div className="bg-[#12151b] border border-[#222731] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#171b22] border border-[#29303d] flex items-center justify-center font-bold text-orange-400 text-sm">
            {currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                SOAL {currentIndex + 1} / {questions.length}
              </span>
              <span className="inline-block w-1 h-1 bg-slate-600" />
              <span className="text-[11px] px-2 py-0.5 bg-[#171b22] text-orange-400 border border-[#29303d]">
                {currentQ.topic}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sesi Aktif: <strong className="text-white">{studentName}</strong>
            </p>
          </div>
        </div>

        {/* Timer & Progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-[#0d0f12] border border-[#222731] px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-400">
              {Math.round(((currentIndex) / questions.length) * 100)}%
            </span>
            <div className="w-24 bg-[#171b22] h-1 overflow-hidden mt-1">
              <div
                className="bg-orange-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#12151b] border border-[#222731] p-6 sm:p-7 space-y-6">
        {/* Question Statement */}
        <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed border-b border-[#222731] pb-5">
          <QuestionContentRenderer content={currentQ.question} block />
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            PILIH SALAH SATU JAWABAN:
          </p>

          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option.key;
            const isOptionCorrect = currentQ.correct_answer === option.key;

            let cardStyles =
              "border-[#222731] bg-[#0d0f12] hover:border-[#384152] hover:bg-[#14181f] text-slate-300";
            let badgeStyles = "bg-[#171b22] text-slate-400 border-[#272e3a]";

            if (isEvaluated) {
              if (isOptionCorrect) {
                cardStyles = "border-emerald-500 bg-[#0e1c15] text-emerald-200 font-semibold";
                badgeStyles = "bg-emerald-500 text-black border-emerald-500 font-bold";
              } else if (isSelected && !isOptionCorrect) {
                cardStyles = "border-rose-500 bg-[#1f1113] text-rose-300";
                badgeStyles = "bg-rose-500 text-white border-rose-500 font-bold";
              } else {
                cardStyles = "border-[#1b1f27] opacity-40 text-slate-500 bg-[#0d0f12]";
              }
            } else if (isSelected) {
              cardStyles = "border-orange-500 bg-[#1c1815] text-white font-medium";
              badgeStyles = "bg-orange-500 text-black border-orange-500 font-bold";
            }

            return (
              <label
                key={option.key}
                onClick={() => {
                  if (!isEvaluated) setSelectedOption(option.key);
                }}
                className={`relative flex items-center gap-3 p-3.5 border transition-all ${
                  isEvaluated ? "cursor-default" : "cursor-pointer"
                } ${cardStyles}`}
              >
                <div
                  className={`w-6 h-6 border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyles}`}
                >
                  {option.key}
                </div>

                <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                  <LatexRenderer content={option.text} />
                </div>

                {isEvaluated && isOptionCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isEvaluated && isSelected && !isOptionCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </label>
            );
          })}
        </div>

        {/* Immediate Result Banner & Explanation */}
        {isEvaluated && (
          <div className="space-y-3 pt-4 border-t border-[#222731]">
            <div
              className={`p-3.5 border flex items-start gap-3 ${
                isAnswerCorrect
                  ? "bg-[#0e1c15] border-emerald-500/50 text-emerald-200"
                  : "bg-[#1f1113] border-rose-500/50 text-rose-200"
              }`}
            >
              {isAnswerCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-xs sm:text-sm">
                  {isAnswerCorrect ? "JAWABAN TEPAT (+5 Poin)" : "JAWABAN BELUM TEPAT"}
                </h4>
                <p className="text-xs mt-0.5 opacity-90 font-sans">
                  {isAnswerCorrect ? (
                    "Analisis logika matematika Anda sudah tepat untuk soal ini."
                  ) : (
                    <>
                      Kunci jawaban yang benar adalah pilihan{" "}
                      <strong className="underline underline-offset-2 text-emerald-300">
                        {currentQ.correct_answer}
                      </strong>
                      . Pelajari langkah solusinya di bawah:
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0d0f12] border border-[#222731] space-y-2">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Pembahasan Rinci &amp; Langkah Matematis:</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans">
                <QuestionContentRenderer content={currentQ.explanation} block />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {!isEvaluated ? (
            <button
              onClick={handleEvaluate}
              disabled={!selectedOption}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-black font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>LANJUT (CEK HASIL &amp; PEMBAHASAN)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-black font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <span>Menyimpan Hasil Evaluasi ke Server...</span>
                </div>
              ) : isLastQuestion ? (
                <>
                  <span>SELESAI &amp; LIHAT SKOR AKHIR</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>SOAL BERIKUTNYA ({currentIndex + 2}/{questions.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
