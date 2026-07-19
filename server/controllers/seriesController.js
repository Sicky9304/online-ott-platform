const Series = require('../models/Series');
const Episode = require('../models/Episode');
const Movie = require('../models/Movie');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getSeries = async (req, res) => {
  try {
    const dbSeries = await Series.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Series fetched successfully', { series: dbSeries });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.getSeriesById = async (req, res) => {
  try {
    const { id } = req.params;
    let series;

    // Handle TMDB Series IDs or look inside Movie model
    if (id.startsWith('tmdb_') || !id.match(/^[0-9a-fA-F]{24}$/)) {
      if (id.startsWith('tmdb_')) {
        const match = id.match(/tmdb_(tv|mv)_(\d+)/);
        if (match) {
          const tmdbId = parseInt(match[2], 10);
          series = await Movie.findOne({ tmdbId, isSeries: true });
        }
      } else {
        series = await Movie.findOne({ slug: id, isSeries: true });
      }
    }

    if (!series) {
      series = await Series.findById(id);
    }

    if (!series) return sendError(res, 'Series not found', [], 404);

    // If it's a TMDB Series, mock a single episode so it plays the trailer/videoUrl instantly
    if (series.isSeries) {
      const mockEpisode = {
        _id: `ep_mock_${series._id}`,
        title: 'Official Trailer & Teaser',
        episodeNumber: 1,
        seasonNumber: 1,
        videoUrl: series.videoUrl || series.trailerUrl,
        trailerUrl: series.trailerUrl,
        duration: series.duration || 45,
        thumbnail: series.posterUrl
      };
      return sendSuccess(res, 'Series details retrieved', { series, episodes: [mockEpisode] });
    }

    const episodes = await Episode.find({ series: series._id }).sort({ seasonNumber: 1, episodeNumber: 1 });
    return sendSuccess(res, 'Series details retrieved', { series, episodes });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};
