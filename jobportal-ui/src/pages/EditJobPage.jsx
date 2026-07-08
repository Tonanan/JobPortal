import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employerApi } from '../api/employerApi';
import { jobDetailApi } from '../api/jobDetailApi';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { JobForm } from '../components/JobForm';
import { ErrorMessage } from '../components/ErrorMessage';
import { getApiErrorMessage } from '../utils/apiError';

export const EditJobPage = () => {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobDetailApi.getJobById(id);
      setJob(response.data);
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
      setError('ID job không hợp lệ.');
      setLoading(false);
      return;
    }
    fetchJob();
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    setError(null);
    try {
      await employerApi.updateJob(id, data);
      toast.success('Cập nhật job thành công.');
      navigate(`${location.pathname.startsWith('/admin') ? '/admin/jobs' : '/employer/jobs'}`);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
      if (err?.status === 401 || err?.status === 403 || message.toLowerCase().includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h2>Chỉnh sửa job</h2>
        <p>Cập nhật thông tin job hiện tại.</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {job ? (
        <JobForm
          initialValues={{
            title: job.title || '',
            description: job.description || '',
            salary: job.salary ?? 0,
            location: job.location || '',
          }}
          onSubmit={handleUpdate}
          loading={saving}
          error={error}
        />
      ) : (
        <div className="empty-state-card card">
          <h3>Không tìm thấy job</h3>
          <p>Job có thể đã bị xóa hoặc không tồn tại.</p>
        </div>
      )}
    </div>
  );
};
