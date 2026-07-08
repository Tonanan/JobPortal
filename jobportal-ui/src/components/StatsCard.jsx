import React from 'react';

export const StatsCard = ({ title, value, variant = 'default' }) => {
  return (
    <div className={`stats-card stats-card-${variant}`}>
      <span className="stats-card-title">{title}</span>
      <strong className="stats-card-value">{value}</strong>
    </div>
  );
};
