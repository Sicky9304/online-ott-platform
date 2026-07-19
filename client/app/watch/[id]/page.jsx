'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CustomVideoPlayer from '../../../components/player/CustomVideoPlayer';
import { movieService } from '../../../services/movieService';

export default function WatchPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const movieId = params?.id;
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await movieService.getMovieById(movieId);
        setMovie(data.movie);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to stream video record from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-cyan-400 font-extrabold text-lg">
        Connecting to MongoDB Stream Engine...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-2xl font-black text-rose-400">Stream Connection Failed</h2>
        <p className="text-gray-400 text-sm">{error || 'The requested video file does not exist in the database.'}</p>
        <Link href="/" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-extrabold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Sleek Floating Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 p-3.5 rounded-full bg-black/60 hover:bg-cyan-500/25 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white backdrop-blur-xl shadow-2xl transition-all cursor-pointer group flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <CustomVideoPlayer movie={movie} />
    </div>
  );
}
