'use client';
import { useState, useEffect, useCallback } from 'react';
import { Play, X, Star, Film, Tv, Search, Filter, Flame, Sparkles } from 'lucide-react';
import { trailerService } from '../../services/trailerService';

// ── Trailer Card (matches MovieCard3D style) ─────────────────────────────────
function TrailerCard({ trailer, onPlay }) {
  return (
    <div className="relative flex-shrink-0 w-full group/card cursor-pointer select-none">
      {/* Vertical Poster — aspect-[2/3] like MovieCard3D */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl brightness-75 contrast-95 saturate-90 group-hover/card:brightness-110 group-hover/card:contrast-110 group-hover/card:saturate-125 group-hover/card:scale-105 group-hover/card:border-cyan-400/80 group-hover/card:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300">
        <img
          src={trailer.posterUrl}
          alt={trailer.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'; }}
        />

        {/* Ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 group-hover/card:opacity-95 transition-opacity" />

        {/* IMDb badge — top right */}
        {trailer.imdbRating && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {trailer.imdbRating}
          </div>
        )}

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
            trailer.isSeries ? 'bg-purple-500/80 text-white' : 'bg-cyan-500/80 text-black'
          }`}>
            {trailer.isSeries ? 'SERIES' : 'MOVIE'}
          </span>
        </div>

        {/* Hover overlay — Play button */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={() => onPlay(trailer)}
            className="p-3.5 rounded-full bg-cyan-500 text-black font-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] transform hover:scale-110 transition-all"
            title="Watch Trailer"
          >
            <Play className="w-6 h-6 fill-black pl-0.5" />
          </button>
        </div>

        {/* Bottom title + meta */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
          <h3 className="text-xs sm:text-sm md:text-base font-black text-gray-200 line-clamp-1 drop-shadow-md group-hover/card:text-cyan-300 transition-colors" title={trailer.title}>
            {(() => {
              // Extract string before separators like | or - to clean up YouTube titles
              const baseTitle = trailer.title.split(/[|#-]/)[0].trim();
              return baseTitle.length > 12 ? `${baseTitle.slice(0, 11)}...` : baseTitle;
            })()}
          </h3>
          <p className="text-[10px] text-gray-400 font-extrabold mt-0.5">
            {trailer.releaseYear} • {trailer.genres?.[0] || 'Drama'}
          </p>
        </div>
      </div>
    </div>
  );
}


// ── Trailer Modal ─────────────────────────────────────────────────────────────
function TrailerModal({ trailer, onClose }) {
  const ytId = trailer?.trailerUrl?.match(/embed\/([a-zA-Z0-9_-]{11})/)?.[1];

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!trailer) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video */}
        <div className="aspect-video bg-black">
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={trailer.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Trailer not available
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="bg-[#0d0d14] p-4 flex items-start gap-3">
          <img
            src={trailer.posterUrl}
            alt={trailer.title}
            className="w-14 h-20 rounded-lg object-cover flex-shrink-0 border border-white/10"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <h2 className="text-white font-black text-base sm:text-lg">{trailer.title}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {trailer.releaseYear && <span className="text-xs text-gray-400">{trailer.releaseYear}</span>}
              {trailer.language && <span className="text-xs text-cyan-400 font-semibold">{trailer.language}</span>}
              {trailer.imdbRating && (
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {trailer.imdbRating}
                </span>
              )}
            </div>
            {trailer.description && (
              <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">{trailer.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LatestTrailersPage() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [playingTrailer, setPlayingTrailer] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 48;

  const fetchTrailers = useCallback(async () => {
    setLoading(true);
    const params = { limit: LIMIT, page };
    if (activeFilter === 'movie') params.type = 'movie';
    if (activeFilter === 'series') params.type = 'series';
    if (activeFilter === 'trending') params.category = 'trending';
    if (activeFilter === 'hindi') params.language = 'Hindi Dubbed';
    if (activeFilter === 'south') params.language = 'Hindi Dubbed (South)';
    if (activeFilter === 'korean') params.language = 'Hindi Dubbed (Korean)';
    if (activeFilter === 'bhojpuri') params.language = 'Bhojpuri';
    if (search.trim()) params.search = search.trim();

    const data = await trailerService.getTrailers(params);
    setTrailers(data.trailers || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [activeFilter, search, page]);

  useEffect(() => { fetchTrailers(); }, [fetchTrailers]);

  const filters = [
    { key: 'all',      label: 'All',                   icon: Sparkles },
    { key: 'movie',    label: 'Movies',                icon: Film },
    { key: 'series',   label: 'Web Series',            icon: Tv },
    { key: 'trending', label: 'Trending',              icon: Flame },
    { key: 'hindi',    label: 'Hindi Dubbed',          icon: null },
    { key: 'south',    label: 'South Hindi Dubbed',    icon: null },
    { key: 'korean',   label: 'Korean Hindi Dubbed',   icon: null },
    { key: 'bhojpuri', label: 'Bhojpuri',              icon: null },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* ── Hero Header ── */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-cyan-900/20 to-[#050508]" />
        <div className="relative z-10 px-4 sm:px-8 md:px-16 py-12 sm:py-16">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-400">
              Latest Releases
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            🎬 Trailers & Teasers
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold mt-3 max-w-2xl leading-relaxed">
            Watch official trailers for the latest movies and web series — Bollywood, Hollywood, South & more.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search trailers..."
              className="w-full pl-11 sm:pl-13 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 text-white text-sm sm:text-base font-bold placeholder:text-gray-500 focus:outline-none focus:bg-white/8 shadow-md transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="px-4 sm:px-8 md:px-16 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {filters.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveFilter(key); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeFilter === key
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 border-cyan-400'
                  : 'bg-white/5 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {label}
            </button>
          ))}
          {total > 0 && (
            <span className="ml-auto text-xs sm:text-sm font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-xl shadow-md">
              📊 Total: {total} Trailers
            </span>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-2 md:px-6">
        {loading ? (
          <div className="flex flex-wrap items-center justify-start gap-6 py-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[160px] sm:w-[220px] md:w-[250px] lg:w-[260px] xl:w-[280px] rounded-2xl bg-white/5 animate-pulse aspect-[2/3] border border-white/10" />
            ))}
          </div>
        ) : trailers.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-gray-400 font-bold">No trailers found</h3>
            <p className="text-gray-600 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-start gap-6 py-6">
            {trailers.map((trailer) => (
              <div key={trailer._id} className="w-[160px] sm:w-[220px] md:w-[250px] lg:w-[260px] xl:w-[280px]">
                <TrailerCard
                  trailer={trailer}
                  onPlay={setPlayingTrailer}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > LIMIT && !loading && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400 font-semibold">
              Page {page} of {Math.ceil(total / LIMIT)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / LIMIT)}
              className="px-5 py-2 rounded-xl bg-cyan-500 text-black text-sm font-black disabled:opacity-30 hover:bg-cyan-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {playingTrailer && (
        <TrailerModal
          trailer={playingTrailer}
          onClose={() => setPlayingTrailer(null)}
        />
      )}
    </div>
  );
}
