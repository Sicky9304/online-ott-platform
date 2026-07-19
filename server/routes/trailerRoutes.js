const express = require('express');
const router = express.Router();
const trailerController = require('../controllers/trailerController');

router.get('/', trailerController.getTrailers);
router.get('/:id', trailerController.getTrailerById);

module.exports = router;
