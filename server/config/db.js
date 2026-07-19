const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cineverse';
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] MongoDB connection warning: ${error.message}. Running in memory fallback mode.`);
  }
};

module.exports = connectDB;
