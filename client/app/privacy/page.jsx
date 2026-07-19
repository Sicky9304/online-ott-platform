'use client';
import { Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full px-6 sm:px-12 md:px-20 py-10 sm:py-16 min-h-screen space-y-8 select-none">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
          <Lock className="w-4 h-4" /> Data Privacy & Protection
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Privacy Policy</h1>
        <p className="text-gray-400 text-sm sm:text-base font-semibold">Last Updated: January 2026</p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" /> Information We Collect
          </h2>
          <p>
            We collect profile information (such as name and email address) and viewing metrics to deliver personalized content recommendations and sync watch history across your devices.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" /> Data Security & Encryption
          </h2>
          <p>
            Your credentials and session tokens are encrypted using industry-standard JWT protocols and bcrypt salted hashing.
          </p>
        </section>
      </div>
    </div>
  );
}
