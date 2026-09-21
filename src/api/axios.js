// axios config placeholder
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Перед каждым запросом проверяем, есть ли токен в localStorage,
// и если есть — автоматически добавляем его в заголовок Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;