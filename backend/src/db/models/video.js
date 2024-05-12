const mongoose = require('mongoose');

// Define schema for the Video object
const VideoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  framesCount: Number,
  status: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('videos', VideoSchema);
