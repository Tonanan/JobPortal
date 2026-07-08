import axiosInstance from './axios';

export const jobApi = {
  getAllJobs: (page = 0, size = 10) => {
    return axiosInstance.get('/jobs', {
      params: { page, size },
    });
  },
  searchJobs: (title = '', location = '') => {
    return axiosInstance.get('/jobs/search', {
      params: { title, location },
    });
  },
};
