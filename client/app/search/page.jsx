'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Sparkles, Film, Tv, ArrowLeft } from 'lucide-react';
import MovieCard3D from '../../components/cinematic/MovieCard3D';
import { movieService } from '../../services/movieService';

const quickSearchTags = [
  { name: '🌐 All', isAll: true },
  { name: '🔥 Trending', category: 'trending' },
  { name: '🎬 Movies', type: 'movie' },
  { name: '📺 TV Series', type: 'series' },
  { name: '⭐ Top Rated', category: 'top_rated' },
  { name: '💥 Action', genre: 'Action' },
  { name: '🚀 Sci-Fi', genre: 'Sci-Fi' },
  { name: '🎭 Drama', genre: 'Drama' },
  { name: '💎 4K UHD', resolution: '4K UHD' }
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get('type') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLanguage = searchParams.get('language') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sync searchParams from URL (e.g. when clicking sidebar Movies or TV links)
  useEffect(() => {
    setSelectedType(searchParams.get('type') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedLanguage(searchParams.get('language') || '');
  }, [searchParams]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchTerm, selectedType, selectedCategory, selectedGenre, selectedLanguage]);

  const hasActiveQuery = searchTerm.trim() !== '' || selectedType !== '' || selectedCategory !== '' || selectedGenre !== '' || selectedLanguage !== '';

  // Fetch catalog (Fetches dynamically on mount, query, or page scroll!)
  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const data = await movieService.getMovies({
          search: searchTerm,
          type: selectedType,
          category: selectedCategory,
          genre: selectedGenre,
          language: selectedLanguage,
          page,
          limit: 15
        });
        const newMovies = data.movies || [];
        if (page === 1) {
          setMovies(newMovies);
        } else {
          setMovies((prev) => {
            const ids = new Set(prev.map(m => m._id));
            const filtered = newMovies.filter(m => !ids.has(m._id));
            return [...prev, ...filtered];
          });
        }
        if (newMovies.length < 15) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        console.warn('Search query error');
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [searchTerm, selectedType, selectedCategory, selectedGenre, selectedLanguage, page]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const threshold = 150;
      const totalHeight = document.documentElement.offsetHeight;
      const currentScroll = window.innerHeight + window.scrollY;
      if (totalHeight - currentScroll <= threshold) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleTagClick = (tag) => {
    if (tag.isAll) {
      handleClear();
      return;
    }
    if (tag.type !== undefined) setSelectedType(selectedType === tag.type ? '' : tag.type);
    if (tag.category !== undefined) setSelectedCategory(selectedCategory === tag.category ? '' : tag.category);
    if (tag.genre !== undefined) setSelectedGenre(selectedGenre === tag.genre ? '' : tag.genre);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedGenre('');
    setSelectedLanguage('');
  };

  return (
    <div className="w-full px-6 sm:px-12 md:px-20 pt-4 sm:pt-10 pb-28 min-h-screen space-y-8 md:space-y-12 select-none">
      {/* Sleek Floating Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-6 md:left-28 z-50 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-cyan-500/25 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white backdrop-blur-xl shadow-2xl transition-all cursor-pointer group flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* 100% Full Width Desktop Search Header */}
      <div className="w-full space-y-6">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white flex items-center justify-start gap-3.5 tracking-tight">
          {selectedType === 'series' ? (
            <>
              <Tv className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400" />
              <span>Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">TV Series</span></span>
            </>
          ) : selectedType === 'movie' ? (
            <>
              <Film className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400" />
              <span>Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Blockbuster Movies</span></span>
            </>
          ) : (
            <>
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400" />
              <span>Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">CineVerse Catalog</span></span>
            </>
          )}
        </h1>

        {/* 100% Full Width Widescreen Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-6 sm:left-7 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies, TV shows, genres, actors, directors..."
            className="w-full pl-16 sm:pl-20 pr-16 py-5 sm:py-6 rounded-3xl bg-[#090c15]/90 border border-white/20 text-white placeholder-gray-400 text-base sm:text-xl md:text-2xl font-black shadow-[0_0_50px_rgba(6,182,212,0.3)] focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* 100% Full Width Widescreen Quick Filter Chips */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-2 px-1">
          <span className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Quick Filter:
          </span>
          {quickSearchTags.map((tag) => {
            const isTagActive =
              (tag.isAll && !hasActiveQuery) ||
              (!tag.isAll && (
                (tag.type && selectedType === tag.type) ||
                (tag.category && selectedCategory === tag.category) ||
                (tag.genre && selectedGenre === tag.genre)
              ));

            return (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm md:text-base font-extrabold flex-shrink-0 transition-all cursor-pointer border ${
                  isTagActive
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                    : 'bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border-white/10 hover:border-cyan-500/40'
                }`}
              >
                {tag.name}
              </button>
            );
          })}
          {hasActiveQuery && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs sm:text-sm font-extrabold flex-shrink-0 flex items-center gap-1.5 hover:bg-rose-500/35 cursor-pointer"
            >
              <X className="w-4 h-4" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Catalog Display Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
            {searchTerm ? (
              <>Search results for "<span className="text-cyan-400">{searchTerm}</span>"</>
            ) : selectedType === 'movie' ? (
              <>Movies Catalog</>
            ) : selectedType === 'series' ? (
              <>TV Series Catalog</>
            ) : hasActiveQuery ? (
              <>Filtered Titles</>
            ) : (
              <>All Movies & Web Series</>
            )}
          </h2>
          <span className="text-xs sm:text-sm text-gray-400 font-bold">{movies.length} titles found</span>
        </div>

        {loading && page === 1 ? (
          <div className="text-center py-24 text-cyan-400 font-black text-lg animate-pulse">
            Loading titles...
          </div>
        ) : movies.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8">
              {movies.map((movie) => (
                <MovieCard3D key={movie._id} movie={movie} />
              ))}
            </div>
            {loading && page > 1 && (
              <div className="text-center py-8 text-cyan-400 font-black text-base animate-pulse">
                Loading more titles...
              </div>
            )}
            {!hasMore && movies.length > 0 && !loading && (
              <div className="text-center py-10 text-gray-500 font-extrabold text-sm border-t border-white/5 tracking-wider uppercase">
                ✨ You've reached the end of the catalog! ✨
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
            <p className="text-gray-300 font-bold text-base">No titles match your filter selection.</p>
            <button
              onClick={handleClear}
              className="px-8 py-3 rounded-2xl bg-cyan-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-cyan-400 font-black text-lg animate-pulse">Loading Search Studio...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
