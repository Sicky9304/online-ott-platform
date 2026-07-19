const mongoose = require('mongoose');

const TrailerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  tagline: { type: String, default: '' },
  releaseYear: { type: Number, default: 2024 },
  duration: { type: Number, default: 135 },
  rating: { type: String, default: 'U/A 13+' },
  imdbRating: { type: Number, default: 8.0 },
  matchPercentage: { type: Number, default: 95 },
  language: { type: String, default: 'English' },
  country: { type: String, default: 'India' },
  genres: [{ type: String }],
  categories: [{ type: String }],
  director: { type: String, default: '' },
  cast: [{ type: String }],
  posterUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  trailerUrl: { type: String, default: '' },  // YouTube embed URL
  videoUrl: { type: String, default: '' },    // Same as trailerUrl for TMDB
  tmdbId: { type: Number, default: null },
  isSeries: { type: Boolean, default: false },
  type: { type: String, enum: ['movie', 'series'], default: 'movie' },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isTopRated: { type: Boolean, default: false },
  viewsCount: { type: Number, default: 0 },
  resolution: { type: String, default: '4K UHD' },
}, { timestamps: true });

module.exports = mongoose.model('Trailer', TrailerSchema);
