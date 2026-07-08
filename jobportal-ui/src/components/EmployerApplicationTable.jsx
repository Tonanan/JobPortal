import React from 'react';

export const EmployerApplicationTable = ({ applications, onUpdateStatus, loadingAction }) => {
  const formatSalary = (salary) => {
    if (salary === null || salary === undefined) return 'Thỏa thuận';
    return `${Number(salary).toLocaleString()} USD`;
  };

  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Email ứng viên</th>
            <th>Job ID</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.applicationId}>
              <td>{application.userEmail}</td>
              <td>{application.jobId}</td>
              <td>{application.status}</td>
              <td className="table-actions-cell">
                {application.status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onUpdateStatus(application.applicationId, 'ACCEPTED')}
                      disabled={loadingAction === application.applicationId}
                    >
                      Chấp nhận
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onUpdateStatus(application.applicationId, 'REJECTED')}
                      disabled={loadingAction === application.applicationId}
                    >
                      Từ chối
                    </button>
                  </>
                ) : (
                  <span className={`status-tag status-${application.status.toLowerCase()}`}>Đã {application.status === 'ACCEPTED' ? 'chấp nhận' : 'từ chối'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
