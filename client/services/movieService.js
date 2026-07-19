import api from '../lib/api';

export const movieService = {
  getMovies: async (params = {}) => {
    try {
      const res = await api.get('/movies', { params });
      return res.data.data;
    } catch (err) {
      return { movies: [], total: 0 };
    }
  },

  getMovieById: async (id) => {
    try {
      const res = await api.get(`/movies/${id}`);
      return res.data.data;
    } catch (err) {
      return { movie: null, reviews: [], comments: [], related: [] };
    }
  },

  updateWatchProgress: async (movieId, watchedSeconds, totalSeconds) => {
    try {
      const res = await api.post('/movies/progress', { movieId, watchedSeconds, totalSeconds });
      return res.data.data;
    } catch (err) {
      return null;
    }
  },

  toggleWatchlist: async (movieId) => {
    try {
      const res = await api.post('/users/watchlist', { movieId });
      return res.data.data;
    } catch (err) {
      return null;
    }
  }
};
