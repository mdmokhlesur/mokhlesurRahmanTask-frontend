import React from 'react';
import './skeleton.css';

const Skeleton: React.FC = () => {
  return (
    <div className="skeleton-container">
      <header className="skeleton-header">
        <div className="skeleton-logo shimmer" />
        <div className="skeleton-actions">
          <div className="skeleton-button shimmer" />
          <div className="skeleton-user shimmer" />
        </div>
      </header>
      
      <div className="skeleton-workspace">
        <div className="skeleton-card shimmer" />
        <div className="skeleton-card shimmer" />
      </div>
    </div>
  );
};

export default Skeleton;
