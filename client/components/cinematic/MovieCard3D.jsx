'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Plus, Check, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function MovieCard3D({ movie }) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (!movie) return null;

  const handleCardClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/movie/${movie._id}`);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/watch/${movie._id}`);
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    setIsWatchlisted(!isWatchlisted);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative flex-shrink-0 w-[250px] sm:w-[290px] md:w-[320px] group/card cursor-pointer block select-none"
    >
      {/* Large Vertical Aspect 2/3 Poster Card with Dull & 4K Hover Filter */}
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
            onClick={handlePlayClick}
            className="p-3.5 rounded-full bg-cyan-500 text-black font-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] transform hover:scale-110 transition-all"
            title="Watch Now"
          >
            <Play className="w-6 h-6 fill-black pl-0.5" />
          </button>
          <button
            onClick={handleWatchlistClick}
            className={`p-3.5 rounded-full backdrop-blur-md border transition-all transform hover:scale-110 ${
              isWatchlisted ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/20 text-white border-white/30 hover:bg-white/35'
            }`}
            title="Add to Watchlist"
          >
            {isWatchlisted ? <Check className="w-6 h-6 stroke-[3]" /> : <Plus className="w-6 h-6" />}
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
    </div>
  );
}
