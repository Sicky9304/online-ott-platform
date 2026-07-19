const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const storageRoutes = require('./routes/storageRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const trailerRoutes = require('./routes/trailerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = parseInt(process.env.PORT || 5000, 10);

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://watch.sickykumar.in'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf('*') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root API status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CineVerse Backend API is working perfectly!',
    version: '3.0.0',
    uptime: process.uptime()
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CineVerse OTT Platform Engine active',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trailers', trailerRoutes);

// Global Error Handler
app.use(errorHandler);

const startServer = (portToUse) => {
  const currentPort = parseInt(portToUse, 10);
  const server = app.listen(currentPort, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 CINEVERSE API SERVER RUNNING AT http://localhost:${currentPort}`);
    console.log(`🎥 Active Storage Provider: ${process.env.ACTIVE_STORAGE_PROVIDER || 'local'}`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Conflict] Port ${currentPort} is occupied. Trying port ${currentPort + 1}...`);
      startServer(currentPort + 1);
    } else {
      console.error('[Server Error]:', err);
    }
  });
};

startServer(PORT); // Trigger watch restart to clear TMDB cache
