import React from 'react';

export const JobDetailCard = ({
  job,
  onApply,
  applyLoading,
  isLogin,
  canApply,
  hasApplied,
}) => {
  const formatSalary = (salary) => {
    if (salary === null || salary === undefined) return 'Thỏa thuận';
    return `${Number(salary).toLocaleString()} USD`;
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    try {
      const date = new Date(value);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return value;
    }
  };

  return (
    <div className="job-detail-card card">
      <div className="job-detail-header">
        <div>
          <p className="job-detail-id">Mã công việc: <strong>{job.id}</strong></p>
          <h1 className="job-detail-title">{job.title}</h1>
          <p className="job-detail-location">{job.location || 'Không xác định'}</p>
        </div>
        <div className="job-detail-meta">
          <div className="meta-row">
            <span className="meta-label">Mức lương</span>
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Ngày đăng</span>
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="job-detail-section">
        <h2>Mô tả công việc</h2>
        <p className="job-detail-description">{job.description || 'Không có mô tả cho công việc này.'}</p>
      </div>

      <div className="job-detail-actions">
        <button
          type="button"
          className="btn btn-primary job-detail-apply-btn"
          onClick={onApply}
          disabled={!canApply || applyLoading || hasApplied}
        >
          {applyLoading
            ? 'Đang gửi...'
            : hasApplied
            ? 'Đã ứng tuyển'
            : isLogin
            ? 'Ứng tuyển ngay'
            : 'Đăng nhập để ứng tuyển'}
        </button>
      </div>

      <div className="job-detail-notes">
        {!isLogin && (
          <p className="job-detail-note">Vui lòng đăng nhập để ứng tuyển công việc này.</p>
        )}
        {isLogin && !canApply && (
          <p className="job-detail-note job-detail-note-warning">
            Chỉ Candidate mới được phép ứng tuyển.
          </p>
        )}
        {hasApplied && (
          <p className="job-detail-note job-detail-note-success">
            Bạn đã ứng tuyển công việc này.
          </p>
        )}
      </div>
    </div>
  );
};
