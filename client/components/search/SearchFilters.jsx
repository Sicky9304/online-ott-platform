'use client';
import { Search, RotateCcw } from 'lucide-react';

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedLanguage,
  setSelectedLanguage,
  selectedRating,
  setSelectedRating,
  onReset
}) {
  const categories = [
    { label: 'All Categories', value: '' },
    { label: '🔥 Trending', value: 'trending' },
    { label: '⭐ Top Rated', value: 'top_rated' },
    { label: '✨ Popular', value: 'popular' },
    { label: '🏆 Hero Featured', value: 'featured' },
    { label: '🇮🇳 Hindi Language', value: 'hindi' },
    { label: '🇬🇧 English Language', value: 'english' },
    { label: '🇮🇳 Telugu Language', value: 'telugu' },
    { label: '🇮🇳 Tamil Language', value: 'tamil' },
    { label: '🇪🇸 Spanish Language', value: 'spanish' },
    { label: '🇫🇷 French Language', value: 'french' }
  ];

  const genres = ['Action', 'Adventure', 'Cyberpunk', 'Drama', 'Fantasy', 'Mystery', 'Sci-Fi', 'Thriller'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese'];
  const ratings = ['PG', 'PG-13', 'R', 'TV-MA'];
  const years = [2026, 2025, 2024, 2023, 2022];

  return (
    <div className="glass-panel p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3.5 sm:space-y-6 border border-cyan-500/20 shadow-2xl mb-6 sm:mb-10 w-full max-w-full overflow-hidden">
      {/* Instant Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies by title, director, cast..."
          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />
      </div>

      {/* Responsive Filter Dropdowns (1-column on mobile, 2-column on sm, 6-column on lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 w-full">
        {/* Category Select */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-extrabold text-cyan-400 mb-1 uppercase tracking-wider">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2.5 sm:p-3 rounded-xl bg-black/70 border border-cyan-500/30 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} className="bg-gray-900 text-white">{c.label}</option>
            ))}
          </select>
        </div>

        {/* Genre Select */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-extrabold text-gray-300 mb-1 uppercase tracking-wider">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full p-2.5 sm:p-3 rounded-xl bg-black/70 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g} className="bg-gray-900 text-white">{g}</option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-extrabold text-gray-300 mb-1 uppercase tracking-wider">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2.5 sm:p-3 rounded-xl bg-black/70 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y} className="bg-gray-900 text-white">{y}</option>
            ))}
          </select>
        </div>

        {/* Language Select */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-extrabold text-gray-300 mb-1 uppercase tracking-wider">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2.5 sm:p-3 rounded-xl bg-black/70 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l} className="bg-gray-900 text-white">{l}</option>
            ))}
          </select>
        </div>

        {/* Rating Select */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-extrabold text-gray-300 mb-1 uppercase tracking-wider">Rating</label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full p-2.5 sm:p-3 rounded-xl bg-black/70 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Ratings</option>
            {ratings.map((r) => (
              <option key={r} value={r} className="bg-gray-900 text-white">{r}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end w-full">
          <button
            onClick={onReset}
            className="w-full p-2.5 sm:p-3 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
