const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Series = require('../models/Series');
const WatchHistory = require('../models/WatchHistory');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const tmdbService = require('../utils/tmdb');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const syncTmdbMoviesToDatabase = async () => {
  try {
    // TMDB sync for movies/series disabled to lock current database. Serving strictly from MongoDB.
    return;

    console.log('[TMDB Sync] Fetching latest updates from TMDB API...');
    const [trendingMovies, hindiMovies, latestHindiMovies, trendingSeries] = await Promise.all([
      tmdbService.getTrendingMovies(),
      tmdbService.getPopularHindiMovies(),
      tmdbService.getLatestHindiMovies ? tmdbService.getLatestHindiMovies() : [],
      tmdbService.getTrendingSeries()
    ]);

    // Fetch movies specifically for the 6 Brand Studio Cards
    console.log('[TMDB Sync] Fetching Disney/Pixar/Marvel/Star Wars/Nat Geo/Specials movies...');
    const brandQueries = [
      { name: 'Disney', query: 'Disney animate' },
      { name: 'Pixar', query: 'Pixar' },
      { name: 'Marvel', query: 'Marvel studio' },
      { name: 'Star Wars', query: 'Star Wars' },
      { name: 'Nat Geo', query: 'National Geographic' },
      { name: 'Specials', query: 'Special edition' }
    ];

    const brandResults = await Promise.all(
      brandQueries.map(async (bq) => {
        try {
          const fetched = await tmdbService.searchMovies(bq.query);
          return { name: bq.name, movies: fetched || [] };
        } catch (err) {
          return { name: bq.name, movies: [] };
        }
      })
    );

    const allItems = [...trendingMovies, ...hindiMovies, ...latestHindiMovies, ...trendingSeries];
    
    // Merge brand movies into the list
    for (const br of brandResults) {
      for (const item of br.movies) {
        item.categories = Array.from(new Set([...(item.categories || []), br.name]));
        allItems.push(item);
      }
    }

    const map = new Map();
    allItems.forEach(item => {
      const key = `${item.tmdbId}_${item.isSeries}`;
      if (map.has(key)) {
        const existing = map.get(key);
        existing.categories = Array.from(new Set([...(existing.categories || []), ...(item.categories || [])]));
      } else {
        map.set(key, item);
      }
    });

    const uniqueItems = Array.from(map.values());

    for (const item of uniqueItems) {
      if (item.isSeries) {
        const exists = await Series.findOne({ tmdbId: item.tmdbId });
        if (!exists) {
          await Series.create({
            title: item.title,
            slug: `${item.slug}-${item.tmdbId}`,
            description: item.description,
            releaseYear: item.releaseYear,
            seasonsCount: 1,
            episodesCount: 10,
            rating: item.rating || 'TV-MA',
            imdbRating: item.imdbRating || 8.5,
            language: item.language || 'English',
            genres: item.genres,
            cast: item.cast,
            director: item.director,
            posterUrl: item.posterUrl,
            bannerUrl: item.bannerUrl,
            trailerUrl: item.trailerUrl,
            videoUrl: item.videoUrl,
            isFeatured: item.isFeatured,
            tmdbId: item.tmdbId,
            isSeries: true,
            type: 'series',
            categories: item.categories
          });
        } else {
          // Sync categories
          exists.categories = Array.from(new Set([...(exists.categories || []), ...(item.categories || [])]));
          await exists.save();
        }
      } else {
        const exists = await Movie.findOne({ tmdbId: item.tmdbId });
        if (!exists) {
          await Movie.create({
            title: item.title,
            slug: `${item.slug}-${item.tmdbId}`,
            description: item.description,
            tagline: item.tagline,
            releaseYear: item.releaseYear,
            duration: item.duration,
            rating: item.rating,
            imdbRating: item.imdbRating,
            matchPercentage: item.matchPercentage,
            language: item.language,
            country: item.country,
            genres: item.genres,
            categories: item.categories,
            director: item.director,
            cast: item.cast,
            posterUrl: item.posterUrl,
            bannerUrl: item.bannerUrl,
            trailerUrl: item.trailerUrl,
            videoUrl: item.videoUrl,
            tmdbId: item.tmdbId,
            isSeries: false,
            type: 'movie',
            viewsCount: item.viewsCount,
            isFeatured: item.isFeatured,
            isTrending: item.isTrending,
            isPopular: item.isPopular,
            isTopRated: item.isTopRated
          });
        } else {
          // Sync categories
          exists.categories = Array.from(new Set([...(exists.categories || []), ...(item.categories || [])]));
          await exists.save();
        }
      }
    }

    console.log(`[TMDB Sync] Seeding Done. Total items stored: ${await Movie.countDocuments({ tmdbId: { $ne: null } })} movies & ${await Series.countDocuments({ tmdbId: { $ne: null } })} series.`);
  } catch (err) {
    console.error('[TMDB Sync Error]:', err.message);
  }
};

