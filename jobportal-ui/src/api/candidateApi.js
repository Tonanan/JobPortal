import axiosInstance from './axios';

export const candidateApi = {
  getMyApplications: () => axiosInstance.get('/users'),
  deleteApplication: (applicationId) => axiosInstance.delete(`/applications/${applicationId}`),
};
