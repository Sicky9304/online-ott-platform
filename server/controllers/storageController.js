const StorageService = require('../services/StorageService');
const StorageConfig = require('../models/StorageConfig');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded');
    }
    const result = await StorageService.upload(req.file, req.body);
    return sendSuccess(res, 'File uploaded successfully', { storage: result });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.getStorageConfig = async (req, res) => {
  try {
    let config = await StorageConfig.findOne();
    if (!config) {
      config = await StorageConfig.create({ activeProvider: 'local' });
    }
    return sendSuccess(res, 'Storage configuration retrieved', { config });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.updateStorageProvider = async (req, res) => {
  try {
    const { provider, credentials } = req.body;
    if (!provider) return sendError(res, 'Storage provider is required');

    const result = await StorageService.setActiveProvider(provider, credentials || {});
    return sendSuccess(res, `Storage provider updated to ${provider}`, result);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.streamFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const range = req.headers.range;
    const streamInfo = await StorageService.stream(fileId, range);
    
    if (streamInfo.filePath) {
      return res.sendFile(streamInfo.filePath);
    }
    return res.redirect(streamInfo.streamUrl);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};
