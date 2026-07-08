import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employerApi } from '../api/employerApi';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmployerApplicationTable } from '../components/EmployerApplicationTable';
import { getApiErrorMessage } from '../utils/apiError';

export const JobApplicationsPage = () => {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employerApi.getJobApplications(id);
      setApplications(response.data || []);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      if (err?.status === 401 || err?.status === 403 || message.toLowerCase().includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('Job ID không hợp lệ.');
      setLoading(false);
      return;
    }
    fetchApplications();
  }, [id]);

  const handleUpdateStatus = async (applicationId, status) => {
    setStatusLoading(applicationId);
    try {
      const response = await employerApi.updateApplicationStatus(applicationId, status);
      toast.success(response.data?.message || 'Cập nhật trạng thái thành công.');
      await fetchApplications();
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
      if (err?.status === 401 || err?.status === 403 || message.toLowerCase().includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setStatusLoading(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <h2>Ứng viên ứng tuyển</h2>
        <p>Quản lý trạng thái ứng viên cho job này.</p>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : applications.length === 0 ? (
        <div className="empty-state-card card">
          <h3>Chưa có ứng viên nào</h3>
          <p>Chưa có ứng viên ứng tuyển cho job này.</p>
        </div>
      ) : (
        <EmployerApplicationTable
          applications={applications}
          onUpdateStatus={handleUpdateStatus}
          loadingAction={statusLoading}
        />
      )}
    </div>
  );
};
