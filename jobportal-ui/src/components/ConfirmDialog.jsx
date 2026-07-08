import React from 'react';

export const ConfirmDialog = ({ message, onConfirm, onCancel, loading }) => {
  return (
    <div className="dialog-backdrop">
      <div className="dialog-card card">
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Hủy
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};
