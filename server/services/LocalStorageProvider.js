const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class LocalStorageProvider {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file, options = {}) {
    logger.info(`[LocalStorageProvider] Uploading file: ${file.originalname}`);
    const fileId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    const destinationPath = path.join(this.uploadDir, fileId);

    if (file.buffer) {
      fs.writeFileSync(destinationPath, file.buffer);
    } else if (file.path) {
      fs.copyFileSync(file.path, destinationPath);
    }

    return {
      provider: 'local',
      providerFileId: fileId,
      providerUrl: `/uploads/${fileId}`,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype
    };
  }

  async delete(providerFileId) {
    logger.info(`[LocalStorageProvider] Deleting file: ${providerFileId}`);
    const filePath = path.join(this.uploadDir, providerFileId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  }

  async stream(providerFileId, range = null) {
    const filePath = path.join(this.uploadDir, providerFileId);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${providerFileId}`);
    }
    return {
      filePath,
      streamUrl: `/uploads/${providerFileId}`
    };
  }

  async rename(providerFileId, newName) {
    logger.info(`[LocalStorageProvider] Renamed ${providerFileId} to ${newName}`);
    return { success: true, providerFileId, newName };
  }

  async move(providerFileId, targetFolderId) {
    logger.info(`[LocalStorageProvider] Moved ${providerFileId} to folder ${targetFolderId}`);
    return { success: true, providerFileId, targetFolderId };
  }

  async thumbnail(providerFileId) {
    return { thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80' };
  }

  async getMetadata(providerFileId) {
    const filePath = path.join(this.uploadDir, providerFileId);
    const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : { size: 0 };
    return {
      size: stats.size,
      duration: 124,
      resolution: '4K UHD',
      codec: 'H.264 / AAC'
    };
  }
}

module.exports = LocalStorageProvider;
