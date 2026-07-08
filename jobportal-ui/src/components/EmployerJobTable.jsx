import React from 'react';

export const EmployerJobTable = ({ jobs, onEdit, onDelete, onViewCandidates, loadingAction }) => {
  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Vị trí</th>
            <th>Địa điểm</th>
            <th>Mức lương</th>
            <th>Ngày đăng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{job.salary != null ? `${Number(job.salary).toLocaleString()} USD` : 'Thỏa thuận'}</td>
              <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
              <td className="table-actions-cell">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(job.id)}>
                  Chỉnh sửa
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onViewCandidates(job.id)}>
                  Xem ứng viên
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(job.id)} disabled={loadingAction}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
