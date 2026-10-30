import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import {
  Compass,
  Cpu,
  History,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tryout Matematika Diskrit — Terminal CBT",
  description: "Platform latihan tryout dan evaluasi mandiri Matematika Diskrit berbasis Computer Based Test modern dengan pembahasan interaktif dan visual LaTeX / Digraf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#0d0f12] text-[#e6edf3] antialiased flex flex-col justify-between selection:bg-orange-500/40 selection:text-white">
        {/* Flat Terminal Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#111419] border-b border-[#222731]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-orange-600 flex items-center justify-center text-white">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white">
                    MATDIS<span className="text-orange-500">.CBT</span>
                  </span>
                </div>
              </Link>

              {/* Nav Items */}
              <div className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-[#222731]">
                <Link
                  href="/"
                  className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1a1f28] transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span>Beranda</span>
                </Link>
                <Link
                  href="/quiz"
                  className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1a1f28] transition-colors flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sesi Tes</span>
                </Link>
                <Link
                  href="/history"
                  className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1a1f28] transition-colors flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Riwayat</span>
                </Link>
              </div>
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                CBT Terminal
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>

        {/* Flat Footer */}
        <footer className="mt-auto border-t border-[#1e232d] bg-[#0c0e11] py-4 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-1.5 h-1.5 bg-orange-500" />
              <span>Matematika Diskrit CBT &bull; LaTeX &amp; Digraf Graph Engine</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>67 Bank Soal</span>
              <span>&bull;</span>
              <span>20 Soal / Sesi</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
