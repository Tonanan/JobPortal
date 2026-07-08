import axiosInstance from './axios';

export const authApi = {
  register: (registerRequest) => {
    return axiosInstance.post('/auth/register', registerRequest);
  },
  login: (loginRequest) => {
    return axiosInstance.post('/auth/login', loginRequest);
  },
};
