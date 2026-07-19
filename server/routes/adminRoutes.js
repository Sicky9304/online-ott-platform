const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect, adminOnly);

router.get('/analytics', adminController.getAnalytics);

// Movie CRUD
router.post('/movies', adminController.createMovie);
router.put('/movies/:id', adminController.updateMovie);
router.delete('/movies/:id', adminController.deleteMovie);

// Series CRUD
router.post('/series', adminController.createSeries);
router.put('/series/:id', adminController.updateSeries);
router.delete('/series/:id', adminController.deleteSeries);

// Trailer CRUD
router.post('/trailers', adminController.createTrailer);
router.put('/trailers/:id', adminController.updateTrailer);
router.delete('/trailers/:id', adminController.deleteTrailer);

module.exports = router;
