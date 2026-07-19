'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Star, Film, Tv, ArrowLeft } from 'lucide-react';
import { formatDuration } from '../../../lib/utils';
import api from '../../../lib/api';

export default function SeriesDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const seriesId = params?.id;
  const router = useRouter();

  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seriesId) return;
    const fetchSeries = async () => {
      try {
        const res = await api.get(`/series/${seriesId}`);
        setSeriesData(res.data.data);
      } catch (err) {
        setSeriesData({
          series: {
            _id: seriesId,
            title: 'Aetheria: Realm of Shadows',
            description: 'When the ancient solar eclipse locks the realm in eternal twilight, an exile princess must harness forbidden dark magic to stop a legion of primordial wraiths.',
            seasonsCount: 2,
            episodesCount: 16,
            rating: 'TV-MA',
            imdbRating: 8.9,
            posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80'
          },
          episodes: Array.from({ length: 8 }, (_, idx) => ({
            _id: `ep_${idx + 1}`,
            seasonNumber: 1,
            episodeNumber: idx + 1,
            title: `Episode ${idx + 1}: The Rising Eclipse`,
            duration: 54,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80'
          }))
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [seriesId]);

  if (loading || !seriesData?.series) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-bold">
        Loading TV Series Engine...
      </div>
    );
  }

  const { series, episodes = [] } = seriesData;

  return (
    <div className="min-h-screen pb-20">
      {/* Sleek Floating Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-6 md:left-28 z-50 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-cyan-500/25 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white backdrop-blur-xl shadow-2xl transition-all cursor-pointer group flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <div className="relative w-full h-[60vh] overflow-hidden">
        <img src={series.bannerUrl} alt={series.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-20 space-y-8">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Tv className="w-3.5 h-3.5" /> TV SERIES
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {series.imdbRating} IMDb
          </span>
          <span className="text-xs text-gray-400">{series.seasonsCount} Seasons • {series.episodesCount} Episodes</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">{series.title}</h1>
        <p className="text-gray-300 text-base leading-relaxed max-w-3xl">{series.description}</p>

        {/* Season Episodes List */}
        <div className="space-y-4 pt-6">
          <h3 className="text-2xl font-bold text-white">Season 1 Episodes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {episodes.map((ep) => (
              <Link
                key={ep._id}
                href={`/watch/${ep._id}`}
                className="glass-card p-3 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 fill-cyan-400 text-cyan-400" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-400">{ep.title}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatDuration(ep.duration)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
