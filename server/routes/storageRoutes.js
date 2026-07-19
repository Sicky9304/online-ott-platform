const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageController = require('../controllers/storageController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 * 1024 } });

router.get('/config', protect, adminOnly, storageController.getStorageConfig);
router.post('/config', protect, adminOnly, storageController.updateStorageProvider);
router.post('/upload', protect, adminOnly, upload.single('file'), storageController.uploadFile);
router.get('/stream/:fileId', storageController.streamFile);

module.exports = router;
