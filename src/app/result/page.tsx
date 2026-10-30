"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  History,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { AttemptRecord } from "@/lib/supabase";
import QuestionContentRenderer from "@/components/QuestionContentRenderer";
import LatexRenderer from "@/components/LatexRenderer";

export default function ResultPage() {
  const router = useRouter();
  const [attempt, setAttempt] = useState<AttemptRecord | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const lastAttemptStr = sessionStorage.getItem("matdis_last_attempt");
    if (lastAttemptStr) {
      try {
        const parsed = JSON.parse(lastAttemptStr);
        setAttempt(parsed);
        return;
      } catch (e) {
        // fallback
      }
    }

    const historyStr = localStorage.getItem("matdis_history");
    if (historyStr) {
      try {
        const history = JSON.parse(historyStr);
        if (Array.isArray(history) && history.length > 0) {
          setAttempt(history[0]);
        }
      } catch (e) {
        // fallback
      }
    }
  }, []);

  if (!attempt) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 font-mono">
        <p className="text-slate-400 text-xs">Belum ada data evaluasi tryout.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-orange-600 text-black font-bold text-xs hover:bg-orange-500 transition"
        >
          Mulai Tryout Sekarang
        </Link>
      </div>
    );
  }

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins} menit ${secs} detik`;
  };

  const isPassed = attempt.score >= 60;

  const topicStats: Record<string, { total: number; correct: number }> = {};
  attempt.answers.forEach((ans) => {
    if (!topicStats[ans.topic]) {
      topicStats[ans.topic] = { total: 0, correct: 0 };
    }
    topicStats[ans.topic].total += 1;
    if (ans.isCorrect) {
      topicStats[ans.topic].correct += 1;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-mono">
      {/* Score Summary Banner */}
      <div
        className={`p-6 sm:p-8 border ${
          isPassed
            ? "bg-[#0e1c15] border-emerald-500/40 text-white"
            : "bg-[#1f1113] border-rose-500/40 text-white"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-black/40 border border-white/10 text-[10px] text-orange-400">
              <Trophy className="w-3 h-3 text-amber-300" />
              <span>REKAPITULASI HASIL CBT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isPassed ? "Evaluasi Selesai: Lulus Ujian" : "Evaluasi Selesai: Belum Mencapai Target"}
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Peserta: <strong className="text-white">{attempt.student_name}</strong> &bull; Total{" "}
              {attempt.total_questions} butir soal selesai dianalisis.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-black/40 border border-white/10 min-w-[150px]">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Skor Perolehan
            </span>
            <div className="text-4xl font-black text-orange-400 tracking-tight my-0.5">
              {attempt.score}
            </div>
            <span className="text-[10px] text-slate-400">dari 100 Poin</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-white/10 text-xs">
          <div className="bg-black/40 p-2.5 border border-white/5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">Benar</div>
              <div className="text-xs font-bold text-white">{attempt.correct_count} Soal</div>
            </div>
          </div>
          <div className="bg-black/40 p-2.5 border border-white/5 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">Salah</div>
              <div className="text-xs font-bold text-white">{attempt.incorrect_count} Soal</div>
            </div>
          </div>
          <div className="bg-black/40 p-2.5 border border-white/5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">Waktu</div>
              <div className="text-xs font-bold text-white">{formatTime(attempt.time_spent_seconds)}</div>
            </div>
          </div>
          <div className="bg-black/40 p-2.5 border border-white/5 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">Akurasi</div>
              <div className="text-xs font-bold text-white">
                {Math.round((attempt.correct_count / attempt.total_questions) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-black font-bold text-xs flex items-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mulai Tryout Baru (20 Soal Lainnya)</span>
        </Link>
        <Link
          href="/history"
          className="px-4 py-2.5 bg-[#12151b] hover:bg-[#1a2029] border border-[#222731] text-slate-300 font-semibold text-xs flex items-center gap-2 transition"
        >
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Lihat Riwayat &amp; Sesi Terakhir</span>
        </Link>
      </div>

      {/* Performance by Topic */}
      <div className="bg-[#12151b] border border-[#222731] p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-orange-400" />
          ANALISIS PENGUASAAN BERDASARKAN BAB:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(topicStats).map(([topic, stat]) => {
            const pct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={topic} className="p-3 border border-[#222731] bg-[#0d0f12] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{topic}</span>
                  <span className={pct >= 60 ? "text-emerald-400" : "text-rose-400"}>
                    {stat.correct}/{stat.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#171b22] h-1 overflow-hidden">
                  <div
                    className={`h-full ${pct >= 60 ? "bg-emerald-500" : "bg-rose-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Questions Review */}
      <div className="bg-[#12151b] border border-[#222731] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#222731] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Pembahasan Lengkap 20 Soal</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Klik setiap soal untuk membuka rincian opsi dan penjelasan matematisnya.
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-[#171b22] text-orange-400 border border-[#272e3a]">
            {attempt.answers.length} Soal Selesai
          </span>
        </div>

        <div className="space-y-2.5">
          {attempt.answers.map((item, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={idx}
                className={`border transition-all ${
                  item.isCorrect
                    ? "border-emerald-500/30 bg-[#0e1c15]/40"
                    : "border-rose-500/30 bg-[#1f1113]/40"
                }`}
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-3.5 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 flex items-center justify-center font-bold text-xs shrink-0 ${
                        item.isCorrect ? "bg-emerald-500 text-black" : "bg-rose-500 text-white"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {item.topic}
                        </span>
                        <span className="inline-block w-1 h-1 bg-slate-600" />
                        <span
                          className={`text-xs font-semibold ${
                            item.isCorrect ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {item.isCorrect ? "Benar (+5 Poin)" : "Salah (0 Poin)"}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 line-clamp-2">
                        <QuestionContentRenderer content={item.question} />
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-1 text-slate-400 hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-[#222731] space-y-3 mt-2">
                    <div className="text-xs font-medium text-slate-100 pt-2 font-sans">
                      <QuestionContentRenderer content={item.question} block />
                    </div>

                    <div className="space-y-1.5">
                      {item.options.map((opt) => {
                        const isStudentChoice = item.studentAnswer === opt.key;
                        const isCorrectChoice = item.correctAnswer === opt.key;

                        let style = "bg-[#0d0f12] border-[#222833] text-slate-300";
                        if (isCorrectChoice) {
                          style = "bg-[#0e1c15] border-emerald-500/60 text-emerald-200 font-semibold";
                        } else if (isStudentChoice && !isCorrectChoice) {
                          style = "bg-[#1f1113] border-rose-500/60 text-rose-300 line-through opacity-70";
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-2.5 border text-xs flex items-center justify-between gap-3 ${style}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold w-4 shrink-0">{opt.key}.</span>
                              <LatexRenderer content={opt.text} />
                            </div>
                            <div className="shrink-0 text-[10px] font-bold">
                              {isCorrectChoice && (
                                <span className="text-emerald-400">✓ Kunci</span>
                              )}
                              {isStudentChoice && !isCorrectChoice && (
                                <span className="text-rose-400">✗ Pilihan Anda</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-[#0d0f12] border border-[#222731] space-y-1.5">
                      <div className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pembahasan Lengkap:</span>
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed font-sans">
                        <QuestionContentRenderer content={item.explanation} block />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
