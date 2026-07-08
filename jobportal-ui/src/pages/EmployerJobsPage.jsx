import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employerApi } from '../api/employerApi';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmployerJobTable } from '../components/EmployerJobTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { getApiErrorMessage } from '../utils/apiError';

export const EmployerJobsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/employer';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employerApi.getEmployerJobs();
      setJobs(response.data || []);
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
    fetchJobs();
  }, []);

  const handleEdit = (id) => {
    navigate(`${basePath}/jobs/${id}/edit`);
  };

  const handleViewCandidates = (id) => {
    navigate(`${basePath}/jobs/${id}/applications`);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      await employerApi.deleteJob(confirmDeleteId);
      toast.success('Xóa job thành công.');
      setConfirmDeleteId(null);
      await fetchJobs();
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
      <div className="page-heading page-heading-with-action">
        <div>
          <h2>Quản lý job</h2>
          <p>Danh sách công việc bạn đã đăng.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`${basePath}/jobs/create`)}>
          Đăng tin tuyển dụng
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : jobs.length === 0 ? (
        <div className="empty-state-card card">
          <h3>Chưa có công việc nào</h3>
          <p>Bạn chưa tạo công việc nào. Bắt đầu đăng tuyển ngay bây giờ.</p>
        </div>
      ) : (
        <EmployerJobTable
          jobs={jobs}
          onEdit={handleEdit}
          onViewCandidates={handleViewCandidates}
          onDelete={handleDelete}
          loadingAction={deleteLoading}
        />
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa job này?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};
