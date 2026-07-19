'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Heart, Share2, Star, Sparkles, ArrowLeft } from 'lucide-react';
import MovieRow from '../../../components/cinematic/MovieRow';
import { movieService } from '../../../services/movieService';
import { formatDuration } from '../../../lib/utils';

export default function MovieDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const movieId = params?.id;
  const router = useRouter();

  const [movieData, setMovieData] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await movieService.getMovieById(movieId);
        setMovieData(data);
        const catalog = await movieService.getMovies({ limit: 12 });
        setAllMovies(catalog.movies || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movie from database');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-cyan-400 font-extrabold text-sm sm:text-lg">
        Fetching Movie Data...
      </div>
    );
  }

  if (error || !movieData?.movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-rose-400">Movie Not Found</h2>
        <p className="text-gray-400 text-xs sm:text-sm">{error || 'The requested movie record does not exist in the database.'}</p>
        <Link href="/" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-extrabold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const { movie, reviews = [] } = movieData;
  const relatedMovies = allMovies.filter((m) => m._id !== movie._id);

  return (
    <div className="min-h-screen pb-12">
      {/* Sleek Floating Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-6 md:left-28 z-50 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-cyan-500/25 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white backdrop-blur-xl shadow-2xl transition-all cursor-pointer group flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Full-Width Banner Header */}
      <div className="relative w-full h-[40vh] sm:h-[55vh] min-h-[300px] overflow-hidden -mt-14 sm:-mt-16">
        <img
          src={movie.bannerUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/70 to-transparent z-10" />
      </div>

      {/* Main Content Container Overlapping Banner */}
      <div className="w-full px-4 sm:px-8 md:px-16 relative z-20 -mt-24 sm:-mt-40 md:-mt-48">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-10 items-start">
          {/* 3D Floating Poster (Desktop) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-[1.02] transition-transform">
              <img src={movie.posterUrl} alt={movie.title} className="w-full object-cover aspect-[2/3]" />
            </div>
          </div>

          {/* Right Information Container */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Metadata Badges */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                {movie.resolution || '4K UHD'}
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {movie.imdbRating || '8.5'} IMDb
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-400 font-extrabold">{movie.matchPercentage || 98}% Match</span>
              <span className="text-[11px] sm:text-xs text-gray-300 font-semibold">{movie.releaseYear} • {formatDuration(movie.duration)} • {movie.rating || 'PG-13'}</span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">{movie.title}</h1>
              {movie.tagline && <p className="text-cyan-400 italic text-xs sm:text-base mt-1 font-medium">{movie.tagline}</p>}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-xs sm:text-base md:text-lg leading-relaxed max-w-3xl drop-shadow">{movie.description}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                href={`/watch/${movie._id}`}
                className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 text-xs sm:text-sm"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" /> Watch Movie
              </Link>
              <button className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-panel text-white hover:bg-white/15 border border-white/10 transition-all" title="Bookmark">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-panel text-white hover:bg-white/15 border border-white/10 transition-all" title="Share">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Meta Specifications Grid */}
            <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs text-gray-300">
              <div>
                <span className="text-gray-400 block mb-1 font-extrabold uppercase text-[10px] sm:text-xs">Director</span>
                <span className="font-bold text-white text-xs sm:text-sm">{movie.director || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 font-extrabold uppercase text-[10px] sm:text-xs">Starring</span>
                <span className="font-bold text-white text-xs sm:text-sm">{movie.cast?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 font-extrabold uppercase text-[10px] sm:text-xs">Genres</span>
                <span className="font-bold text-white text-xs sm:text-sm">{movie.genres?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 font-extrabold uppercase text-[10px] sm:text-xs">Language & Country</span>
                <span className="font-bold text-white text-xs sm:text-sm">{movie.language || 'English'} ({movie.country || 'USA'})</span>
              </div>
            </div>

            {/* User Reviews Section */}
            {reviews.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Audience Reviews
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {reviews.map((rev) => (
                    <div key={rev._id || rev.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} alt={rev.user?.name} className="w-7 h-7 rounded-full object-cover border border-cyan-400/50" />
                          <span className="text-xs font-bold text-gray-200">{rev.user?.name || 'Anonymous User'}</span>
                        </div>
                        <span className="text-[10px] text-amber-300 font-black bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">★ {rev.rating}/10</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Row */}
        {relatedMovies.length > 0 && (
          <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10">
            <MovieRow title="More Like This" movies={relatedMovies} icon={Sparkles} />
          </div>
        )}
      </div>
    </div>
  );
}
