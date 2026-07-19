'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Shield, Sparkles, Globe, Cpu, ArrowUp, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-cyan-500/20 bg-[#050508]/90 backdrop-blur-2xl mt-12 pt-12 pb-12 w-full select-none">
      <div className="w-full px-6 sm:px-12 md:px-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand & Platform Bio */}
        <div className="sm:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-300 to-purple-600 shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-white/40">
              <Film className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-wider">
              CINE<span className="text-cyan-400">VERSE</span>
              <span className="text-xs font-black px-2 py-0.5 ml-1.5 rounded-lg bg-cyan-500/30 text-cyan-300 border border-cyan-400/50">3D</span>
            </span>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-bold max-w-md">
            An enterprise-grade luxury cinematic OTT platform designed for streaming premium media catalogs with 4K UHD video player and high-bitrate streaming.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-black text-cyan-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40">
              <Globe className="w-4 h-4 text-cyan-400" /> Multi-Region NVMe CDN
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Cpu className="w-4 h-4 text-purple-400" /> 4K Stream Engine
            </span>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-sm sm:text-base md:text-lg font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Navigation
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm md:text-base font-bold text-gray-200">
            <li><Link href="/" className="hover:text-cyan-300 transition-colors">Home Spotlight</Link></li>
            <li><Link href="/search?type=movie" className="hover:text-cyan-300 transition-colors">Movies Catalog</Link></li>
            <li><Link href="/search?type=series" className="hover:text-cyan-300 transition-colors">TV Series</Link></li>
            <li><Link href="/search" className="hover:text-cyan-300 transition-colors">Catalog Search</Link></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-3">
          <h4 className="text-sm sm:text-base md:text-lg font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> Legal & Rights
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm md:text-base font-bold text-gray-300">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Distribution</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/licensing" className="hover:text-white transition-colors">Copyright & Licensing</Link></li>
            <li><Link href="/security" className="hover:text-white transition-colors">Content Security</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright & Back to Top Bar */}
      <div className="w-full px-6 sm:px-12 md:px-20 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm font-bold text-gray-300 gap-4">
        <p>© 2026 CineVerse Platform Inc. All rights reserved.</p>

        <div className="flex items-center gap-4">
          <p className="text-cyan-400 flex items-center gap-1.5 font-black text-sm">
            Built with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline-block" /> by Sicky Kumar
          </p>

          {/* Working Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all transform hover:scale-110 active:scale-95 flex items-center gap-1.5 font-black text-xs cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="hidden sm:inline">Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
