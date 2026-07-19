module.exports = {
  providers: {
    LOCAL: 'local',
    GDRIVE: 'gdrive',
    MEGA: 'mega',
    CLOUDINARY: 'cloudinary'
  },
  defaultProvider: process.env.ACTIVE_STORAGE_PROVIDER || 'local',
  chunkSize: 5 * 1024 * 1024, // 5MB chunks for uploads
  maxFileSize: 50 * 1024 * 1024 * 1024 // 50GB max size
};
