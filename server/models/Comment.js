const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  content: { type: String, required: true },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
