const mongoose = require('mongoose');
const JobQueueService = require('../services/JobQueueService');
const { processVideo } = require('../helpers');

const uri = process.env.MONGO_DB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);

    const db = conn.connection;
    const jobCollection = db.collection('jobs');
    const changeStream = jobCollection.watch();

    const jobQueue = new JobQueueService();

    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        jobQueue.addJob(() =>
          processVideo(change?.fullDocument?.videoId, change?.fullDocument)
        );
      }
    });

    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    await jobQueue.run();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
