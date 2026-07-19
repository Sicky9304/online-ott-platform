const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect } = require('../middleware/auth');

router.get('/', movieController.getMovies);
router.get('/image-proxy', movieController.imageProxy);
router.get('/:id', movieController.getMovieById);
router.post('/progress', protect, movieController.updateWatchProgress);

module.exports = router;
