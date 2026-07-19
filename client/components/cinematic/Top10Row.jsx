'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Play, Star, Plus, Check } from 'lucide-react';

const numberGradients = [
  'from-amber-500 via-yellow-300 to-white',     // 1: Gold Fire
  'from-cyan-500 via-blue-300 to-white',       // 2: Electric Cyan
  'from-pink-500 via-rose-300 to-white',       // 3: Neon Pink
  'from-purple-500 via-violet-300 to-white',   // 4: Cosmic Purple
  'from-emerald-500 via-teal-300 to-white',    // 5: Emerald Glow
  'from-red-500 via-orange-300 to-white',      // 6: Sunset Red
  'from-indigo-500 via-purple-300 to-white',   // 7: Deep Indigo
  'from-fuchsia-500 via-pink-300 to-white',    // 8: Fuchsia Flash
  'from-lime-500 via-emerald-300 to-white',    // 9: Lime Burst
  'from-amber-600 via-red-400 to-white'        // 10: Crimson Gold
];

export default function Top10Row({ movies = [] }) {
  const rowRef = useRef(null);
  const [watchlistMap, setWatchlistMap] = useState({});
  const router = useRouter();

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleWatchlist = (id, e) => {
    e.stopPropagation();
    setWatchlistMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (id) => {
    router.push(`/movie/${id}`);
  };

  const handlePlayClick = (id, e) => {
    e.stopPropagation();
    router.push(`/watch/${id}`);
  };

  // Sort movies by viewsCount and IMDb rating so #1 is ALWAYS the top hit!
  const top10Movies = [...movies]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0) || (b.imdbRating || 0) - (a.imdbRating || 0))
    .slice(0, 10);

  if (!top10Movies.length) return null;

  return (
    <div className="relative my-12 md:my-16 w-full px-6 sm:px-12 md:px-20 group/row overflow-visible select-none">
      {/* JioHotstar Top 10 Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Top 10 Movies Today
        </h2>
        <Link href="/search" className="text-sm font-extrabold text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll Controls */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/70 backdrop-blur-md text-white opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hover:bg-black/90 border border-white/20 shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/70 backdrop-blur-md text-white opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hover:bg-black/90 border border-white/20 shadow-2xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Top 10 Uniform Large Cards Carousel */}
      <div
        ref={rowRef}
        className="flex items-center gap-6 overflow-x-auto scrollbar-none py-6 px-4 scroll-smooth w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {top10Movies.map((movie, idx) => {
          const isAdded = watchlistMap[movie._id];
          const grad = numberGradients[idx % numberGradients.length];

          return (
            <div
              key={movie._id}
              onClick={() => handleCardClick(movie._id)}
              className="relative flex-shrink-0 w-[250px] sm:w-[290px] md:w-[320px] group/card cursor-pointer block"
            >
              {/* Vertical Aspect 2/3 Large Poster Card */}
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl brightness-75 contrast-95 saturate-90 group-hover/card:brightness-110 group-hover/card:contrast-110 group-hover/card:saturate-125 group-hover/card:scale-105 group-hover/card:border-cyan-400/80 group-hover/card:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                />

                {/* Ambient Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 group-hover/card:opacity-95 transition-opacity" />

                {/* Top Corner IMDb Badge */}
                {movie.imdbRating && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.imdbRating}
                  </div>
                )}

                {/* Hover Play & Watchlist Action Controls */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <button
                    onClick={(e) => handlePlayClick(movie._id, e)}
                    className="p-3.5 rounded-full bg-cyan-500 text-black font-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] transform hover:scale-110 transition-all"
                    title="Watch Now"
                  >
                    <Play className="w-6 h-6 fill-black pl-0.5" />
                  </button>
                  <button
                    onClick={(e) => toggleWatchlist(movie._id, e)}
                    className={`p-3.5 rounded-full backdrop-blur-md border transition-all transform hover:scale-110 ${
                      isAdded ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/20 text-white border-white/30 hover:bg-white/35'
                    }`}
                    title="Add to Watchlist"
                  >
                    {isAdded ? <Check className="w-6 h-6 stroke-[3]" /> : <Plus className="w-6 h-6" />}
                  </button>
                </div>

                {/* Bottom Movie Title Label */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                  <h3 className="text-base md:text-lg font-black text-gray-200 line-clamp-1 drop-shadow-md group-hover/card:text-cyan-300 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-extrabold mt-0.5">
                    {movie.releaseYear} • {movie.genres?.[0] || 'Drama'}
                  </p>
                </div>
              </div>

              {/* Dynamic Gradient Giant Number 1-10 Overlapping Bottom-Left */}
              <span className={`absolute bottom-[-20px] left-[-24px] z-30 text-[120px] sm:text-[140px] md:text-[150px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t ${grad} select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)] group-hover/card:scale-110 transition-all duration-300`}>
                {idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
