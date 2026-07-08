import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { employerApi } from '../api/employerApi';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { StatsCard } from '../components/StatsCard';
import { getApiErrorMessage } from '../utils/apiError';

export const EmployerDashboardPage = () => {
  const { logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employerApi.getEmployerDashboard();
      setDashboard(response.data);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
      if (err?.status === 401 || err?.status === 403 || message.toLowerCase().includes('token')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Dashboard nhà tuyển dụng</h2>
          <p>Đánh giá hoạt động tuyển dụng của bạn.</p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : !dashboard ? (
        <div className="empty-state-card card">
          <h3>Không có dữ liệu</h3>
          <p>Không thể tải dashboard vào lúc này.</p>
        </div>
      ) : (
        <div className="stats-grid">
          <StatsCard title="Tổng job" value={dashboard.totalJobs} variant="primary" />
          <StatsCard title="Tổng ứng tuyển" value={dashboard.totalApplications} variant="secondary" />
          <StatsCard title="Đang chờ" value={dashboard.pending} variant="warning" />
          <StatsCard title="Đã chấp nhận" value={dashboard.accepted} variant="success" />
          <StatsCard title="Đã từ chối" value={dashboard.rejected} variant="danger" />
        </div>
      )}
    </div>
  );
};
