import axios from 'axios';

// ดึง URL จาก .env หรือใช้ค่า Default
const API_BASE = import.meta.env.VITE_API_URL || 'https://todoapp-1-0hmw.onrender.com';
const BASE = API_BASE.replace(/\/+$/, '');

const api = axios.create({
  baseURL: BASE,
});

// ทุกครั้งที่ยิง API ให้เช็คและแปะ Token ไปด้วย
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- 👇 เพิ่มส่วนนี้สำหรับระบบ Auth (ต้องมี /api นำหน้า) ---
export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);

// --- ส่วนจัดการ Tasks (มี /api อยู่แล้ว) ---
export const getTasks = () => api.get('/api/tasks');
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;