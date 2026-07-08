import axiosInstance from './axios';

export const employerApi = {
  getEmployerJobs: () => axiosInstance.get('/employer/jobs'),
  createJob: (jobRequest) => axiosInstance.post('/jobs', jobRequest),
  updateJob: (id, jobRequest) => axiosInstance.put(`/jobs/${id}`, jobRequest),
  deleteJob: (id) => axiosInstance.delete(`/jobs/${id}`),
  getEmployerDashboard: () => axiosInstance.get('/employer/dashboard'),
  getJobApplications: (jobId) => axiosInstance.get(`/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId, status) => axiosInstance.patch(`/jobs/${applicationId}`, { status }),
};
