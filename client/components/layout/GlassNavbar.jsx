'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Search, Shield, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If user is admin, completely hide the top navbar as well
  if (isAdmin) {
    return null;
  }

  // Filter navLinks dynamically: If user is admin, hide all standard catalog navigation links.
  const navLinks = isAdmin ? [] : [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/search?type=movie' },
    { name: 'TV Series', path: '/search?type=series' },
    { name: 'New & Popular', path: '/search?filter=popular' },
    { name: 'My List', path: '/profile' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500">
      <div
        className={`w-full py-4 transition-all duration-500 ${
          scrolled
            ? 'glass-panel bg-black/90 shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-b border-cyan-500/20'
            : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent'
        }`}
      >
        <div className="w-[85%] mx-auto flex items-center justify-between">
          {/* Logo Brand: Admins redirect to /admin control center instead of home index */}
          <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-4 group perspective-1000">
            <motion.div
              whileHover={{ rotateY: 15, rotateX: -10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="relative p-3.5 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-300 to-purple-600 shadow-[0_0_35px_rgba(6,182,212,0.7)] border-2 border-white/60 transform-gpu"
            >
              <Film className="w-8 h-8 text-black fill-black filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              <div className="absolute -inset-1.5 rounded-2xl bg-cyan-400/50 blur-md group-hover:bg-cyan-400/80 transition-all -z-10 animate-pulse" />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black tracking-wider text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)] flex items-center gap-1.5">
                CINE<span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)]">VERSE</span>
                <span className="text-xs font-black px-2 py-0.5 ml-1 rounded-lg bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-md">3D</span>
              </span>
              <span className="text-xs font-black text-cyan-300/80 tracking-widest uppercase -mt-0.5">Ultra 4K Streaming Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Only shown when catalog navLinks has elements) */}
          {navLinks.length > 0 && (
            <nav className="hidden lg:flex items-center gap-2 p-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                const targetPath = isActive ? '/' : link.path;
                return (
                  <Link
                    key={link.path}
                    href={targetPath}
                    className={`relative px-6 py-3 rounded-xl text-base md:text-lg font-black transition-all duration-300 ${
                      isActive ? 'text-cyan-300' : 'text-gray-100 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-xl bg-cyan-500/30 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.5)] z-0"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Tools & User Menu */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Quick Search & Notification (Hidden when admin is logged in) */}
            {!isAdmin && (
              <>
                <Link
                  href="/search"
                  className="p-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-100 hover:text-cyan-300 border border-white/15 transition-all flex items-center gap-2.5 group shadow-lg"
                  title="Instant Search"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform text-cyan-400" />
                  <span className="text-base font-black text-white">Search</span>
                </Link>

                <button className="relative p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-100 hover:text-white border border-white/15 transition-all shadow-lg">
                  <Bell className="w-5.5 h-5.5 text-cyan-400" />
                  <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]" />
                </button>
              </>
            )}

            {/* Admin Studio Trigger */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-3.5 rounded-2xl bg-purple-500/35 text-purple-200 border border-purple-400/60 text-base font-black flex items-center gap-2 hover:bg-purple-500/50 transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              >
                <Shield className="w-5 h-5 text-purple-400" /> Admin Studio
              </Link>
            )}

            {/* Profile / Sign In */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3.5 p-2 pl-5 rounded-2xl bg-white/10 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-xl"
              >
                <span className="text-base font-black text-white">{user.name?.split(' ')[0]}</span>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-400/80 shadow-md shadow-cyan-500/30"
                />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-black text-sm font-black shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3.5 rounded-2xl bg-white/10 border border-white/15 text-white"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden w-full glass-panel bg-black/95 border-b border-cyan-500/40 px-8 py-6 space-y-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-black text-gray-100 hover:text-cyan-400 py-2"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-black text-purple-400 py-2"
              >
                👑 Admin Studio
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
