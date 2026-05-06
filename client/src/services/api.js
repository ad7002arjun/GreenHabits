import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('greenhabits_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Habits
export const getHabits = () => API.get('/habits');
export const createHabit = (data) => API.post('/habits', data);
export const updateHabit = (id, data) => API.put(`/habits/${id}`, data);
export const deleteHabit = (id) => API.delete(`/habits/${id}`);

// Logs
export const logHabit = (data) => API.post('/logs', data);
export const getLogs = (params) => API.get('/logs', { params });
export const getStats = () => API.get('/logs/stats');
export const deleteLog = (id) => API.delete(`/logs/${id}`);

export default API;