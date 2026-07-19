const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  seasonNumber: { type: Number, required: true },
  episodeNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: Number, required: true },
  thumbnailUrl: { type: String, default: '' },
  
  // Storage Integration
  storageProvider: { type: String, enum: ['local', 'gdrive', 'mega', 'cloudinary'], default: 'local' },
  providerFileId: { type: String, default: '' },
  providerUrl: { type: String, default: '' },
  resolution: { type: String, default: '1080p' },
  videoQualities: [{
    quality: { type: String },
    url: { type: String }
  }],
  subtitles: [{
    language: { type: String },
    label: { type: String },
    url: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Episode', EpisodeSchema);
