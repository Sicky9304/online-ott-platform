const mongoose = require('mongoose');

const StorageConfigSchema = new mongoose.Schema({
  activeProvider: { 
    type: String, 
    enum: ['local', 'gdrive', 'mega'], 
    default: 'local' 
  },
  gdrive: {
    clientId: { type: String, default: '' },
    clientSecret: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    folderId: { type: String, default: '' }
  },
  mega: {
    email: { type: String, default: '' },
    password: { type: String, default: '' }
  },
  cloudinary: {
    cloudName: { type: String, default: '' },
    apiKey: { type: String, default: '' },
    apiSecret: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('StorageConfig', StorageConfigSchema);
