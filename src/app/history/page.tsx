"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  History as HistoryIcon,
  RotateCcw,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { AttemptRecord } from "@/lib/supabase";

export default function HistoryPage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
    const savedName = localStorage.getItem("matdis_student_name") || sessionStorage.getItem("matdis_student_name") || "";
    setStudentName(savedName);

    try {
      const historyStr = localStorage.getItem("matdis_history");
      if (historyStr) {
        const parsed = JSON.parse(historyStr);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pengerjaan di peramban ini?")) {
      localStorage.removeItem("matdis_history");
      sessionStorage.removeItem("matdis_last_attempt");
      setHistory([]);
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222731] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>SESSION ARCHIVE &bull; LOCAL STORAGE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Riwayat Tryout Anda
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Seluruh percobaan tryout disimpan otomatis di session browser &amp; database Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-black font-bold text-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Mulai Sesi Baru</span>
          </Link>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-1.5 border border-[#272e3a] hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-500/40 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#12151b] border border-[#222731] p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-[#171b22] text-orange-400 border border-[#272e3a] flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Belum Ada Sesi Tersimpan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Silakan mulai sesi pertama Anda untuk melihat evaluasi skor dan riwayat pengerjaan di sini.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-orange-600 text-black font-bold text-xs hover:bg-orange-500 transition"
          >
            Mulai Kerjakan 20 Soal
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((record, index) => {
            const isPassed = record.score >= 60;
            const dateStr = record.created_at
              ? new Date(record.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : `Percobaan #${history.length - index}`;

            return (
              <div
                key={index}
                className="bg-[#12151b] border border-[#222731] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-orange-500/40 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 ${
                        isPassed
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {isPassed ? "LULUS" : "BELUM LULUS"}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    <span>{record.student_name || "Mahasiswa"}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {record.correct_count} Benar
                    </span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <XCircle className="w-3 h-3" />
                      {record.incorrect_count} Salah
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatDuration(record.time_spent_seconds || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#222731] gap-1">
                  <div className="text-right">
                    <span className="text-2xl font-black text-orange-400">
                      {record.score}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ 100</span>
                  </div>

                  <button
                    onClick={() => {
                      sessionStorage.setItem("matdis_last_attempt", JSON.stringify(record));
                      window.location.href = "/result";
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 cursor-pointer"
                  >
                    Buka Pembahasan &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
