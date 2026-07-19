const Trailer = require('../models/Trailer');
const tmdbService = require('../utils/tmdb');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// ─────────────────────────────────────────────────────────────────────────────
// Sync TMDB movies/series → Trailer collection
// ─────────────────────────────────────────────────────────────────────────────
const syncTmdbToTrailers = async () => {
  try {
    const count = await Trailer.countDocuments({ tmdbId: { $ne: null } });

    // 6-hour cooldown check: only query TMDB once every 6 hours to check for new trailers
    if (count > 0) {
      const latestTrailer = await Trailer.findOne({ tmdbId: { $ne: null } }).sort({ createdAt: -1 });
      const now = Date.now();
      const lastTime = latestTrailer ? new Date(latestTrailer.createdAt).getTime() : 0;
      const sixHours = 6 * 60 * 60 * 1000; // 6 hours cooldown
      if ((now - lastTime) < sixHours) {
        return; // Serve directly from DB cache
      }
    }

    console.log('[Trailer Sync] Fetching new TMDB trailers (6-Hour Sync Run)...');

    const [trendingMovies, hindiMovies, latestHindi, trendingSeries] = await Promise.all([
      tmdbService.getTrendingMovies(),
      tmdbService.getPopularHindiMovies(),
      tmdbService.getLatestHindiMovies ? tmdbService.getLatestHindiMovies() : [],
      tmdbService.getTrendingSeries()
    ]);

    const allItems = [...trendingMovies, ...hindiMovies, ...latestHindi, ...trendingSeries];

    // Deduplicate by tmdbId + isSeries
    const map = new Map();
    allItems.forEach(item => {
      const key = `${item.tmdbId}_${item.isSeries}`;
      if (map.has(key)) {
        const ex = map.get(key);
        ex.categories = Array.from(new Set([...(ex.categories || []), ...(item.categories || [])]));
      } else {
        map.set(key, item);
      }
    });

    const unique = Array.from(map.values()).filter(item => item.trailerUrl);

    // Pick top 10 fresh trailers that do not exist in database yet
    let newTrailersAdded = 0;
    for (const item of unique) {
      if (newTrailersAdded >= 10) break; // Limit to fetching only 10 new trailers

      const existing = await Trailer.findOne({ tmdbId: item.tmdbId, isSeries: item.isSeries });
      if (!existing) {
        await Trailer.create({
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
          videoUrl: item.trailerUrl,
          tmdbId: item.tmdbId,
          isSeries: item.isSeries,
          type: item.isSeries ? 'series' : 'movie',
          isFeatured: item.isFeatured,
          isTrending: item.isTrending,
          isPopular: item.isPopular,
          isTopRated: item.isTopRated,
          viewsCount: item.viewsCount,
          resolution: item.resolution
        });
        newTrailersAdded++;
      }
    }

    console.log(`[Trailer Sync] Added ${newTrailersAdded} new trailers.`);

    // If new trailers were successfully added, delete the oldest 10 trailers to keep database size constant
    if (newTrailersAdded > 0) {
      const oldestTrailers = await Trailer.find({ tmdbId: { $ne: null } })
        .sort({ createdAt: 1 }) // Oldest first
        .limit(newTrailersAdded);

      if (oldestTrailers.length > 0) {
        const idsToDelete = oldestTrailers.map(t => t._id);
        const deleteResult = await Trailer.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`[Trailer Sync] Deleted ${deleteResult.deletedCount} oldest trailers to save storage.`);
      }
    }

    const total = await Trailer.countDocuments();
    console.log(`[Trailer Sync] Completed. Current total trailers in DB: ${total}.`);
  } catch (err) {
    console.error('[Trailer Sync Error]:', err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trailers
// ─────────────────────────────────────────────────────────────────────────────
exports.getTrailers = async (req, res) => {
  try {
    await syncTmdbToTrailers();

    const {
      category, genre, language, type, search,
      limit = 60, page = 1
    } = req.query;

    let query = {};

    if (category) {
      const cat = category.toLowerCase();
      if (cat === 'trending') query.isTrending = true;
      else if (cat === 'popular') query.isPopular = true;
      else if (cat === 'featured') query.isFeatured = true;
      else if (cat === 'top_rated') query.isTopRated = true;
      else if (cat === 'movie') query.isSeries = false;
      else if (cat === 'series') query.isSeries = true;
      else query.categories = { $in: [new RegExp(category, 'i')] };
    }

    if (genre) query.genres = { $in: [new RegExp(genre, 'i')] };
    if (language) {
      // Escape parentheses in query strings for safe regex matching (e.g. 'Hindi Dubbed (South)')
      const escapedLanguage = language.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.language = { $regex: escapedLanguage, $options: 'i' };
    }
    if (type === 'movie') query.isSeries = false;
    if (type === 'series') query.isSeries = true;

    if (search) {
      const r = { $regex: search, $options: 'i' };
      query.$or = [{ title: r }, { description: r }, { director: r }, { cast: r }];
    }

    const limitVal = parseInt(limit, 10);
    const pageVal = parseInt(page, 10);

    const trailers = await Trailer.find(query)
      .sort({ createdAt: -1 })
      .skip((pageVal - 1) * limitVal)
      .limit(limitVal);

    const total = await Trailer.countDocuments(query);

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return sendSuccess(res, 'Trailers fetched successfully', {
      trailers, total, page: pageVal
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trailers/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getTrailerById = async (req, res) => {
  try {
    const { id } = req.params;
    let trailer;

    if (id.startsWith('tmdb_')) {
      const match = id.match(/tmdb_(mv|tv)_(\d+)/);
      if (match) {
        const tmdbId = parseInt(match[2], 10);
        const isSeries = match[1] === 'tv';
        trailer = await Trailer.findOne({ tmdbId, isSeries });
      }
    }

    if (!trailer) {
      trailer = await Trailer.findById(id).catch(() => null)
              || await Trailer.findOne({ slug: id });
    }

    if (!trailer) return sendError(res, 'Trailer not found', [], 404);

    trailer.viewsCount = (trailer.viewsCount || 0) + 1;
    await trailer.save();

    const related = await Trailer.find({
      genres: { $in: trailer.genres },
      _id: { $ne: trailer._id }
    }).limit(8);

    return sendSuccess(res, 'Trailer details retrieved', { trailer, related });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};
