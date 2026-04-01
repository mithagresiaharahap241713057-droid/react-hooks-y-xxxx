"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react"; // Opsional: jika ingin pakai icon library

export default function NotAuthorized() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="bg-white/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center text-center">
        
        {/* Kontainer Gambar/Video */}
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 bg-black shadow-inner">
          <img 
            src="/MITHA.gif" // Ganti dengan path file video/gambar kamu
            alt="ketikkan keyboard"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ikon Silang Merah */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500 text-3xl">❌</span>
          <h1 className="text-2xl font-bold text-slate-800">Anda belum login</h1>
        </div>

        {/* Pesan Sub-text */}
        <p className="text-slate-700 mb-8">
          Silakan login terlebih dahulu
        </p>

        {/* Tombol Kembali */}
        <Link 
          href="/auth/login"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all shadow-md active:scale-95"
        >
          <ArrowLeft size={18} />
          Kembali
        </Link>
      </div>
    </main>
  );
}