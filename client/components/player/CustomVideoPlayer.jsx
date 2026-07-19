'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, PictureInPicture2, ArrowLeft, Star, Sparkles, Check, Plus,
  RotateCcw, RotateCw, Subtitles, Share2, ThumbsUp, HelpCircle, X, Sun,
  MessageCircle, Facebook, Twitter, Copy
} from 'lucide-react';
import { formatTime } from '../../lib/utils';
import { movieService } from '../../services/movieService';
import { useAuth } from '../../hooks/useAuth';

export default function CustomVideoPlayer({ movie }) {
  const router = useRouter();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(movie?.duration ? movie.duration * 60 : 0);
  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('4K UHD');
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1420);
  const [selectedSubtitle, setSelectedSubtitle] = useState('Off');
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [showHotkeysModal, setShowHotkeysModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gesture HUD States
  const [hudFeedback, setHudFeedback] = useState(null);
  const hudTimeoutRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, initialVol: 1, initialBright: 100, isRightSide: false });

  const [videoSrc, setVideoSrc] = useState(null);
  const controlsTimeoutRef = useRef(null);

  // YouTube IFrame Player API Integration
  const ytPlayerRef = useRef(null);
  const ytContainerRef = useRef(null);
  const ytIntervalRef = useRef(null);
  const isYouTube = videoSrc && (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be'));

  // Extract YouTube video ID from any YouTube URL format
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:embed\/|v=|v\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.YT && window.YT.Player) return;
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }, []);

  // Initialize or update YouTube player when source changes
  useEffect(() => {
    if (!isYouTube || typeof window === 'undefined') return;
    const ytId = getYouTubeId(videoSrc);
    if (!ytId) return;

    const initPlayer = () => {
      // Destroy existing player
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        try { ytPlayerRef.current.destroy(); } catch (e) {}
        ytPlayerRef.current = null;
      }

      ytPlayerRef.current = new window.YT.Player('yt-player-container', {
        videoId: ytId,
        playerVars: {
          autoplay: 1,
          controls: 1,        // Show YouTube native controls
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 0,        // Enable keyboard controls
          playsinline: 1,
          fs: 1,               // Enable YouTube native fullscreen
          origin: typeof window !== 'undefined' ? window.location.origin : ''
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setIsPlaying(true);
            setDuration(event.target.getDuration() || movie?.duration * 60 || 0);
            // Sync time every 250ms
            if (ytIntervalRef.current) clearInterval(ytIntervalRef.current);
            ytIntervalRef.current = setInterval(() => {
              if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
                setCurrentTime(ytPlayerRef.current.getCurrentTime());
                const dur = ytPlayerRef.current.getDuration();
                if (dur > 0) setDuration(dur);
              }
            }, 250);
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          }
        }
      });
    };

    // Wait for YT API to load
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (ytIntervalRef.current) clearInterval(ytIntervalRef.current);
    };
  }, [videoSrc, isYouTube]);

  // Attach native PiP DOM event listeners (HTML5 video only)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, []);

  // Sync Watchlist State
  useEffect(() => {
    if (user?.watchlist && movie?._id) {
      const inList = user.watchlist.some((item) => (item._id || item) === movie._id);
      setIsWatchlisted(inList);
    }
  }, [user, movie]);

  // Resolve safe working video URL
  useEffect(() => {
    if (movie) {
      const url = movie.videoUrl || movie.trailerUrl || movie.providerFileId;
      if (url && typeof url === 'string' && url.startsWith('http')) {
        setVideoSrc(url);
      } else if (url && typeof url === 'string') {
        setVideoSrc(`/api/storage/stream/${url}`);
      }
    }
  }, [movie]);

  // Reload HTML5 video element whenever videoSrc updates & auto play (non-YouTube only)
  useEffect(() => {
    if (isYouTube) return; // YouTube handled separately
    if (videoRef.current && videoSrc) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [videoSrc, isYouTube]);

  // Show Temporary On-Screen Gesture HUD Indicator
  const triggerHud = (type, value) => {
    setHudFeedback({ type, value });
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setHudFeedback(null);
    }, 1200);
  };

  // Auto save watch progress every 5 seconds
  useEffect(() => {
    if (!isPlaying || !movie?._id) return;
    const interval = setInterval(() => {
      if (videoRef.current) {
        movieService.updateWatchProgress(
          movie._id,
          Math.floor(videoRef.current.currentTime),
          Math.floor(videoRef.current.duration || duration)
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, movie, duration]);

  // Handle Controls Hiding on Inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 1000);
  };

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'j':
        case 'arrowleft':
          e.preventDefault();
          seekRelative(-10);
          triggerHud('seekLeft', '-10s');
          break;
        case 'l':
        case 'arrowright':
          e.preventDefault();
          seekRelative(10);
          triggerHud('seekRight', '+10s');
          break;
        case '?':
          e.preventDefault();
          setShowHotkeysModal((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, volume]);

  const togglePlay = () => {
    if (isYouTube && ytPlayerRef.current) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
      return;
    }
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (isYouTube && ytPlayerRef.current) {
      if (isMuted) {
        ytPlayerRef.current.unMute();
        setIsMuted(false);
      } else {
        ytPlayerRef.current.mute();
        setIsMuted(true);
      }
      return;
    }
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (newVol) => {
    const clamped = Math.min(1, Math.max(0, newVol));
    if (isYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.setVolume(clamped * 100);
      setVolume(clamped);
      setIsMuted(clamped === 0);
      return;
    }
    if (!videoRef.current) return;
    videoRef.current.volume = clamped;
    setVolume(clamped);
    setIsMuted(clamped === 0);
  };

  const seekRelative = (seconds) => {
    if (isYouTube && ytPlayerRef.current) {
      const newTime = Math.min(duration, Math.max(0, ytPlayerRef.current.getCurrentTime() + seconds));
      ytPlayerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
      return;
    }
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, Math.max(0, videoRef.current.currentTime + seconds));
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (isYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(seekTime, true);
      setCurrentTime(seekTime);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled && videoRef.current.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.warn('PiP not supported or user cancelled:', err);
    }
  };

  // DESKTOP & MOBILE CLICK/DOUBLE-CLICK HANDLERS
  const handleVideoClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    clickTimeoutRef.current = setTimeout(() => {
      togglePlay();
      clickTimeoutRef.current = null;
    }, 250);
  };

  const handleVideoDoubleClick = (e) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isRightSide = clickX > rect.width / 2;

    if (isRightSide) {
      seekRelative(10);
      triggerHud('seekRight', '+10s');
    } else {
      seekRelative(-10);
      triggerHud('seekLeft', '-10s');
    }
  };

  // TOUCH SWIPE GESTURES
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const isRight = touchX > rect.width / 2;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialVol: volume,
      initialBright: brightness,
      isRightSide: isRight
    };
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = touchStartRef.current.y - touch.clientY;
    const sensitivity = 0.005;

    if (Math.abs(deltaY) > 10) {
      if (touchStartRef.current.isRightSide) {
        const newVol = Math.min(1, Math.max(0, touchStartRef.current.initialVol + deltaY * sensitivity));
        changeVolume(newVol);
        triggerHud('volume', `${Math.round(newVol * 100)}%`);
      } else {
        const newBright = Math.min(150, Math.max(20, touchStartRef.current.initialBright + deltaY * 0.4));
        setBrightness(newBright);
        triggerHud('brightness', `${Math.round(newBright)}%`);
      }
    }
  };

  // 100% Hotstar Native Watchlist Sync
  const handleToggleWatchlist = async () => {
    if (!movie?._id) return;
    setIsWatchlisted((prev) => !prev);
    try {
      await movieService.toggleWatchlist(movie._id);
    } catch (err) {
      console.warn('Watchlist sync error');
    }
  };

  // Share Setup
  const currentShareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Watch ${movie?.title || 'this title'} on CineVerse!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050508] text-white flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none">
      {/* Top Navigation Header Bar */}
      <div className="w-full max-w-[98vw] mx-auto flex items-center justify-end py-2 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-base font-black text-cyan-400 flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/15 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" /> 4K Cinema Engine
          </span>
        </div>
      </div>

      {/* Touch & Double-Click Enabled Player Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onDoubleClick={handleVideoDoubleClick}
        style={{ minHeight: 'calc(78vh + 10px)' }}
        className={`relative w-full max-w-[98vw] mx-auto aspect-video sm:h-[75vh] md:h-[82vh] rounded-3xl overflow-hidden bg-black border border-white/20 transition-shadow duration-500 flex items-center justify-center group ${
          ambientGlow ? 'shadow-[0_0_90px_rgba(6,182,212,0.4)]' : 'shadow-2xl'
        }`}
      >
        {/* YouTube Player (controlled via IFrame API with NO YouTube controls) */}
        {isYouTube ? (
          <div id="yt-player-container" className="w-full h-full pointer-events-auto" />
        ) : videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            style={{ filter: `brightness(${brightness}%)` }}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || duration)}
            onClick={handleVideoClick}
            className="w-full h-full object-cover cursor-pointer transition-[filter] duration-100"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ON-SCREEN GESTURE HUD FEEDBACK */}
        {hudFeedback && (
          <div className="absolute z-50 pointer-events-none flex items-center justify-center inset-0">
            {hudFeedback.type === 'volume' && (
              <div className="px-6 py-4 rounded-3xl bg-black/85 border border-cyan-500/40 backdrop-blur-2xl text-cyan-400 font-black text-xl flex items-center gap-3 shadow-[0_0_50px_rgba(6,182,212,0.6)] animate-bounce">
                <Volume2 className="w-8 h-8 text-cyan-400" />
                <span>Volume: {hudFeedback.value}</span>
              </div>
            )}
            {hudFeedback.type === 'brightness' && (
              <div className="px-6 py-4 rounded-3xl bg-black/85 border border-amber-500/40 backdrop-blur-2xl text-amber-300 font-black text-xl flex items-center gap-3 shadow-[0_0_50px_rgba(245,158,11,0.6)] animate-bounce">
                <Sun className="w-8 h-8 text-amber-400" />
                <span>Brightness: {hudFeedback.value}</span>
              </div>
            )}
            {hudFeedback.type === 'seekLeft' && (
              <div className="absolute left-16 px-6 py-4 rounded-full bg-cyan-500/90 text-black font-black text-2xl flex items-center gap-2 shadow-[0_0_50px_rgba(6,182,212,0.8)] animate-pulse">
                <RotateCcw className="w-8 h-8" />
                <span>{hudFeedback.value}</span>
              </div>
            )}
            {hudFeedback.type === 'seekRight' && (
              <div className="absolute right-16 px-6 py-4 rounded-full bg-cyan-500/90 text-black font-black text-2xl flex items-center gap-2 shadow-[0_0_50px_rgba(6,182,212,0.8)] animate-pulse">
                <span>{hudFeedback.value}</span>
                <RotateCw className="w-8 h-8" />
              </div>
            )}
          </div>
        )}

        {/* TOP RIGHT CORNER: Settings & Stream Controls Bar */}
        {!isYouTube && (
          <div
            className={`absolute top-4 right-4 z-40 flex items-center gap-3 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Subtitles CC Toggle */}
            <button
              onClick={() => setSelectedSubtitle(selectedSubtitle === 'Off' ? 'English' : selectedSubtitle === 'English' ? 'Hindi' : 'Off')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 border shadow-md ${
                selectedSubtitle !== 'Off' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black/70 hover:bg-black/90 text-gray-200 border-white/20 backdrop-blur-md'
              }`}
              title="Subtitles / Captions"
            >
              <Subtitles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>CC: {selectedSubtitle}</span>
            </button>

            {/* Ambient Glow Toggle */}
            <button
              onClick={() => setAmbientGlow(!ambientGlow)}
              className="p-3 rounded-2xl bg-black/70 hover:bg-black/90 text-cyan-300 border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Toggle Ambient Glow"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Hotkeys Modal Help Button */}
            <button
              onClick={() => setShowHotkeysModal(true)}
              className="p-3 rounded-2xl bg-black/70 hover:bg-black/90 text-gray-200 border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Top-Right Double-Size Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2.5 rounded-2xl bg-cyan-500 text-black hover:bg-cyan-400 font-black border border-cyan-400 backdrop-blur-md transition-all cursor-pointer shadow-xl flex items-center gap-2"
                title="Stream Quality & Speed Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-black">{selectedQuality}</span>
              </button>

              {/* DOUBLE-SIZE VERTICAL STACKED SETTINGS DROPDOWN */}
              {showSettings && (
                <div className="absolute top-14 right-0 w-72 sm:w-80 bg-[#090c15]/98 border border-white/30 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Quality Options</span>
                      <span className="text-[10px] text-gray-400 font-bold">Vertical List</span>
                    </div>
                    {/* Vertical Stacked Quality List */}
                    <div className="flex flex-col gap-2">
                      {['720p', '1080p', '4K UHD'].map((q) => (
                        <button
                          key={q}
                          onClick={() => { setSelectedQuality(q); setShowSettings(false); }}
                          className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-between ${
                            selectedQuality === q
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/30'
                              : 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <Check className="w-4 h-4 text-black stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/15">
                    <div className="text-xs font-black text-cyan-400 uppercase tracking-wider">Playback Speed</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[0.5, 1.0, 1.25, 1.5, 2.0].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setPlaybackSpeed(s);
                            if (videoRef.current) videoRef.current.playbackRate = s;
                            setShowSettings(false);
                          }}
                          className={`py-2 rounded-xl text-xs font-black transition-all ${
                            playbackSpeed === s
                              ? 'bg-cyan-500 text-black shadow-md'
                              : 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Subtitle Overlay */}
        {selectedSubtitle !== 'Off' && !isYouTube && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-center pointer-events-none">
            <p className="text-sm sm:text-lg font-black text-yellow-300 drop-shadow-md">
              [{selectedSubtitle}] Enjoying {movie?.title || 'this title'} in crystal clear 4K UHD.
            </p>
          </div>
        )}

        {/* Center Big Play Button (When Paused) */}
        {!isPlaying && !isYouTube && (
          <button
            onClick={togglePlay}
            className="absolute z-30 p-5 sm:p-7 rounded-full bg-cyan-500/90 text-black shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-110 transition-all cursor-pointer"
          >
            <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-black ml-1" />
          </button>
        )}

        {/* Clean Ultra-Streamlined Bottom Player Controls Bar */}
        {!isYouTube && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-40 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Progress Scrubber Bar */}
            <div className="relative mb-3 flex items-center group/scrubber">
              <input
                type="range"
                min="0"
                max="100"
                value={duration > 0 ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 group-hover/scrubber:h-2.5 transition-all"
              />
            </div>

            {/* Clean Bottom Control Tools */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-5">
                <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors cursor-pointer">
                  {isPlaying ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />}
                </button>

                {/* 10s Rewind / Fast Forward */}
                <button onClick={() => { seekRelative(-10); triggerHud('seekLeft', '-10s'); }} className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer" title="Rewind 10s">
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button onClick={() => { seekRelative(10); triggerHud('seekRight', '+10s'); }} className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer" title="Forward 10s">
                  <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} className="text-gray-300 hover:text-white cursor-pointer">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-16 sm:w-24 h-1.5 bg-white/20 rounded appearance-none cursor-pointer accent-cyan-400 opacity-0 group-hover/vol:opacity-100 transition-opacity"
                  />
                </div>

                {/* Timecode */}
                <span className="text-xs sm:text-sm font-mono text-gray-200 font-black">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Tools: Working PiP & Fullscreen */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePiP}
                  className={`transition-colors cursor-pointer p-1 rounded-lg ${
                    isPiP ? 'text-cyan-400 bg-cyan-500/20' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Picture in Picture"
                >
                  <PictureInPicture2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button onClick={toggleFullscreen} className="text-gray-300 hover:text-white cursor-pointer" title="Fullscreen">
                  {isFullscreen ? <Minimize className="w-5 h-5 sm:w-6 sm:h-6" /> : <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Under-Player Large Desktop Font Details & Actions Card */}
      <div className="w-full max-w-[98vw] mx-auto mt-4 p-5 sm:p-7 rounded-3xl bg-[#090c15]/90 border border-white/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="space-y-2 text-left w-full sm:w-auto">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{movie?.title}</h1>
            <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm font-black text-white">
              {movie?.rating || 'U/A 16+'}
            </span>
            {movie?.imdbRating && (
              <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <Star className="w-4 h-4 fill-amber-400" /> {movie.imdbRating} IMDb
              </span>
            )}
          </div>
          <p className="text-gray-200 text-xs sm:text-base md:text-lg font-semibold max-w-4xl leading-relaxed">
            {movie?.description}
          </p>
        </div>

        {/* Action Buttons: Like, Share, Watchlist */}
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleLike}
            className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
              isLiked ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* 100% HOTSTAR SHARE BUTTON */}
          <button
            onClick={() => setShowShareModal(true)}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span>Share</span>
          </button>

          {/* 100% HOTSTAR WATCHLIST BUTTON */}
          <button
            onClick={handleToggleWatchlist}
            className={`px-6 py-3 rounded-2xl border text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
              isWatchlisted ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            {isWatchlisted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />} Watchlist
          </button>
        </div>
      </div>

      {/* 100% JIOHOTSTAR NATIVE SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-lg bg-[#090c15] border border-white/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                <Share2 className="w-7 h-7 text-cyan-400" /> Share Title
              </h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Title & Banner Preview */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <img
                src={movie?.bannerUrl || movie?.posterUrl}
                alt={movie?.title}
                className="w-16 h-16 rounded-xl object-cover border border-white/20"
              />
              <div>
                <h4 className="text-base font-black text-white">{movie?.title}</h4>
                <p className="text-xs text-gray-400 font-bold">{movie?.releaseYear} • {movie?.language || 'Hindi'}</p>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentShareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex flex-col items-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-7 h-7" />
                <span className="text-xs font-black">WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 flex flex-col items-center gap-2 transition-all cursor-pointer"
              >
                <Facebook className="w-7 h-7" />
                <span className="text-xs font-black">Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentShareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 flex flex-col items-center gap-2 transition-all cursor-pointer"
              >
                <Twitter className="w-7 h-7" />
                <span className="text-xs font-black">Twitter / X</span>
              </a>
            </div>

            {/* Copy Link Input Bar */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Direct Link</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentShareUrl}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-xs text-gray-300 font-mono focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
                    copiedLink ? 'bg-emerald-500 text-black' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOUBLE-SIZE KEYBOARD HOTKEYS MODAL */}
      {showHotkeysModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-xl sm:max-w-2xl bg-[#090c15] border border-white/30 rounded-3xl p-8 sm:p-10 space-y-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-cyan-400" /> Keyboard Shortcuts Guide
              </h3>
              <button onClick={() => setShowHotkeysModal(false)} className="p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 text-sm sm:text-base font-black text-gray-200">
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span>Play / Pause Toggle</span>
                <span className="text-cyan-400 font-mono text-base px-3 py-1 bg-cyan-500/20 rounded-xl border border-cyan-500/30">Space or K</span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span>Toggle Fullscreen</span>
                <span className="text-cyan-400 font-mono text-base px-3 py-1 bg-cyan-500/20 rounded-xl border border-cyan-500/30">F</span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span>Mute / Unmute Audio</span>
                <span className="text-cyan-400 font-mono text-base px-3 py-1 bg-cyan-500/20 rounded-xl border border-cyan-500/30">M</span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span>Seek Back / Forward 10 Seconds</span>
                <span className="text-cyan-400 font-mono text-base px-3 py-1 bg-cyan-500/20 rounded-xl border border-cyan-500/30">J / L or ← / →</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
