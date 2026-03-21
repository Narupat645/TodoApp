import axios from 'axios';

// ดึง URL จาก .env หรือใช้ค่า Default
const API_BASE = import.meta.env.VITE_API_URL || 'https://todoapp-1-0hmw.onrender.com';
const BASE = API_BASE.replace(/\/+$/, '');

const api = axios.create({
  baseURL: BASE,
});

// 👇 จุดที่เพิ่มเข้ามา: ทุกครั้งที่ยิง API ให้ไปเช็คว่ามี Token ไหม ถ้ามีให้แปะไปด้วย
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Export ฟังก์ชันต่างๆ ให้หน้าบ้านเรียกใช้ได้ง่ายขึ้น
export const getTasks = () => api.get('/api/tasks');
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;