"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
  Terminal,
  TrendingUp,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  ActiveSession,
  AttemptRecord,
  fetchAllAttempts,
  fetchQuestions,
  fetchServerActiveSessions,
  verifyAdminPassword,
} from "@/lib/supabase";
import { QuestionItem } from "@/lib/default-questions";
import QuestionContentRenderer from "@/components/QuestionContentRenderer";
import LatexRenderer from "@/components/LatexRenderer";

export default function KremlinAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [activeTab, setActiveTab] = useState<"attempts" | "actives" | "questions">("attempts");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("ALL");
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptRecord | null>(null);

  useEffect(() => {
    const authState = sessionStorage.getItem("kremlin_admin_auth");
    if (authState === "true") {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const isValid = await verifyAdminPassword(passwordInput);
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem("kremlin_admin_auth", "true");
        await loadDashboardData();
      } else {
        setAuthError("Password Kremlin tidak valid. Akses ditolak.");
      }
    } catch (e) {
      setAuthError("Gagal memverifikasi password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kremlin_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [attemptsData, questionsData, sessionsData] = await Promise.all([
        fetchAllAttempts(),
        fetchQuestions(),
        fetchServerActiveSessions(),
      ]);
      setAttempts(attemptsData);
      setQuestions(questionsData);
      setActiveSessions(sessionsData);
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const totalAttempts = attempts.length;
  const uniqueStudents = new Set(attempts.map((a) => a.student_name.trim().toLowerCase())).size;
  const inProgressSessions = activeSessions.filter((s) => s.status === "IN_PROGRESS");
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          (attempts.reduce((acc, curr) => acc + Number(curr.score), 0) / totalAttempts) * 10
        ) / 10
      : 0;
  const passCount = attempts.filter((a) => Number(a.score) >= 60).length;
  const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

  const filteredAttempts = attempts.filter((a) =>
    a.student_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestions = questions.filter((q) => {
    const matchesTopic = selectedTopic === "ALL" || q.topic === selectedTopic;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const allTopics = Array.from(new Set(questions.map((q) => q.topic)));

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 font-mono">
        <div className="w-full max-w-md bg-[#12151b] border border-[#222731] p-7 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#171b22] text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              KREMLIN CONTROL ROOM
            </h1>
            <p className="text-xs text-slate-400">
              Akses khusus instruktur dan pengawas Matematika Diskrit.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-2.5 bg-[#1f1113] border border-rose-500/40 text-rose-300 text-xs font-semibold">
                {authError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                PASSWORD KREMLIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0f12] border border-[#252c38] focus:border-rose-500 outline-none text-white text-xs font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {loading ? "MEMVERIFIKASI..." : "MASUK KE DASHBOARD KREMLIN"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16 font-mono">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#12151b] border border-[#222731] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#171b22] text-rose-400 text-[10px] font-bold tracking-wider uppercase border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            Kremlin Control Room
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Statistik Evaluasi &amp; Verifikasi Sesi
          </h1>
          <p className="text-xs text-slate-400">
            Pemantauan langsung sesi CBT mahasiswa &amp; verifikasi status tes server-side.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-3 py-1.5 bg-[#171b22] hover:bg-[#212732] border border-[#28303d] text-xs font-semibold flex items-center gap-1.5 text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-950/60 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#12151b] border border-[#222731] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Sesi Sedang Aktif</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{inProgressSessions.length}</div>
          <p className="text-[10px] text-slate-500">Mahasiswa sedang tes</p>
        </div>

        <div className="bg-[#12151b] border border-[#222731] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Total Pengerjaan</span>
            <Users className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalAttempts}</div>
          <p className="text-[10px] text-slate-500">Selesai diarsipkan</p>
        </div>

        <div className="bg-[#12151b] border border-[#222731] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Rata-Rata Skor</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-orange-400">{averageScore}</div>
          <p className="text-[10px] text-slate-500">Rerata seluruh peserta</p>
        </div>

        <div className="bg-[#12151b] border border-[#222731] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Tingkat Kelulusan</span>
            <Award className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{passRate}%</div>
          <p className="text-[10px] text-slate-500">{passCount} mahasiswa &ge; 60</p>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center gap-1 border-b border-[#222731]">
        <button
          onClick={() => setActiveTab("attempts")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === "attempts"
              ? "border-orange-500 text-orange-400 bg-[#14181f]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Attempt Selesai ({attempts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("actives")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === "actives"
              ? "border-orange-500 text-orange-400 bg-[#14181f]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Sesi Server Aktif ({inProgressSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === "questions"
              ? "border-orange-500 text-orange-400 bg-[#14181f]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Tabel Bank Soal ({questions.length})</span>
        </button>
      </div>

      {/* Tab 1: Completed Attempts */}
      {activeTab === "attempts" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama mahasiswa..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#0d0f12] border border-[#222731] text-xs text-white outline-none focus:border-orange-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Total {filteredAttempts.length} sesi
            </span>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="bg-[#12151b] border border-[#222731] p-10 text-center text-slate-500 text-xs">
              Belum ada riwayat attempt mahasiswa yang sesuai.
            </div>
          ) : (
            <div className="bg-[#12151b] border border-[#222731] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d0f12] border-b border-[#222731] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Mahasiswa</th>
                      <th className="py-2.5 px-3 text-center">Skor</th>
                      <th className="py-2.5 px-3 text-center">Benar / Salah</th>
                      <th className="py-2.5 px-3 text-center">Durasi</th>
                      <th className="py-2.5 px-3">Waktu Ujian</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b1f27]">
                    {filteredAttempts.map((item, idx) => {
                      const isPass = Number(item.score) >= 60;
                      const dateStr = item.created_at
                        ? new Date(item.created_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-";

                      return (
                        <tr key={idx} className="hover:bg-[#161a21] transition">
                          <td className="py-2.5 px-3 font-bold text-white">
                            {item.student_name}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 font-bold text-[11px] ${
                                isPass
                                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {item.score} / 100
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            <span className="text-emerald-400 font-bold">{item.correct_count}</span>
                            {" / "}
                            <span className="text-rose-400 font-bold">{item.incorrect_count}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400 text-xs">
                            {Math.floor(item.time_spent_seconds / 60)}m {item.time_spent_seconds % 60}s
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-xs">
                            {dateStr}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedAttempt(item)}
                              className="px-2 py-0.5 bg-[#171b22] hover:bg-[#202732] text-orange-400 border border-[#272e3a] font-semibold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Server-Side Active Sessions */}
      {activeTab === "actives" && (
        <div className="space-y-3">
          <div className="bg-[#12151b] border border-[#222731] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d0f12] border-b border-[#222731] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Mahasiswa</th>
                    <th className="py-2.5 px-3">Session Token</th>
                    <th className="py-2.5 px-3 text-center">Status Server</th>
                    <th className="py-2.5 px-3">Mulai Ujian</th>
                    <th className="py-2.5 px-3">Kedaluwarsa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b1f27]">
                  {activeSessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        Tidak ada sesi aktif saat ini.
                      </td>
                    </tr>
                  ) : (
                    activeSessions.map((ses, idx) => (
                      <tr key={idx} className="hover:bg-[#161a21] transition">
                        <td className="py-2.5 px-3 font-bold text-white">
                          {ses.student_name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                          {ses.session_token}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 font-bold text-[10px] ${
                              ses.status === "IN_PROGRESS"
                                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                                : ses.status === "COMPLETED"
                                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"
                                : "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {ses.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-xs">
                          {ses.started_at ? new Date(ses.started_at).toLocaleTimeString("id-ID") : "-"}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-xs">
                          {ses.expires_at ? new Date(ses.expires_at).toLocaleTimeString("id-ID") : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Questions Table */}
      {activeTab === "questions" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari teks soal atau materi..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#0d0f12] border border-[#222731] text-xs text-white outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-2.5 py-1.5 bg-[#0d0f12] border border-[#222731] text-xs text-slate-300 outline-none"
              >
                <option value="ALL">Semua Topik ({questions.length})</option>
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#12151b] border border-[#222731] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d0f12] border-b border-[#222731] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 w-36">Topik</th>
                    <th className="py-2.5 px-3 min-w-[280px]">Question (Soal &amp; Visual/LaTeX)</th>
                    <th className="py-2.5 px-3 min-w-[220px]">Answer Choices (Pilihan)</th>
                    <th className="py-2.5 px-3 w-14 text-center">Kunci</th>
                    <th className="py-2.5 px-3 min-w-[280px]">Answer Explanation (Pembahasan)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b1f27]">
                  {filteredQuestions.map((q, idx) => (
                    <tr key={idx} className="hover:bg-[#161a21] align-top">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-1.5 py-0.5 bg-[#171b22] text-orange-400 text-[10px] border border-[#29303d]">
                          {q.topic}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-200 leading-relaxed font-sans">
                        <QuestionContentRenderer content={q.question} />
                      </td>
                      <td className="py-3 px-3 space-y-1">
                        {q.options.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-1 border text-xs flex items-center gap-1.5 ${
                              opt.key === q.correct_answer
                                ? "bg-[#0e1c15] border-emerald-500/50 text-emerald-300 font-semibold"
                                : "bg-[#0d0f12] border-[#222833] text-slate-400"
                            }`}
                          >
                            <span className="font-bold w-3">{opt.key}.</span>
                            <LatexRenderer content={opt.text} />
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="w-6 h-6 bg-emerald-600 text-black font-extrabold text-xs inline-flex items-center justify-center">
                          {q.correct_answer}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-xs leading-relaxed font-sans">
                        <QuestionContentRenderer content={q.explanation} block />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#12151b] border border-[#222731] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#222731] flex items-center justify-between bg-[#0d0f12]">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Rincian Pengerjaan: {selectedAttempt.student_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Skor: <strong className="text-orange-400">{selectedAttempt.score}/100</strong> &bull;{" "}
                  {selectedAttempt.correct_count} Benar, {selectedAttempt.incorrect_count} Salah
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-[#1c222c] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                selectedAttempt.answers.map((ans, aIdx) => (
                  <div
                    key={aIdx}
                    className={`p-3 border space-y-1.5 ${
                      ans.isCorrect
                        ? "bg-[#0e1c15]/30 border-emerald-500/20"
                        : "bg-[#1f1113]/30 border-rose-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400">
                        Soal #{aIdx + 1} &bull; {ans.topic}
                      </span>
                      <span
                        className={`font-bold px-1.5 py-0.5 text-[10px] ${
                          ans.isCorrect
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {ans.isCorrect ? "Benar" : "Salah"}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-medium text-slate-200 font-sans">
                      <QuestionContentRenderer content={ans.question} />
                    </div>

                    <div className="text-xs flex items-center gap-3 pt-1">
                      <span className="text-slate-400">
                        Pilihan Mahasiswa:{" "}
                        <strong
                          className={ans.isCorrect ? "text-emerald-400" : "text-rose-400"}
                        >
                          {ans.studentAnswer || "-"}
                        </strong>
                      </span>
                      <span className="text-slate-400">
                        Kunci: <strong className="text-emerald-400">{ans.correctAnswer}</strong>
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#0d0f12] border border-[#222731] text-xs text-slate-400 font-sans">
                      <strong className="text-slate-300 block mb-0.5 font-mono">Pembahasan:</strong>
                      <QuestionContentRenderer content={ans.explanation} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  Tidak ada rincian jawaban tersimpan untuk attempt ini.
                </p>
              )}
            </div>

            <div className="p-3 border-t border-[#222731] bg-[#0d0f12] text-right">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-3 py-1.5 bg-orange-600 text-black font-bold text-xs hover:bg-orange-500 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
