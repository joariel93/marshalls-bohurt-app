import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (refreshError) => {
  refreshSubscribers.forEach((callback) => callback(refreshError));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/v1/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((refreshError) => {
            if (refreshError) reject(refreshError);
            else resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/v1/auth/refresh');
        onRefreshed(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        onRefreshed(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error?.response?.data?.error ||
      error?.message ||
      'Error de conexión con el servidor';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
