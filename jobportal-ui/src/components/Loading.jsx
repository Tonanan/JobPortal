import React from 'react';

export const Loading = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="loading-text">Đang tải...</p>
    </div>
  );
};
