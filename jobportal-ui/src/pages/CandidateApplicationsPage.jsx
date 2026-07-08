import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { candidateApi } from '../api/candidateApi';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { ApplicationTable } from '../components/ApplicationTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { getApiErrorMessage } from '../utils/apiError';

export const CandidateApplicationsPage = () => {
  const { isLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await candidateApi.getMyApplications();
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
    if (!isLogin) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [isLogin]);

  const handleDelete = (applicationId) => {
    setConfirmDeleteId(applicationId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      await candidateApi.deleteApplication(confirmDeleteId);
      toast.success('Hủy ứng tuyển thành công.');
      setConfirmDeleteId(null);
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
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <h2>Việc làm đã ứng tuyển</h2>
        <p>Quản lý các đơn ứng tuyển của bạn.</p>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : applications.length === 0 ? (
        <div className="empty-state-card card">
          <h3>Chưa có ứng tuyển nào</h3>
          <p>Bạn chưa ứng tuyển công việc nào. Hãy tìm công việc phù hợp và ứng tuyển ngay.</p>
        </div>
      ) : (
        <ApplicationTable
          applications={applications}
          onDelete={handleDelete}
          loadingAction={deleteLoading}
        />
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn hủy ứng tuyển này?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};
