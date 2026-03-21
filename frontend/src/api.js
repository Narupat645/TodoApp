import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://todoapp-1-0hmw.onrender.com';

// Remove trailing slash if present
const BASE = API_BASE.replace(/\/+$/, '');

const api = axios.create({
  baseURL: BASE,
});

export const getTasks = () => api.get('/api/tasks');
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;
