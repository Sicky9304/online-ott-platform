const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tagline: { type: String, default: '' },
  releaseYear: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  rating: { type: String, default: 'PG-13' }, // PG, PG-13, R, TV-MA
  imdbRating: { type: Number, default: 8.5 },
  matchPercentage: { type: Number, default: 98 },
  language: { type: String, default: 'English' },
  country: { type: String, default: 'United States' },
  genres: [{ type: String }],
  categories: [{ type: String }], // Trending, Popular, Top Rated, Hero Featured, Continue Watching
  director: { type: String, default: '' },
  cast: [{ type: String }],
  posterUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  trailerUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  tmdbId: { type: Number, default: null },
  isSeries: { type: Boolean, default: false },
  type: { type: String, default: 'movie' },
  
  // Storage Integration (Requirement)
  storageProvider: { type: String, enum: ['local', 'gdrive', 'mega', 'cloudinary'], default: 'local' },
  providerFileId: { type: String, default: '' },
  providerFolderId: { type: String, default: '' },
  providerUrl: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  resolution: { type: String, default: '4K UHD' }, // 480p, 720p, 1080p, 4K UHD
  videoQualities: [{
    quality: { type: String, enum: ['480p', '720p', '1080p', '4K'] },
    url: { type: String }
  }],
  subtitles: [{
    language: { type: String },
    label: { type: String },
    url: { type: String }
  }],
  audioTracks: [{
    language: { type: String },
    label: { type: String },
    url: { type: String }
  }],

  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isTopRated: { type: Boolean, default: false },
  viewsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
