import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employerApi } from '../api/employerApi';
import { useAuth } from '../hooks/useAuth';
import { JobForm } from '../components/JobForm';
import { getApiErrorMessage } from '../utils/apiError';

export const CreateJobPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await employerApi.createJob(data);
      toast.success('Tạo job thành công.');
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
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <h2>Tạo job mới</h2>
        <p>Nhập thông tin để đăng tuyển ứng viên cho vị trí mới.</p>
      </div>
      <JobForm
        initialValues={{ title: '', description: '', salary: 0, location: '' }}
        onSubmit={handleCreate}
        loading={loading}
        error={error}
      />
    </div>
  );
};
