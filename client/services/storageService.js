import api from '../lib/api';

export const storageService = {
  getConfig: async () => {
    const res = await api.get('/storage/config');
    return res.data.data.config;
  },

  updateConfig: async (provider, credentials) => {
    const res = await api.post('/storage/config', { provider, credentials });
    return res.data;
  },

  uploadFile: async (formData, onProgress) => {
    const res = await api.post('/storage/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });
    return res.data.data;
  }
};
