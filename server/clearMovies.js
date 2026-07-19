const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Movie = require('./models/Movie');
const Series = require('./models/Series');

const clearDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cineverse';
    await mongoose.connect(connStr);
    console.log('[Clear] Connected to MongoDB');

    await Movie.deleteMany({});
    await Series.deleteMany({});

    console.log('[Clear] ✅ Successfully removed all old movies and series from MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('[Clear Error]:', error);
    process.exit(1);
  }
};

clearDatabase();
