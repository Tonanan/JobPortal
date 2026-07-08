import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { jobDetailApi } from '../api/jobDetailApi';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { JobDetailCard } from '../components/JobDetailCard';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogin, role, logout } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const canApply = role === 'CANDIDATE';

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobDetailApi.getJobById(id);
      setJob(response.data);
    } catch (err) {
      const message = err?.message || 'Không thể tải chi tiết công việc.';
      setError(message);
      if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('ID công việc không hợp lệ.');
      setLoading(false);
      return;
    }
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    if (!canApply) {
      return;
    }

    setApplyLoading(true);
    try {
      const response = await jobDetailApi.applyToJob(id);
      toast.success(response.data?.message || 'Ứng tuyển thành công!');
      setHasApplied(true);
    } catch (err) {
      const message = err?.message || 'Không thể ứng tuyển công việc. Vui lòng thử lại.';
      if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('token')) {
        logout();
        navigate('/login');
        return;
      }
      toast.error(message);
      setError(message);
      if (message.includes('đã ứng tuyển')) {
        setHasApplied(true);
      }
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="job-detail-page">
      {error && <ErrorMessage message={error} />}
      {job && (
        <JobDetailCard
          job={job}
          onApply={handleApply}
          applyLoading={applyLoading}
          isLogin={isLogin}
          canApply={canApply}
          hasApplied={hasApplied}
        />
      )}
    </div>
  );
};
