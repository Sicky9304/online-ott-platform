'use client';
import { useState, useEffect, Suspense } from 'react';
import HeroSlider from '../components/cinematic/HeroSlider';
import BrandCards from '../components/cinematic/BrandCards';
import Top10Row from '../components/cinematic/Top10Row';
import LanguageRow from '../components/cinematic/LanguageRow';
import MovieRow from '../components/cinematic/MovieRow';
import { movieService } from '../services/movieService';
import { trailerService } from '../services/trailerService';
import { useAuth } from '../hooks/useAuth';
import { Flame, Star, Sparkles, Clock, Award, Languages } from 'lucide-react';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fallback skeleton loader for catalog sections
function CatalogLoadingPlaceholder() {
  return (
    <div className="w-full space-y-12 sm:space-y-16 animate-pulse py-10 px-4 sm:px-8 md:px-20">
      <div className="space-y-4">
        <div className="h-8 bg-white/10 rounded-xl w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Inner Component to trigger data-driven rows inside Suspense boundary
function CatalogContentSection({ movies, allMovies, bollywoodHindi, hollywoodEnglish, southHindiDubbed, koreanHindiDubbed, bhojpuriMovies, trendingMovies, top10Movies, resetLanguageFilter }) {
  if (movies.length > 0) {
    return (
      <div className="space-y-12 sm:space-y-16 md:space-y-20">
        {/* 3. Hotstar Top 10 Numbered Shelf */}
        <Top10Row movies={top10Movies} />

        {/* 4. Extra Large "Latest & Trending Now" Row */}
        <MovieRow title="Latest & Trending Now" movies={trendingMovies} icon={Flame} isLarge={true} />

        {/* 6. Language & Region Specific Content Shelves */}
        <div className="w-full space-y-12 sm:space-y-16">
          <MovieRow title="Bollywood Hits (Hindi)" movies={bollywoodHindi} icon={Star} />
          <MovieRow title="Hollywood Blockbusters" movies={hollywoodEnglish} icon={Sparkles} />
          <MovieRow title="South Indian Cinema (Hindi Dubbed)" movies={southHindiDubbed} icon={Clock} />
          <MovieRow title="Korean Dramas (Hindi Dubbed)" movies={koreanHindiDubbed} icon={Award} />
          <MovieRow title="Bhojpuri Tadka" movies={bhojpuriMovies} icon={Flame} />
        </div>
      </div>
    );
  }

  if (allMovies.length > 0) {
    return (
      <div className="w-[85%] mx-auto py-16 px-8 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-center max-w-2xl shadow-xl space-y-5">
        <Languages className="w-16 h-16 text-cyan-400 mx-auto" />
        <h3 className="text-2xl font-black text-white">No Movies or Series Found</h3>
        <p className="text-gray-300 font-semibold text-sm sm:text-base">
          We don't have any titles matching the selected language category at the moment.
        </p>
        <button
          onClick={resetLanguageFilter}
          className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm shadow-lg shadow-cyan-500/20 cursor-pointer transition-transform transform hover:scale-105"
        >
          Show All Languages
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-20 text-cyan-400 font-black text-lg animate-pulse">
      Loading catalog content...
    </div>
  );
}

export default function HomePage() {
  const { user, isAdmin } = useAuth();
  const [allMovies, setAllMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const userId = user?._id || user?.id || null;

  // If user is admin, completely block home page rendering and redirect directly to /admin
  useEffect(() => {
    if (isAdmin) {
      window.location.replace('/admin');
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return; // Skip fetch if admin is redirecting
    const fetchCatalog = async () => {
      try {
        if (userId) {
          // Logged in: Load imported YouTube full movies (increased limit to get all data)
          const data = await movieService.getMovies({ limit: 300 });
          const fetched = data.movies || [];
          setAllMovies(fetched);
        } else {
          // Guest: Load TMDB trailers from Trailer collection
          const data = await trailerService.getTrailers({ limit: 300 });
          const fetched = data.trailers || [];
          setAllMovies(fetched);
        }
      } catch (err) {
        console.warn('Backend offline, using fallback catalog');
      }
    };
    fetchCatalog();
  }, [userId, isAdmin]);

  useEffect(() => {
    const handleLangChange = () => {
      const stored = localStorage.getItem('siteLanguage') || 'All';
      setSelectedLanguage(stored);
    };
    handleLangChange();
    window.addEventListener('siteLanguageChange', handleLangChange);
    return () => window.removeEventListener('siteLanguageChange', handleLangChange);
  }, []);

  const movies = allMovies.filter((movie) => {
    if (selectedLanguage === 'All') return true;
    return movie.language && movie.language.toLowerCase() === selectedLanguage.toLowerCase();
  });

  // Top 10 shuffled from all categories on every page load
  const top10Movies = shuffleArray([...movies]).slice(0, 10);

  // Latest Release / Trending: Sorted strictly by newly fetched/added items (newest first)
  const trendingMovies = [...movies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || b.releaseYear - a.releaseYear)
    .slice(0, 15);

  // Category wise filters for language sections (case-insensitive checks)
  const bollywoodHindi = shuffleArray(allMovies.filter(m => 
    (m.language?.toLowerCase() === 'hindi') && 
    !(m.language?.toLowerCase().includes('dubbed') || m.title?.toLowerCase().includes('dubbed') || m.title?.toLowerCase().includes('south'))
  )).slice(0, 15);

  const hollywoodEnglish = shuffleArray(allMovies.filter(m => 
    m.title?.toLowerCase().includes('hollywood') ||
    m.description?.toLowerCase().includes('hollywood')
  )).slice(0, 15);

  const southHindiDubbed = shuffleArray(allMovies.filter(m => 
    m.language?.toLowerCase().includes('south') || 
    m.title?.toLowerCase().includes('south') ||
    m.category?.toLowerCase().includes('south')
  )).slice(0, 15);

  const koreanHindiDubbed = shuffleArray(allMovies.filter(m => 
    m.language?.toLowerCase().includes('korean') || 
    m.title?.toLowerCase().includes('korean') ||
    m.category?.toLowerCase().includes('korean')
  )).slice(0, 15);

  const bhojpuriMovies = shuffleArray(allMovies.filter(m => 
    m.language?.toLowerCase() === 'bhojpuri' || 
    m.title?.toLowerCase().includes('bhojpuri') ||
    m.category?.toLowerCase().includes('bhojpuri')
  )).slice(0, 15);

  // Hero Slider: random selection of movies with real trailers
  const moviesWithTrailers = allMovies.filter(m => m.trailerUrl && m.trailerUrl.includes('youtube.com/embed/'));
  const heroPool = moviesWithTrailers.length >= 5 ? moviesWithTrailers : allMovies;
  const heroMovies = shuffleArray(heroPool).slice(0, 12);

  const resetLanguageFilter = () => {
    localStorage.setItem('siteLanguage', 'All');
    setSelectedLanguage('All');
    window.dispatchEvent(new Event('siteLanguageChange'));
  };

  if (isAdmin) {
    return <div className="w-full min-h-screen bg-black" />; // Return black backdrop during redirection
  }

  // Global Loading Wrapper: Block entire home page render until allMovies is loaded from API
  if (allMovies.length === 0) {
    return (
      <div className="w-full h-screen bg-[#050508] flex flex-col items-center justify-center space-y-4">
        {/* Futuristic Premium Glowing Spinner */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-cyan-400/20 border-b-cyan-400/10 border-l-cyan-400/40 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500/20 border-l-transparent animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
        <p className="text-cyan-400 font-black text-sm sm:text-base tracking-widest uppercase animate-pulse">
          Loading CineVerse Experience...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen space-y-12 sm:space-y-16 md:space-y-20 pb-28">
      {/* 1. Full Screen Hotstar Hero Spotlight Carousel */}
      <HeroSlider movies={heroMovies} />

      {/* 2. Disney+ Hotstar Studio Brand Channel Cards */}
      <BrandCards />

      {/* 5. Hotstar Language Selection Shelf */}
      <LanguageRow />

      {/* ── Dynamic Catalog Content inside Suspense ── */}
      <Suspense fallback={<CatalogLoadingPlaceholder />}>
        <CatalogContentSection
          movies={movies}
          allMovies={allMovies}
          bollywoodHindi={bollywoodHindi}
          hollywoodEnglish={hollywoodEnglish}
          southHindiDubbed={southHindiDubbed}
          koreanHindiDubbed={koreanHindiDubbed}
          bhojpuriMovies={bhojpuriMovies}
          trendingMovies={trendingMovies}
          top10Movies={top10Movies}
          resetLanguageFilter={resetLanguageFilter}
        />
      </Suspense>
    </div>
  );
}
