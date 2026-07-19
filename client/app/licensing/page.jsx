'use client';
import { Award, Shield } from 'lucide-react';

export default function LicensingPage() {
  return (
    <div className="w-full px-6 sm:px-12 md:px-20 py-10 sm:py-16 min-h-screen space-y-8 select-none">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
          <Award className="w-4 h-4" /> Copyright & Rights
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Copyright & Licensing</h1>
        <p className="text-gray-400 text-sm sm:text-base font-semibold">Authorized Media Streaming Catalog</p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" /> Intellectual Property Rights
          </h2>
          <p>
            All posters, trailer streams, titles, artwork, and trademarks displayed on CineVerse belong to their respective copyright owners and studio partners.
          </p>
        </section>
      </div>
    </div>
  );
}
