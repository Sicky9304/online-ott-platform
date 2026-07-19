const Movie = require('../models/Movie');
const Series = require('../models/Series');
const User = require('../models/User');
const Genre = require('../models/Genre');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalSeries = await Series.countDocuments();
    const totalViewsObj = await Movie.aggregate([{ $group: { _id: null, totalViews: { $sum: '$viewsCount' } } }]);
    const totalViews = totalViewsObj.length ? totalViewsObj[0].totalViews : 0;
    const moviesWithTrailer = await Movie.countDocuments({ trailerUrl: { $nin: [null, '', 'https://www.youtube.com/embed/3yTlh4uB040'] } });
    const seriesWithTrailer = await Series.countDocuments({ trailerUrl: { $nin: [null, ''] } });

    return sendSuccess(res, 'Analytics retrieved successfully', {
      analytics: {
        totalUsers,
        totalMovies,
        totalSeries,
        totalViews,
        moviesWithTrailer,
        seriesWithTrailer,
        totalTitles: totalMovies + totalSeries,
        activeStorageProvider: process.env.ACTIVE_STORAGE_PROVIDER || 'local'
      }
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    if (!movieData.slug) {
      movieData.slug = movieData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const movie = await Movie.create(movieData);
    return sendSuccess(res, 'Movie created successfully', { movie }, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return sendError(res, 'Movie not found', [], 404);
    return sendSuccess(res, 'Movie updated successfully', { movie });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return sendError(res, 'Movie not found', [], 404);
    return sendSuccess(res, 'Movie deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ── Series Administration CRUD ──────────────────────────────────────────────
exports.createSeries = async (req, res) => {
  try {
    const seriesData = req.body;
    if (!seriesData.slug) {
      seriesData.slug = seriesData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const series = await Series.create(seriesData);
    return sendSuccess(res, 'Series created successfully', { series }, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.updateSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!series) return sendError(res, 'Series not found', [], 404);
    return sendSuccess(res, 'Series updated successfully', { series });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series) return sendError(res, 'Series not found', [], 404);
    return sendSuccess(res, 'Series deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ── Trailer Administration CRUD ──────────────────────────────────────────────
exports.createTrailer = async (req, res) => {
  try {
    const trailerData = req.body;
    if (!trailerData.slug) {
      trailerData.slug = trailerData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const trailer = await require('../models/Trailer').create(trailerData);
    return sendSuccess(res, 'Trailer created successfully', { trailer }, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.updateTrailer = async (req, res) => {
  try {
    const trailer = await require('../models/Trailer').findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trailer) return sendError(res, 'Trailer not found', [], 404);
    return sendSuccess(res, 'Trailer updated successfully', { trailer });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.deleteTrailer = async (req, res) => {
  try {
    const trailer = await require('../models/Trailer').findByIdAndDelete(req.params.id);
    if (!trailer) return sendError(res, 'Trailer not found', [], 404);
    return sendSuccess(res, 'Trailer deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};
