const mongoose = require('mongoose');

// Define schema for the Text object
const TextSchema = new mongoose.Schema({
  content: String,
  x: Number,
  y: Number,
  color: String,
  size: Number,
});

// Define schema for the Image object
const ImageSchema = new mongoose.Schema({
  url: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
});

// Define schema for the Frame object
const FrameSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'videos' }, // Reference to the Video model
  includeImage: Boolean,
  texts: [TextSchema],
  images: [ImageSchema],
  backgroundType: String,
  background: String,
  audioUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('frames', FrameSchema);
