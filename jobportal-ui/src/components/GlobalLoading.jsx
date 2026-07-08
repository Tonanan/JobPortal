import React from 'react';
import { useLoading } from '../context/LoadingContext';

export const GlobalLoading = () => {
  const { loading } = useLoading();

  if (!loading) {
    return null;
  }

  return (
    <div className="global-loading-overlay">
      <div className="global-loading-card">
        <div className="global-loading-spinner"></div>
        <p>Đang xử lý...</p>
      </div>
    </div>
  );
};
