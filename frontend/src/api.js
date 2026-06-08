import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const matchesAPI = {
  getAll: () => api.get('/matches'),
  getById: (id) => api.get(`/matches/${id}`),
  add: (match) => api.post('/matches', match),
  update: (id, match) => api.put(`/matches/${id}`, match),
};

export const predictionsAPI = {
  getUserPredictions: (userId) => api.get(`/predictions/user/${userId}`),
  add: (prediction) => api.post('/predictions', prediction),
  update: (id, prediction) => api.put(`/predictions/${id}`, prediction),
};

export const usersAPI = {
  getRanking: () => api.get('/users/ranking'),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;
