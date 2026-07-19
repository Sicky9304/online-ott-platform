const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');

router.get('/', seriesController.getSeries);
router.get('/:id', seriesController.getSeriesById);

module.exports = router;
