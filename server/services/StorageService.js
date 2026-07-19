const LocalStorageProvider = require('./LocalStorageProvider');
const GoogleDriveProvider = require('./GoogleDriveProvider');
const MegaProvider = require('./MegaProvider');
const CloudinaryProvider = require('./CloudinaryProvider');
const VideoMetadataService = require('./VideoMetadataService');
const StorageConfig = require('../models/StorageConfig');
const logger = require('../utils/logger');

class StorageService {
  constructor() {
    this.activeProviderName = process.env.ACTIVE_STORAGE_PROVIDER || 'local';
    this.providers = {
      local: new LocalStorageProvider(),
      gdrive: new GoogleDriveProvider(),
      mega: new MegaProvider(),
      cloudinary: new CloudinaryProvider()
    };
  }

  async getActiveProvider() {
    try {
      const config = await StorageConfig.findOne();
      if (config && config.activeProvider) {
        this.activeProviderName = config.activeProvider;
      }
    } catch (err) {
      // Fallback to local
    }
    return this.providers[this.activeProviderName] || this.providers.local;
  }

  async setActiveProvider(providerName, credentials = {}) {
    if (!this.providers[providerName]) {
      throw new Error(`Invalid storage provider: ${providerName}`);
    }
    this.activeProviderName = providerName;
    
    let config = await StorageConfig.findOne();
    if (!config) {
      config = new StorageConfig();
    }
    config.activeProvider = providerName;
    if (credentials.gdrive) config.gdrive = { ...config.gdrive, ...credentials.gdrive };
    if (credentials.mega) config.mega = { ...config.mega, ...credentials.mega };
    if (credentials.cloudinary) config.cloudinary = { ...config.cloudinary, ...credentials.cloudinary };
    await config.save();
    
    logger.info(`[StorageService] Switched active storage provider to: ${providerName}`);
    return { activeProvider: providerName, config };
  }

  async upload(file, options = {}) {
    const provider = await this.getActiveProvider();
    const result = await provider.upload(file, options);
    
    // Automatically extract metadata & thumbnails for videos
    const isVideo = file.mimetype && file.mimetype.startsWith('video');
    if (isVideo) {
      const meta = await VideoMetadataService.extractMetadata(result.providerFileId);
      const thumbnail = await VideoMetadataService.generateThumbnail(result.providerFileId);
      result.metadata = meta;
      result.thumbnail = thumbnail;
    }
    
    return result;
  }

  async delete(providerFileId, providerName = null) {
    const provider = providerName ? this.providers[providerName] : await this.getActiveProvider();
    return await provider.delete(providerFileId);
  }

  async stream(providerFileId, range = null, providerName = null) {
    const provider = providerName ? this.providers[providerName] : await this.getActiveProvider();
    return await provider.stream(providerFileId, range);
  }

  async rename(providerFileId, newName, providerName = null) {
    const provider = providerName ? this.providers[providerName] : await this.getActiveProvider();
    return await provider.rename(providerFileId, newName);
  }

  async move(providerFileId, folderId, providerName = null) {
    const provider = providerName ? this.providers[providerName] : await this.getActiveProvider();
    return await provider.move(providerFileId, folderId);
  }

  async thumbnail(providerFileId, providerName = null) {
    const provider = providerName ? this.providers[providerName] : await this.getActiveProvider();
    return await provider.thumbnail(providerFileId);
  }

  async getMetadata(providerFileId, providerName = null) {
    const provider = providerName ? this.providers[providerName] : await this.getActiveProvider();
    return await provider.getMetadata(providerFileId);
  }
}

module.exports = new StorageService();
