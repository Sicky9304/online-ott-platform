'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Tv, Film, User, Sparkles, Shield, LogIn, UserPlus, LogOut, Globe, Check, Clapperboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function HotstarSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('All');
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const changeLanguage = (lang) => {
    localStorage.setItem('siteLanguage', lang);
    setSelectedLang(lang);
    window.dispatchEvent(new Event('siteLanguageChange'));
    setIsAvatarDropdownOpen(false);
  };

  // If active user is admin, hide sidebar completely (no logo, no search, no links)
  if (isAdmin) {
    return null;
  }

  // Filter menu items dynamically:
  // - If user is logged in: show TV, Movies (which hold YouTube full movies now).
  // - If user is guest: show Trailers (which has TMDB trailers) instead of Movies/TV.
  const desktopMenuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    ...(user
      ? [
          { name: 'TV', path: '/search?type=series', icon: Tv },
          { name: 'Movies', path: '/search?type=movie', icon: Film }
        ]
      : [{ name: 'Trailers', path: '/latest-trailers', icon: Clapperboard }]
    ),
    { name: 'My Space', path: '/profile', icon: User }
  ];

  const mobileBottomItems = [
    { name: 'Home', path: '/', icon: Home },
    ...(user
      ? [
          { name: 'TV', path: '/search?type=series', icon: Tv },
          { name: 'Movies', path: '/search?type=movie', icon: Film }
        ]
      : [{ name: 'Trailers', path: '/latest-trailers', icon: Clapperboard }]
    ),
    { name: 'My Space', path: '/profile', icon: User }
  ];

  return (
    <>
      {/* MOBILE TOP HEADER BAR (md:hidden - Logo Icon Only + Search + Profile Avatar) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#050508]/95 backdrop-blur-xl border-b border-white/10 px-3 py-2 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-cyan-400 fill-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
        </Link>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link href="/search" className="p-1.5 rounded-full bg-white/10 text-gray-200 hover:text-white transition-colors">
            <Search className="w-4 h-4 text-cyan-400" />
          </Link>

          {/* Profile Avatar Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt=""
                className="w-7 h-7 rounded-full object-cover border-2 border-cyan-400/80 shadow-md cursor-pointer"
              />
            </button>

            {/* Avatar Dropdown Menu */}
            <AnimatePresence>
              {isAvatarDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090c15]/95 border border-white/20 backdrop-blur-2xl shadow-2xl p-3 z-50 space-y-3"
                >
                  {/* Language Selector */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider px-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Select Language
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      {[
                        { label: 'All', val: 'All' },
                        { label: 'Hindi', val: 'Hindi Dubbed' },
                        { label: 'South', val: 'Hindi Dubbed (South)' },
                        { label: 'Korean', val: 'Hindi Dubbed (Korean)' },
                        { label: 'Bhojpuri', val: 'Bhojpuri' }
                      ].map((lang) => (
                        <button
                          key={lang.val}
                          onClick={() => changeLanguage(lang.val)}
                          className={`px-2 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                            selectedLang === lang.val ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{lang.label}</span>
                          {selectedLang === lang.val && <Check className="w-3 h-3 text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auth Actions (Only show Login/Register if NOT logged in) */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    {!user ? (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsAvatarDropdownOpen(false)}
                          className="w-full p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center gap-2 border border-cyan-500/40 hover:bg-cyan-500/30"
                        >
                          <LogIn className="w-4 h-4" /> Log In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsAvatarDropdownOpen(false)}
                          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs flex items-center gap-2 shadow-md hover:from-pink-500 hover:to-purple-500"
                        >
                          <UserPlus className="w-4 h-4" /> Sign Up / Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setIsAvatarDropdownOpen(false)}
                          className="w-full p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center gap-2 border border-cyan-500/30"
                        >
                          <User className="w-4 h-4" /> {user.name} (My Space)
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsAvatarDropdownOpen(false)}
                            className="w-full p-2.5 rounded-xl bg-purple-500/20 text-purple-300 font-black text-xs flex items-center gap-2 border border-purple-500/30"
                          >
                            <Shield className="w-4 h-4" /> Admin Studio
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setIsAvatarDropdownOpen(false); }}
                          className="w-full p-2.5 rounded-xl bg-rose-500/20 text-rose-300 font-black text-xs flex items-center gap-2 border border-rose-500/30"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR (md:flex - Zero Border Line, All-Around Icon Margins) */}
      <motion.div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        animate={{ width: isExpanded ? '230px' : '76px' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 bg-gradient-to-r from-[#050508]/95 via-[#050508]/75 to-transparent backdrop-blur-md flex-col justify-between py-5 overflow-hidden select-none"
      >
        {/* Top Brand Star Logo */}
        <div className="flex flex-col items-center px-3 space-y-4">
          <Link href="/" className="flex items-center gap-2.5 w-full">
            <div className="m-1.5 p-1.5 text-cyan-400 flex-shrink-0">
              <Sparkles className="w-8 h-8 fill-cyan-400 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            </div>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-black tracking-wider text-white"
              >
                CINE<span className="text-cyan-400">VERSE</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Main Desktop Sidebar Navigation */}
        <nav className="flex-1 flex flex-col justify-center px-2 space-y-2.5">
          {desktopMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-2 px-2 py-2 rounded-2xl transition-all duration-300 relative group ${
                  isActive ? 'text-white font-black bg-white/10 shadow-md backdrop-blur-md' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Icon Wrapper with All-Side Margin */}
                <div className="m-1.5 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5.5 h-5.5 ${isActive ? 'text-cyan-400 fill-cyan-400/20' : ''}`} />
                </div>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm md:text-base font-black tracking-wide whitespace-nowrap pl-1"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-2 py-2 rounded-2xl text-purple-400 hover:text-purple-300 hover:bg-white/10"
            >
              <div className="m-1.5 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5.5 h-5.5" />
              </div>
              {isExpanded && <span className="text-sm md:text-base font-black whitespace-nowrap pl-1">Admin Panel</span>}
            </Link>
          )}
        </nav>

        {/* Bottom Profile Avatar */}
        <div className="px-3">
          <Link href="/profile" className="flex items-center gap-2.5 w-full group">
            <div className="m-1.5 flex-shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt=""
                className="w-8 h-8 rounded-full object-cover border-2 border-white/20 group-hover:border-cyan-400 transition-colors shadow-md"
              />
            </div>
            {isExpanded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left">
                <div className="text-xs font-black text-gray-200 line-clamp-1">{user ? user.name : 'My Space'}</div>
              </motion.div>
            )}
          </Link>
        </div>
      </motion.div>

      {/* MOBILE BOTTOM NAVIGATION BAR (md:hidden - Rock Solid Fixed Dynamic Grid) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-[9990] bg-[#090c15]/98 backdrop-blur-2xl border-t border-white/15 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] grid gap-1 shadow-[0_-15px_35px_rgba(0,0,0,0.95)]`}
           style={{ gridTemplateColumns: `repeat(${mobileBottomItems.length}, minmax(0, 1fr))` }}>
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all ${
                isActive ? 'text-cyan-400 font-black bg-white/5' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'fill-cyan-400/20 text-cyan-400' : ''}`} />
              <span className="text-[9.5px] font-bold tracking-tight line-clamp-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
