const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY || '57d7fd96fcc023253be0cfcd2032a539';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const IMAGE_BASE_W500 = 'https://image.tmdb.org/t/p/w500';

const STATIC_TMDB_CATALOG = [
  {
    _id: 'tmdb_mv_801688',
    tmdbId: 801688,
    title: 'Kalki 2898 AD',
    slug: 'kalki-2898-ad',
    description: 'In the year 2898 AD, around 6000 years after Kurukshetra war, Ashwatthama gears up for his final battle of redemption at the sign of hope in a dystopian world.',
    tagline: '⭐ 6.4 IMDb Score | Epic Sci-Fi',
    releaseYear: 2024,
    duration: 180,
    rating: 'U/A 13+',
    imdbRating: 8.2,
    matchPercentage: 98,
    language: 'Hindi',
    country: 'India',
    genres: ['Action', 'Sci-Fi', 'Fantasy'],
    categories: ['Hero Featured', 'Trending', 'TMDB Live'],
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg',
    videoUrl: 'https://www.youtube.com/embed/rn7tdg6cpW4',
    trailerUrl: 'https://www.youtube.com/embed/rn7tdg6cpW4',
    storageProvider: 'tmdb_hls',
    resolution: '4K UHD',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isTopRated: true,
    isSeries: false,
    type: 'movie',
    viewsCount: 154000
  },
  {
    _id: 'tmdb_mv_1112426',
    tmdbId: 1112426,
    title: 'Stree 2: Sarkate Ka Aatank',
    slug: 'stree-2',
    description: 'Following the events of Stree, the town of Chanderi is being haunted again. This time, women are mysteriously abducted by a terrifying headless entity.',
    tagline: '⭐ 6.7 IMDb Score | Comedy Horror',
    releaseYear: 2024,
    duration: 147,
    rating: 'U/A 16+',
    imdbRating: 8.5,
    matchPercentage: 96,
    language: 'Hindi',
    country: 'India',
    genres: ['Comedy', 'Horror', 'Mystery'],
    categories: ['Hero Featured', 'Trending', 'TMDB Live'],
    director: 'Amar Kaushik',
    cast: ['Shraddha Kapoor', 'Rajkummar Rao', 'Pankaj Tripathi', 'Aparshakti Khurana'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/fVV0A67kDjTTQ4CvUn8LoletRmI.jpg',
    videoUrl: 'https://www.youtube.com/embed/VlvOgk5BHS4',
    trailerUrl: 'https://www.youtube.com/embed/VlvOgk5BHS4',
    storageProvider: 'tmdb_hls',
    resolution: '4K UHD',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isTopRated: true,
    isSeries: false,
    type: 'movie',
    viewsCount: 142000
  },
  {
    _id: 'tmdb_tv_101352',
    tmdbId: 101352,
    title: 'Panchayat: Season 3',
    slug: 'panchayat-s3',
    description: 'Panchayat is a comedy-drama which captures the journey of an engineering graduate Abhishek, who joins as secretary of a panchayat office in a remote village of Uttar Pradesh.',
    tagline: '⭐ 8.2 IMDb Score | Top Rated Web Series',
    releaseYear: 2024,
    duration: 45,
    rating: 'U/A 13+',
    imdbRating: 9.0,
    matchPercentage: 99,
    language: 'Hindi',
    country: 'India',
    genres: ['Comedy', 'Drama'],
    categories: ['TV Series', 'Trending', 'TMDB Live'],
    director: 'Deepak Kumar Mishra',
    cast: ['Jitendra Kumar', 'Neena Gupta', 'Raghubir Yadav', 'Chandan Roy'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/xrfvAhrMdT6Uwg5fyTyQAZBYyiu.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/iZ8EtGAqKWZdRJPzWfFseNfVxjh.jpg',
    videoUrl: 'https://www.youtube.com/embed/YLvE3XxZiwE',
    trailerUrl: 'https://www.youtube.com/embed/YLvE3XxZiwE',
    storageProvider: 'tmdb_hls',
    resolution: '4K UHD',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isTopRated: true,
    isSeries: true,
    type: 'series',
    viewsCount: 189000
  }
];

const makeTmdbRequest = async (endpoint, params = {}) => {
  const config = { params: { ...params } };
  if (process.env.TMDB_Read_Access_Token) {
    config.headers = {
      Authorization: `Bearer ${process.env.TMDB_Read_Access_Token}`
    };
  } else {
    config.params.api_key = process.env.TMDB_API_KEY || TMDB_API_KEY;
  }
  return axios.get(`${BASE_URL}${endpoint}`, config);
};

const tmdbService = {
  formatTmdbItem: (item, isSeries = false, index = 0, trailerKey = null) => {
    const title = item.title || item.name || 'Untitled Masterpiece';
    const releaseYear = parseInt((item.release_date || item.first_air_date || '2026').substring(0, 4)) || 2026;
    const posterPath = item.poster_path;
    const backdropPath = item.backdrop_path;

    const rawPosterUrl = posterPath ? `${IMAGE_BASE_W500}${posterPath}` : STATIC_TMDB_CATALOG[index % STATIC_TMDB_CATALOG.length].posterUrl;
    const rawBannerUrl = backdropPath ? `${IMAGE_BASE_ORIGINAL}${backdropPath}` : rawPosterUrl;

    const posterUrl = rawPosterUrl.startsWith('http') ? `/api/movies/image-proxy?url=${encodeURIComponent(rawPosterUrl)}` : rawPosterUrl;
    const bannerUrl = rawBannerUrl.startsWith('http') ? `/api/movies/image-proxy?url=${encodeURIComponent(rawBannerUrl)}` : rawBannerUrl;

    const finalTrailerUrl = trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : null;

    return {
      _id: `tmdb_${isSeries ? 'tv' : 'mv'}_${item.id}`,
      tmdbId: item.id,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: item.overview || 'An extraordinary blockbuster title streaming now in 4K Ultra HD on CineVerse.',
      tagline: item.vote_average ? `⭐ ${item.vote_average.toFixed(1)} IMDb Score` : 'Must Watch Title',
      releaseYear,
      duration: isSeries ? 45 : 135,
      rating: item.adult ? 'A 18+' : 'U/A 13+',
      imdbRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 8.5,
      matchPercentage: Math.min(99, Math.max(85, Math.round((item.vote_average || 8) * 10))),
      language: {
        hi: 'Hindi',
        en: 'English',
        te: 'Telugu',
        ta: 'Tamil',
        ml: 'Malayalam',
        mr: 'Marathi',
        bn: 'Bengali',
        kn: 'Kannada',
        es: 'Spanish',
        fr: 'French'
      }[item.original_language] || 'English',
      country: item.origin_country?.[0] || 'India',
      genres: ['Action', 'Drama', 'Thriller'],
      categories: [isSeries ? 'TV Series' : 'Hero Featured', 'Trending'],
      director: 'CineVerse Directors',
      cast: ['Leading Star Cast'],
      posterUrl,
      bannerUrl,
      videoUrl: finalTrailerUrl,
      trailerUrl: finalTrailerUrl,
      storageProvider: 'local',
      resolution: '4K UHD',
      isFeatured: true,
      isTrending: true,
      isPopular: true,
      isTopRated: item.vote_average >= 8,
      isSeries,
      type: isSeries ? 'series' : 'movie',
      viewsCount: Math.round((item.popularity || 100) * 150)
    };
  },

  getTrailerKey: async (id, isSeries) => {
    try {
      const type = isSeries ? 'tv' : 'movie';
      const res = await makeTmdbRequest(`/${type}/${id}/videos`);
      const results = res.data.results || [];
      const trailer = results.find(v => v.site === 'YouTube' && v.type === 'Trailer') || 
                      results.find(v => v.site === 'YouTube' && v.type === 'Teaser') ||
                      results.find(v => v.site === 'YouTube');
      return trailer ? trailer.key : null;
    } catch (err) {
      return null;
    }
  },

  getTrendingMovies: async () => {
    try {
      const [res1, res2] = await Promise.all([
        makeTmdbRequest('/trending/movie/day', { page: 1 }),
        makeTmdbRequest('/trending/movie/day', { page: 2 })
      ]);
      const results = [...(res1.data.results || []), ...(res2.data.results || [])];
      const movies = results.slice(0, 35);
      const items = await Promise.all(
        movies.map(async (item, idx) => {
          const trailerKey = await tmdbService.getTrailerKey(item.id, false);
          return tmdbService.formatTmdbItem(item, false, idx, trailerKey);
        })
      );
      return items.length > 0 ? items : STATIC_TMDB_CATALOG.filter(m => !m.isSeries);
    } catch (err) {
      return STATIC_TMDB_CATALOG.filter(m => !m.isSeries);
    }
  },

  getPopularHindiMovies: async () => {
    try {
      const [res1, res2] = await Promise.all([
        makeTmdbRequest('/discover/movie', {
          with_original_language: 'hi',
          sort_by: 'popularity.desc',
          page: 1
        }),
        makeTmdbRequest('/discover/movie', {
          with_original_language: 'hi',
          sort_by: 'popularity.desc',
          page: 2
        })
      ]);
      const results = [...(res1.data.results || []), ...(res2.data.results || [])];
      const movies = results.slice(0, 35);
      const items = await Promise.all(
        movies.map(async (item, idx) => {
          const trailerKey = await tmdbService.getTrailerKey(item.id, false);
          return tmdbService.formatTmdbItem(item, false, idx, trailerKey);
        })
      );
      return items.length > 0 ? items : STATIC_TMDB_CATALOG.filter(m => !m.isSeries);
    } catch (err) {
      return STATIC_TMDB_CATALOG.filter(m => !m.isSeries);
    }
  },

  getLatestHindiMovies: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await makeTmdbRequest('/discover/movie', {
        with_original_language: 'hi',
        sort_by: 'release_date.desc',
        'release_date.lte': today,
        'vote_count.gte': 1,
        page: 1
      });
      const results = res.data.results || [];
      const movies = results.slice(0, 20);
      const items = await Promise.all(
        movies.map(async (item, idx) => {
          const trailerKey = await tmdbService.getTrailerKey(item.id, false);
          return tmdbService.formatTmdbItem(item, false, idx, trailerKey);
        })
      );
      return items;
    } catch (err) {
      return [];
    }
  },

  getTrendingSeries: async () => {
    try {
      const [res1, res2] = await Promise.all([
        makeTmdbRequest('/trending/tv/day', { page: 1 }),
        makeTmdbRequest('/trending/tv/day', { page: 2 })
      ]);
      const results = [...(res1.data.results || []), ...(res2.data.results || [])];
      const series = results.slice(0, 35);
      const items = await Promise.all(
        series.map(async (item, idx) => {
          const trailerKey = await tmdbService.getTrailerKey(item.id, true);
          return tmdbService.formatTmdbItem(item, true, idx, trailerKey);
        })
      );
      return items.length > 0 ? items : STATIC_TMDB_CATALOG.filter(m => m.isSeries);
    } catch (err) {
      return STATIC_TMDB_CATALOG.filter(m => m.isSeries);
    }
  },

  searchMovies: async (query) => {
    try {
      const res = await makeTmdbRequest('/search/movie', { query });
      const results = res.data.results || [];
      const movies = results.slice(0, 5); // Fetch top 5 for the brand/category
      const items = await Promise.all(
        movies.map(async (item, idx) => {
          const trailerKey = await tmdbService.getTrailerKey(item.id, false);
          return tmdbService.formatTmdbItem(item, false, idx, trailerKey);
        })
      );
      return items;
    } catch (err) {
      return [];
    }
  }
};

module.exports = tmdbService;
