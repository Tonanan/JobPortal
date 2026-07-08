import React from 'react';

export const ApplicationTable = ({ applications, onDelete, onUpdateStatus, loadingAction }) => {
  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Địa điểm</th>
            <th>Lương</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.applicationId || application.jobId}>
              <td>{application.title}</td>
              <td>{application.location}</td>
              <td>{application.salary != null ? `${Number(application.salary).toLocaleString()} USD` : 'Thỏa thuận'}</td>
              <td>{application.status}</td>
              <td>
                {application.status === 'ACCEPTED' ? (
                  <span className="status-tag status-accepted">Đã chấp nhận</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(application.applicationId)}
                    disabled={loadingAction}
                  >
                    Hủy
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
