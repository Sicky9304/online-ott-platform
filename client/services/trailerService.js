import api from '../lib/api';

export const trailerService = {
  getTrailers: async (params = {}) => {
    try {
      const res = await api.get('/trailers', { params });
      return res.data.data;
    } catch (err) {
      return { trailers: [], total: 0 };
    }
  },

  getTrailerById: async (id) => {
    try {
      const res = await api.get(`/trailers/${id}`);
      return res.data.data;
    } catch (err) {
      return { trailer: null, related: [] };
    }
  }
};
