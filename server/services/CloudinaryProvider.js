const logger = require('../utils/logger');

class CloudinaryProvider {
  constructor(config = {}) {
    this.config = config;
  }

  async upload(file, options = {}) {
    logger.info(`[CloudinaryProvider] Uploading image: ${file.originalname}`);
    const fileId = `cloudinary_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      provider: 'cloudinary',
      providerFileId: fileId,
      providerUrl: file.buffer ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype
    };
  }

  async delete(providerFileId) {
    logger.info(`[CloudinaryProvider] Deleting image: ${providerFileId}`);
    return { success: true };
  }

  async getMetadata(providerFileId) {
    return {
      format: 'png',
      width: 1920,
      height: 1080
    };
  }
}

module.exports = CloudinaryProvider;
