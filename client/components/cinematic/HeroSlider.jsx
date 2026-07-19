'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, Plus, Check, Volume2, VolumeX, Globe, ChevronDown, LogIn, UserPlus, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatDuration } from '../../lib/utils';

const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const YouTubePlayer = ({ videoId, isMuted, onVideoError }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;
    let player;

    const loadPlayer = () => {
      if (!containerRef.current) return;
      player = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: isMuted ? 1 : 0,
          controls: 0,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          disablekb: 1,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : ''
        },
        events: {
          onReady: (event) => {
            event.target.mute(); // Unmute action triggers on user click to respect mobile policy rules
            event.target.playVideo();
          },
          onError: (event) => {
            console.warn('[YT API Error]: Failed to load video with key:', videoId, 'Error Code:', event.data);
            onVideoError();
          }
        }
      });
    };

    if (!window.YT) {
      // Inject YouTube Player API script dynamically
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    } else if (window.YT.Player) {
      loadPlayer();
    } else {
      // YT object exists but not fully loaded yet
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          loadPlayer();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (player && player.destroy) {
        try {
          player.destroy();
        } catch (e) {}
      }
    };
  }, [videoId, isMuted]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default function HeroSlider({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('All');
  const [videoError, setVideoError] = useState(false);
  const { user, logout } = useAuth();
  const videoRef = useRef(null);

  // Sync selectedLang with localStorage on mount & listen to changes
  useEffect(() => {
    const handleSync = () => {
      setSelectedLang(localStorage.getItem('siteLanguage') || 'All');
    };
    handleSync();
    window.addEventListener('siteLanguageChange', handleSync);
    return () => window.removeEventListener('siteLanguageChange', handleSync);
  }, []);

  // Reset video error state on slide transitions
  useEffect(() => {
    setVideoError(false);
  }, [currentIndex]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const changeLanguage = (lang) => {
    localStorage.setItem('siteLanguage', lang);
    setSelectedLang(lang);
    window.dispatchEvent(new Event('siteLanguageChange'));
    setIsLangOpen(false);
  };

  const currentMovie = movies[currentIndex] || movies[0];

  // Resolve video URL from any available field
  const rawVideoUrl = currentMovie?.videoUrl || currentMovie?.trailerUrl || currentMovie?.providerFileId;
  const youtubeVideoId = getYouTubeVideoId(rawVideoUrl);
  const isDirectVideo = Boolean(!youtubeVideoId && rawVideoUrl && typeof rawVideoUrl === 'string' && rawVideoUrl.startsWith('http'));

  // Auto-Slide Timer (Slides every 5 seconds if no working trailer is active, or if video errored out)
  useEffect(() => {
    if (!movies.length) return;
    const hasWorkingTrailer = Boolean((youtubeVideoId && !videoError) || isDirectVideo);
    if (hasWorkingTrailer) return; // Do not auto-slide if trailer is healthy

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000); // 5 seconds slide time
    return () => clearTimeout(slideTimer);
  }, [movies.length, currentIndex, youtubeVideoId, isDirectVideo, videoError]);

  // Handle Direct MP4 Video Element Mute Toggle
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Early return ONLY AFTER ALL HOOKS HAVE BEEN DECLARED
  if (!movies.length || !currentMovie) return null;

  const handleSlideChange = (idx) => {
    setCurrentIndex(idx);
  };

  // Get exactly 2 visible preview cards (Active + Next upcoming)
  const visibleCards = [
    { movie: movies[currentIndex] || currentMovie, idx: currentIndex },
    { movie: movies[(currentIndex + 1) % movies.length] || currentMovie, idx: (currentIndex + 1) % movies.length }
  ];

  return (
    <div className="relative w-full min-h-[600px] h-[88vh] sm:h-[92vh] md:h-screen overflow-hidden bg-[#050508] select-none">
      {/* 4K FULL-BLEED BACKDROP & TRAILER CONTAINER */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentMovie._id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Layer 1: High-Res 4K Backdrop Image (Guaranteed Visual Fallback) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src={currentMovie.bannerUrl || currentMovie.posterUrl}
              alt={currentMovie.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-100 contrast-105 transform scale-105 transition-transform duration-[7000ms] ease-linear"
            />
          </div>

          {/* Layer 2: Live Video Trailer Overlay (YouTube or Direct MP4) */}
          {youtubeVideoId && !videoError ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none scale-125 overflow-hidden">
              <YouTubePlayer
                videoId={youtubeVideoId}
                isMuted={isMuted}
                onVideoError={handleVideoError}
              />
            </div>
          ) : isDirectVideo ? (
            <video
              ref={videoRef}
              key={rawVideoUrl}
              src={rawVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              disablePictureInPicture
              className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none select-none opacity-100"
            />
          ) : null}

          {/* Smooth JioHotstar Dark Vignette Fades */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/70 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/50 via-transparent to-transparent z-10 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* DESKTOP TOP-RIGHT ACTION BAR */}
      <div className="hidden md:flex absolute top-8 right-20 z-30 items-center gap-4">
        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-base border border-white/20 backdrop-blur-xl transition-all flex items-center gap-2.5 shadow-xl cursor-pointer"
          >
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>{selectedLang}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b0e17]/95 border border-white/20 backdrop-blur-2xl shadow-2xl p-2.5 z-50 overflow-hidden"
              >
                {[
                  { name: 'All Languages', val: 'All', icon: '🌐' },
                  { name: 'Hindi Dubbed', val: 'Hindi Dubbed', icon: '🇮🇳' },
                  { name: 'South Dubbed', val: 'Hindi Dubbed (South)', icon: '🇮🇳' },
                  { name: 'Korean Dubbed', val: 'Hindi Dubbed (Korean)', icon: '🇰🇷' },
                  { name: 'Bhojpuri Tadka', val: 'Bhojpuri', icon: '🎵' }
                ].map((lang) => (
                  <button
                    key={lang.val}
                    onClick={() => changeLanguage(lang.val)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-black flex items-center justify-between transition-all ${
                      selectedLang === lang.val ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{lang.icon} {lang.name}</span>
                    {selectedLang === lang.val && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button: Visible next to language selector when logged in */}
        {user && (
          <button
            onClick={logout}
            className="px-6 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-black text-base border border-rose-500/25 backdrop-blur-xl transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}

        {/* Auth Buttons: Display Login & Register ONLY when NOT logged in */}
        {!user && (
          <>
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 font-black text-base border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2.5 transform hover:scale-105"
            >
              <LogIn className="w-5 h-5" /> Login
            </Link>

            <Link
              href="/register"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-500 text-white font-black text-base border border-pink-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(219,39,119,0.4)] transition-all flex items-center gap-2.5 transform hover:scale-105"
            >
              <UserPlus className="w-5 h-5" /> Register
            </Link>
          </>
        )}
      </div>

      {/* 100% MATCH JIOHOTSTAR HERO SPOTLIGHT CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 sm:pb-14 md:pb-20 px-6 sm:px-16 md:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 w-full">
          
          {/* Left: Expanded Typography & Metadata Container with reduced opacity */}
          <div className="space-y-3 sm:space-y-5 max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl ml-0 sm:ml-4 md:ml-6 opacity-25 hover:opacity-100 transition-opacity duration-300">
            {/* 1. Giant Styled Hotstar Movie Title */}
            <motion.h1
              key={`title_${currentMovie._id || currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] leading-tight pr-10 pb-4 inline-block overflow-visible"
            >
              {currentMovie.title}
            </motion.h1>

            {/* 2. Dynamic Rank & Badge Row */}
            <div className="text-xs sm:text-base md:text-lg font-extrabold text-cyan-400 flex items-center gap-2.5 flex-wrap">
              <span className="text-cyan-300">#{currentIndex + 1} in {currentMovie.language || 'Trending'} Today</span>
              {currentMovie.categories?.length > 0 && (
                <>
                  <span>•</span>
                  <span>{currentMovie.categories[0]}</span>
                </>
              )}
              {currentMovie.tagline && (
                <>
                  <span>•</span>
                  <span className="text-amber-300 italic">{currentMovie.tagline}</span>
                </>
              )}
            </div>

            {/* 3. Specs Metadata Row */}
            <div className="text-xs sm:text-base md:text-xl font-bold text-gray-200 flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="text-white font-extrabold">{currentMovie.releaseYear}</span>
              <span className="text-gray-400">•</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#ffffff15] border border-white/20 text-xs sm:text-sm font-black text-white">{currentMovie.rating || 'U/A 16+'}</span>
              <span className="text-gray-400">•</span>
              <span>{formatDuration(currentMovie.duration)}</span>
              <span className="text-gray-400">•</span>
              <span className="text-cyan-300 font-extrabold">{currentMovie.language || 'Hindi'}</span>
            </div>

            {/* 4. Synopsis / Description */}
            <p className="text-gray-200 text-xs sm:text-base md:text-xl leading-relaxed max-w-2xl sm:max-w-3xl line-clamp-3 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {currentMovie.description}
            </p>

            {/* 5. Genres List */}
            <div className="text-xs sm:text-base md:text-lg font-extrabold text-gray-200 flex items-center gap-2.5 flex-wrap pt-1">
              {currentMovie.genres?.map((g, i) => (
                <span key={g} className="flex items-center gap-2">
                  <span className="text-white font-black">{g}</span>
                  {i < currentMovie.genres.length - 1 && <span className="text-gray-500 font-normal">|</span>}
                </span>
              ))}
            </div>

            {/* 6. Scaled Primary Action Buttons */}
            <div className="flex items-center gap-2 pt-2 sm:gap-4 sm:pt-3">
              {user ? (
                <Link
                  href={`/watch/${currentMovie._id}`}
                  className="px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-base md:text-xl flex items-center gap-1.5 sm:gap-3 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-white" /> Watch Movie
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs sm:text-base md:text-xl flex items-center gap-1.5 sm:gap-3 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-white" /> Watch Movie
                </Link>
              )}

              {/* Watch Trailer Button: Hidden when logged in. Triggers autoplay / un-mutes background player for guests */}
              {!user && (
                <button
                  onClick={() => setIsMuted(false)}
                  className="px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-xs sm:text-base md:text-xl border border-red-500/20 shadow-md flex items-center gap-1.5 sm:gap-3 transition-transform hover:scale-105 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 sm:w-6 sm:h-6" /> Showing Trailer
                </button>
              )}

              <button
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={`w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer ${
                  isWatchlisted ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Add to Watchlist"
              >
                {isWatchlisted ? <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" /> : <Plus className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* Right: Clean 2-Card Preview Bar */}
          <div className="p-2 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#080b14]/85 backdrop-blur-2xl shadow-xl flex items-center gap-2 sm:gap-4 max-w-full">
            {/* Slide Navigation Arrow Left */}
            <button
              onClick={() => handleSlideChange((currentIndex - 1 + movies.length) % movies.length)}
              className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </button>

            {/* Audio Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 sm:p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
            </button>

            {/* Slide Navigation Arrow Right */}
            <button
              onClick={() => handleSlideChange((currentIndex + 1) % movies.length)}
              className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </button>

            {/* EXACTLY 2 DOUBLE-SIZE PREVIEW CARDS */}
            <div className="hidden sm:flex items-center gap-4 py-1">
              {visibleCards.map(({ movie, idx }, i) => (
                <motion.button
                  key={`${movie._id || idx}_${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: i === 0 ? 1.05 : 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onClick={() => handleSlideChange(idx)}
                  className={`relative w-48 h-32 sm:w-64 sm:h-40 md:w-72 md:h-44 rounded-3xl overflow-hidden p-1.5 transition-all duration-300 group flex-shrink-0 cursor-pointer ${
                    i === 0
                      ? 'ring-4 ring-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8)] z-30 border-2 border-white'
                      : 'opacity-70 hover:opacity-100 hover:scale-105 z-10 border border-white/15'
                  }`}
                >
                  <img
                    src={movie.bannerUrl || movie.posterUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-125 opacity-70 pointer-events-none"
                  />

                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15">
                    <img
                      src={movie.bannerUrl || movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent ${i === 0 ? 'opacity-90' : 'opacity-60'}`} />

                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-black text-cyan-300">
                      #{idx + 1}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-left">
                      <p className="text-xs sm:text-sm md:text-base font-black text-white line-clamp-1 drop-shadow-md">
                        {movie.title}
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-300 line-clamp-1">
                        {movie.releaseYear} • {movie.genres?.[0] || 'Movie'}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
