const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  seasonsCount: { type: Number, default: 1 },
  episodesCount: { type: Number, default: 10 },
  rating: { type: String, default: 'TV-MA' },
  imdbRating: { type: Number, default: 8.8 },
  language: { type: String, default: 'English' },
  genres: [{ type: String }],
  cast: [{ type: String }],
  director: { type: String, default: '' },
  posterUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  trailerUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  tmdbId: { type: Number, default: null },
  isSeries: { type: Boolean, default: true },
  type: { type: String, default: 'series' }
}, { timestamps: true });

module.exports = mongoose.model('Series', SeriesSchema);