exports.getMovies = async (req, res) => {
  try {
    const { category, genre, year, language, rating, search, type, limit = 50, page = 1 } = req.query;
    let query = {};

    if (category) {
      const catLower = category.toLowerCase();
      if (catLower === 'trending') query.isTrending = true;
      else if (catLower === 'popular') query.isPopular = true;
      else if (catLower === 'featured') query.isFeatured = true;
      else if (catLower === 'top_rated' || catLower === 'top rated') query.isTopRated = true;
      else if (['hindi', 'english', 'telugu', 'tamil', 'spanish', 'french'].includes(catLower)) {
        query.language = { $regex: category, $options: 'i' };
      } else {
        query.categories = { $in: [new RegExp(category, 'i')] };
      }
    }

    if (genre) {
      query.genres = { $in: [new RegExp(genre, 'i')] };
    }

    if (year) {
      query.releaseYear = parseInt(year);
    }

    if (language) {
      // Escape parentheses in query strings for safe regex matching (e.g. 'Hindi Dubbed (South)')
      const escapedLanguage = language.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.language = { $regex: escapedLanguage, $options: 'i' };
    }

    if (rating) {
      query.rating = rating;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { cast: searchRegex },
        { director: searchRegex }
      ];
    }

    const limitVal = parseInt(limit, 10);
    const pageVal = parseInt(page, 10);

    const typeLower = type ? type.toLowerCase() : '';
    
    if (typeLower === 'series' || typeLower === 'tv') {
      const seriesList = await Series.find(query)
        .sort({ createdAt: -1 })
        .skip((pageVal - 1) * limitVal)
        .limit(limitVal);
      const total = await Series.countDocuments(query);
      return sendSuccess(res, 'Series fetched successfully', { movies: seriesList, total, page: pageVal });
    } else if (typeLower === 'movie') {
      const moviesList = await Movie.find(query)
        .sort({ createdAt: -1 })
        .skip((pageVal - 1) * limitVal)
        .limit(limitVal);
      const total = await Movie.countDocuments(query);
      return sendSuccess(res, 'Movies fetched successfully', { movies: moviesList, total, page: pageVal });
    } else {
      // Fetch both collections and combine them
      const moviesList = await Movie.find(query);
      const seriesList = await Series.find(query);
      
      const combined = [...moviesList, ...seriesList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const paginated = combined.slice((pageVal - 1) * limitVal, pageVal * limitVal);
      
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
      return sendSuccess(res, 'Movies fetched successfully', { 
        movies: paginated, 
        total: combined.length, 
        page: pageVal 
      });
    }
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    let movie;

    // Handle legacy TMDB string IDs (e.g. tmdb_mv_1368337 or tmdb_tv_101352)
    if (id.startsWith('tmdb_')) {
      const match = id.match(/tmdb_(mv|tv)_(\d+)/);
      if (match) {
        const tmdbId = parseInt(match[2], 10);
        const isSeries = match[1] === 'tv';
        if (isSeries) {
          movie = await Series.findOne({ tmdbId });
        } else {
          movie = await Movie.findOne({ tmdbId });
        }
        if (!movie) {
          movie = await require('../models/Trailer').findOne({ tmdbId, isSeries });
        }
      }
    }

    if (!movie) {
      // Find by ObjectId or slug checking both collections
      if (mongoose.Types.ObjectId.isValid(id)) {
        movie = await Movie.findById(id) || await Series.findById(id) || await require('../models/Trailer').findById(id);
      } else {
        movie = await Movie.findOne({ slug: id }) || await Series.findOne({ slug: id }) || await require('../models/Trailer').findOne({ slug: id });
      }
    }

    if (!movie) return sendError(res, 'Movie not found', [], 404);

    movie.viewsCount = (movie.viewsCount || 0) + 1;
    await movie.save();

    const reviews = await Review.find({ movie: movie._id }).populate('user', 'name avatar').sort({ createdAt: -1 });
    const comments = await Comment.find({ movie: movie._id }).populate('user', 'name avatar').sort({ createdAt: -1 });
    const related = await Movie.find({ genres: { $in: movie.genres }, _id: { $ne: movie._id } }).limit(6);

    return sendSuccess(res, 'Movie details retrieved', { movie, reviews, comments, related });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.updateWatchProgress = async (req, res) => {
  try {
    const { movieId, watchedSeconds, totalSeconds } = req.body;
    if (!movieId) return sendError(res, 'Movie ID is required');

    // Ignore TMDB non-MongoDB string IDs gracefully
    if (movieId.startsWith('tmdb_')) {
      return sendSuccess(res, 'Watch progress logged');
    }

    const percentage = totalSeconds > 0 ? Math.round((watchedSeconds / totalSeconds) * 100) : 0;
    const completed = percentage >= 90;

    const history = await WatchHistory.findOneAndUpdate(
      { user: req.user._id, movie: movieId },
      { watchedSeconds, totalSeconds, percentage, completed, lastWatchedAt: Date.now() },
      { upsert: true, new: true }
    );

    return sendSuccess(res, 'Watch progress updated', { history });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.imageProxy = async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Image URL parameter "url" is required');
  }
  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      timeout: 10000
    });
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send('Failed to proxy image');
  }
};
