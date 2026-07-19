import api from '../lib/api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data.data;
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
