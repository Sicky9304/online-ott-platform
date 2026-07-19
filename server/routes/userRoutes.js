const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/watchlist', protect, userController.toggleWatchlist);
router.get('/history', protect, userController.getWatchHistory);

module.exports = router;
