import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onShow = () => setLoading(true);
    const onHide = () => setLoading(false);

    window.addEventListener('global-loading-show', onShow);
    window.addEventListener('global-loading-hide', onHide);

    return () => {
      window.removeEventListener('global-loading-show', onShow);
      window.removeEventListener('global-loading-hide', onHide);
    };
  }, []);

  const showLoading = () => {
    const event = new CustomEvent('global-loading-show');
    window.dispatchEvent(event);
  };

  const hideLoading = () => {
    const event = new CustomEvent('global-loading-hide');
    window.dispatchEvent(event);
  };

  const value = useMemo(
    () => ({ loading, showLoading, hideLoading }),
    [loading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};
