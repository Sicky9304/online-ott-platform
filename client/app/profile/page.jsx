'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import MovieRow from '../../components/cinematic/MovieRow';
import ThemeCustomizer from '../../components/layout/ThemeCustomizer';
import { User, Bookmark, Heart, Shield, LogOut, LogIn, UserPlus, Sparkles, Film } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();

  // Unauthenticated Hotstar "My Space" Onboarding State (Clean Onboarding Card)
  if (!user) {
    return (
      <div className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-16 overflow-hidden select-none">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hotstar My Space Unauthenticated Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-[560px] p-6 sm:p-10 md:p-12 rounded-3xl bg-[#090c15]/90 border border-white/15 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center space-y-6 sm:space-y-8"
        >
          {/* Header Icon & Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <User className="w-7 h-7 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Login to view <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">My Space</span>
            </h1>
            <p className="text-gray-300 text-xs sm:text-base font-semibold max-w-md mx-auto leading-relaxed">
              Sync your watchlist, track viewing history, and personalize your 4K streaming experience across all devices.
            </p>
          </div>

          {/* Action Buttons: Login & Sign Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto pt-1 sm:pt-4">
            <Link
              href="/login"
              className="px-6 py-3.5 sm:px-8 sm:py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm sm:text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              <LogIn className="w-5 h-5 fill-black" /> Log In
            </Link>

            <Link
              href="/register"
              className="px-6 py-3.5 sm:px-8 sm:py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(219,39,119,0.4)] transition-all transform hover:scale-105 active:scale-95 border border-pink-500/30"
            >
              <UserPlus className="w-5 h-5" /> Sign Up
            </Link>
          </div>

          {/* Perks Preview Grid */}
          <div className="hidden sm:grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <Bookmark className="w-5 h-5 text-cyan-400" />
              <div className="text-xs font-black text-white">Watchlist Sync</div>
              <div className="text-[10px] text-gray-400 font-medium">Save favorite titles</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <Film className="w-5 h-5 text-purple-400" />
              <div className="text-xs font-black text-white">4K UHD Quality</div>
              <div className="text-[10px] text-gray-400 font-medium">Ultra HD streaming</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <div className="text-xs font-black text-white">Custom Themes</div>
              <div className="text-[10px] text-gray-400 font-medium">Personalize UI look</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Hotstar Profile State (Settings ONLY shown when logged in)
  return (
    <div className="w-full px-6 sm:px-12 md:px-20 py-6 sm:py-12 min-h-screen space-y-10 sm:space-y-14">
      {/* Profile Header Glass Panel */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20"
          />
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-4xl font-black text-white">{user.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-base font-semibold mt-1">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs sm:text-sm font-black flex items-center gap-2 hover:bg-purple-500/30 transition-all"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Admin Studio
            </Link>
          )}
          <button
            onClick={logout}
            className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl glass-panel text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* App Settings & Theme Customizer (ONLY visible to Logged-In Users) */}
      <ThemeCustomizer />

      {/* User Watchlist */}
      <MovieRow title="My Watchlist" movies={user.watchlist || []} icon={Bookmark} />
      <MovieRow title="Favorite Masterpieces" movies={user.favorites || []} icon={Heart} />
    </div>
  );
}
