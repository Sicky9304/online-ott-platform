'use client';
import { ShieldCheck, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full px-6 sm:px-12 md:px-20 py-10 sm:py-16 min-h-screen space-y-8 select-none">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Legal & Terms
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Terms of Distribution</h1>
        <p className="text-gray-400 text-sm sm:text-base font-semibold">Effective Date: January 1, 2026</p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> 1. Platform Usage & Licensing
          </h2>
          <p>
            CineVerse provides high-definition 4K streaming services for personal, non-commercial entertainment. Content streamed on CineVerse is subject to copyright protection and digital rights management (DRM).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> 2. Account Responsibility
          </h2>
          <p>
            Users are responsible for maintaining the confidentiality of their credentials and all activities occurring under their user profiles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-400" /> 3. High-Bitrate Streaming Performance
          </h2>
          <p>
            Playback quality depends on your network bandwidth and hardware capability. CineVerse automatically adjusts video bitrate to ensure smooth playback.
          </p>
        </section>
      </div>
    </div>
  );
}
