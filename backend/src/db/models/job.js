const mongoose = require('mongoose');

// Define schema for the Frame object
const JobSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'videos' }, // Reference to the Video model
  status: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('jobs', JobSchema);
