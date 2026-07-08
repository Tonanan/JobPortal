import React from 'react';

export const ErrorMessage = ({ message }) => {
  return (
    <div className="error-alert">
      <span className="error-icon">⚠</span>
      <p className="error-text">{message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'}</p>
    </div>
  );
};
