import axios from 'axios';
import { getToken } from '../utils/token';
import { showLoading, hideLoading } from './loadingInterceptor';

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Append JWT token if it exists and show global loading
axiosInstance.interceptors.request.use(
  (config) => {
    showLoading();
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error propagation and hide global loading
axiosInstance.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: error.message || 'Lỗi kết nối server' });
  }
);

export default axiosInstance;
