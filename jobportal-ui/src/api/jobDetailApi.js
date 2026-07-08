import axiosInstance from './axios';

export const jobDetailApi = {
  getJobById: (id) => axiosInstance.get(`/jobs/${id}`),
  applyToJob: (jobId) => axiosInstance.post(`/jobs/${jobId}/apply`),
};
