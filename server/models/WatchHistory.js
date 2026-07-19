const mongoose = require('mongoose');

const WatchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  watchedSeconds: { type: Number, default: 0 },
  totalSeconds: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  lastWatchedAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

WatchHistorySchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', WatchHistorySchema);
