const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Film' },
  bannerUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Genre', GenreSchema);
