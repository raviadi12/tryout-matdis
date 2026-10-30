"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  LogOut,
  Play,
  RotateCcw,
  Terminal,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import {
  createServerSession,
  getRandomQuizQuestions,
  purgeStudentSessionOnServer,
} from "@/lib/supabase";
import LatexRenderer from "@/components/LatexRenderer";

export default function HomePage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentAttempt, setRecentAttempt] = useState<any>(null);

  // Show exit modal confirmation
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitLoading, setExitLoading] = useState(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem("matdis_student_name") || localStorage.getItem("matdis_student_name");
    if (savedName) {
      setStudentName(savedName);
      setIsLoggedIn(true);
    }

    try {
      const historyStr = localStorage.getItem("matdis_history");
      if (historyStr) {
        const history = JSON.parse(historyStr);
        if (Array.isArray(history) && history.length > 0) {
          setRecentAttempt(history[0]);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!studentName.trim()) {
      setErrorMessage("Silakan isi nama mahasiswa terlebih dahulu!");
      return;
    }

    const trimmedName = studentName.trim();
    sessionStorage.setItem("matdis_student_name", trimmedName);
    localStorage.setItem("matdis_student_name", trimmedName);
    setIsLoggedIn(true);
  };

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const qList = await getRandomQuizQuestions(20);
      const questionIds = qList.map((q) => q.id || q.question.slice(0, 30));

      const sessionToken = await createServerSession(studentName, questionIds);

      sessionStorage.setItem("matdis_server_session_token", sessionToken);
      sessionStorage.setItem("matdis_quiz_active", "true");
      sessionStorage.setItem("matdis_quiz_current_index", "0");
      sessionStorage.setItem("matdis_quiz_selected_questions", JSON.stringify(qList));
      sessionStorage.setItem("matdis_quiz_answers", JSON.stringify([]));

      router.push("/quiz");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleConfirmExit = async () => {
    setExitLoading(true);
    try {
      await purgeStudentSessionOnServer(studentName);

      sessionStorage.clear();
      localStorage.removeItem("matdis_student_name");
      localStorage.removeItem("matdis_history");

      setIsLoggedIn(false);
      setStudentName("");
      setRecentAttempt(null);
      setShowExitModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setExitLoading(false);
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header Row (without Overview / Tabs / Cakupan Modul) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#222731]">
        <div className="text-xs text-slate-400">
          Evaluasi Ujian Matematika Diskrit &bull; CBT Modul 1-7
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>67 Bank Soal</span>
          <span>&bull;</span>
          <span>20 Soal / Sesi</span>
        </div>
      </div>

      {/* Main Grid: Left Column & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Overview Summary & NILAI TERAKHIR */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Hero Card */}
          <div className="bg-[#12151b] border border-[#222731] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#171b22] border border-[#272e3a] text-xs text-orange-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>TRYOUT MATEMATIKA DISKRIT</span>
              </div>
              <span className="text-xs text-slate-400">
                Computer Based Test (CBT)
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Simulasi Evaluasi Ujian Matdis
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Latihan mandiri 20 butir soal acak per sesi dari 7 bab materi Matematika Diskrit (Relasi 1 &amp; 2, Fungsi, Relasi Rekurensi, Aturan Berhitung, Sarang Merpati, Permutasi-Kombinasi). Dilengkapi visualisasi graf berarah (digraf), representasi matriks relasi, formula <LatexRenderer content="$\LaTeX$" />, dan pembahasan instan.
              </p>
            </div>

            {/* Performance Stats */}
            <div className="mt-5 pt-4 border-t border-[#222731] grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#171b22] border border-[#252c38]">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Waktu Rerata
                </div>
                <div className="text-base font-bold text-white mt-1">20-30m</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">20 Soal / Sesi</div>
              </div>
              <div className="p-3 bg-[#171b22] border border-[#252c38]">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-orange-400" /> Target Lulus
                </div>
                <div className="text-base font-bold text-white mt-1">&ge; 60 Poin</div>
                <div className="text-[10px] text-orange-400 mt-0.5">Passing Grade</div>
              </div>
              <div className="p-3 bg-[#171b22] border border-[#252c38]">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-rose-400" /> Bobot Soal
                </div>
                <div className="text-base font-bold text-white mt-1">+5 Poin</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Per butir benar</div>
              </div>
            </div>
          </div>

          {/* REPLACED SECTION: Left Bottom Now Shows NILAI TERAKHIR (Replacing visual graf & matriks) */}
          <div className="bg-[#12151b] border border-[#222731] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222731]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-bold text-white">
                  NILAI &amp; HASIL EVALUASI TERAKHIR
                </h2>
              </div>
              {recentAttempt ? (
                <span className="text-[10px] px-2 py-0.5 bg-[#171b22] text-emerald-400 border border-[#29313d]">
                  {recentAttempt.created_at ? new Date(recentAttempt.created_at).toLocaleDateString("id-ID") : "Tersimpan"}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 bg-[#171b22] text-slate-400 border border-[#29313d]">
                  Belum ada sesi
                </span>
              )}
            </div>

            {recentAttempt ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0d0f12] border border-[#1f242e]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Skor Akhir Mahasiswa
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black text-orange-400">
                        {recentAttempt.score}
                      </span>
                      <span className="text-xs text-slate-400">/ 100 Poin</span>
                      <span
                        className={`ml-2 text-[10px] font-bold px-2 py-0.5 ${
                          recentAttempt.score >= 60
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {recentAttempt.score >= 60 ? "LULUS EVALUASI" : "BELUM LULUS"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500">Benar / Salah</div>
                      <div className="font-bold text-white mt-0.5">
                        <span className="text-emerald-400">{recentAttempt.correct_count}</span>
                        {" / "}
                        <span className="text-rose-400">{recentAttempt.incorrect_count}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500">Durasi</div>
                      <div className="font-bold text-white mt-0.5">
                        {formatDuration(recentAttempt.time_spent_seconds || 0)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    Sesi terdata atas nama: <strong className="text-white">{recentAttempt.student_name}</strong>
                  </span>
                  <Link
                    href="/result"
                    className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 flex items-center gap-1"
                  >
                    Buka Lembar Pembahasan Lengkap &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2 bg-[#0d0f12] border border-[#1f242e] p-6">
                <p className="text-xs text-slate-400">
                  Belum ada rekaman nilai tryout sebelumnya pada sesi ini.
                </p>
                <p className="text-[11px] text-slate-500">
                  Kerjakan 20 butir soal melalui terminal di samping kanan untuk mendapatkan nilai dan pembahasan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Terminal Evaluasi / Login */}
        <div className="lg:col-span-5 space-y-5">
          {isLoggedIn ? (
            /* ================= LOGGED IN DASHBOARD (NO TOKEN, NO NAME INPUT) ================= */
            <div className="bg-[#12151b] border border-[#222731] p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#222731]">
                <div>
                  <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                    SESI AKTIF TERDAFTAR
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    Terminal Evaluasi CBT
                  </h2>
                </div>
                <div className="w-2.5 h-2.5 bg-emerald-500" />
              </div>

              {/* Summary Stats */}
              <div className="space-y-3 bg-[#0d0f12] border border-[#222731] p-4 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#1b1f27]">
                  <span className="text-slate-400">Status Sesi:</span>
                  <span className="text-emerald-400 font-bold">Siap Mengerjakan</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1b1f27]">
                  <span className="text-slate-400">Jumlah Soal:</span>
                  <span className="text-white font-bold">20 Soal Acak</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1b1f27]">
                  <span className="text-slate-400">Verifikasi Server:</span>
                  <span className="text-cyan-400 font-bold">Server-Side Active</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Format Evaluasi:</span>
                  <span className="text-slate-200">Periksa Langsung per Soal</span>
                </div>
              </div>

              {/* Start Test Button */}
              <button
                onClick={handleStartExam}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-black font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>MENYIAPKAN 20 SOAL DARI SERVER...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>MULAI KERJAKAN 20 SOAL SEKARANG</span>
                  </>
                )}
              </button>

              {/* Exit with another name option */}
              <div className="pt-2 border-t border-[#222731]">
                <button
                  onClick={() => setShowExitModal(true)}
                  className="w-full py-2 px-3 bg-[#171b22] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-[#272e3a] hover:border-rose-500/40 text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar &amp; Gunakan Nama Lain</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= INITIAL LOGIN FORM (NAME ONLY, NO PASSWORD) ================= */
            <div className="bg-[#12151b] border border-[#222731] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222731]">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-orange-400" />
                    Identitas Peserta CBT
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tulis nama Anda untuk memulai sesi latihan tryout.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-[#1c1417] border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">&bull;</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    NAMA LENGKAP MAHASISWA
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full px-3 py-2.5 bg-[#0d0f12] border border-[#252c38] focus:border-orange-500 text-white placeholder:text-slate-500 text-xs font-medium outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-black font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  <span>MASUK KE SISTEM CBT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL PERINGATAN KELUAR NAMA LAIN ================= */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#12151b] border border-[#222731] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-950/40 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-bold text-sm text-white">
                Konfirmasi Keluar Sesi
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Peringatan: Keluar dengan nama lain akan <strong>menghapus sesi aktif Anda di server</strong> serta riwayat lokal yang tersimpan pada peramban ini. Anda harus memasukkan nama dan token baru untuk memulai lagi.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowExitModal(false)}
                disabled={exitLoading}
                className="px-3 py-1.5 bg-[#171b22] hover:bg-[#202732] border border-[#28303d] text-xs text-slate-300 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmExit}
                disabled={exitLoading}
                className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {exitLoading ? "Menghapus Sesi..." : "Ya, Hapus & Ganti Nama"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
