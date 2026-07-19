'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard3D from './MovieCard3D';

export default function MovieRow({ title, movies = [], icon: Icon = null, isLarge = false }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies.length) return null;

  return (
    <div className="relative my-12 md:my-16 w-full px-6 sm:px-12 md:px-20 group/row overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          {Icon && <Icon className="w-7 h-7 text-cyan-400" />}
          {title}
        </h2>
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

      {/* Full Width Card Carousel Container */}
      <div
        ref={rowRef}
        className="flex items-center gap-6 overflow-x-auto scrollbar-none py-6 px-2 scroll-smooth w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <MovieCard3D key={movie._id} movie={movie} isLarge={isLarge} />
        ))}
      </div>
    </div>
  );
}
