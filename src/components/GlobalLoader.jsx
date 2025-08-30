import React from 'react';
import './GlobalLoader.css';

const GlobalLoader = ({ 
  visible = false, 
  message = 'Loading...', 
  imageSrc = '/loadingSearch.png', // Default image path from public folder
  imageSize = 120, // Image size in pixels
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  textColor = '#ffffff',
  rotationDuration = 2 // Duration in seconds
}) => {
  if (!visible) return null;

  return (
    <div 
      className="global-loader-overlay"
      style={{ backgroundColor: overlayColor }}
    >
      <div className="global-loader-content">
        <div className="loading">
          <img
            className="loading-icon"
            src={'./loadingSearch.png'}
            alt="Loading"
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              animationDuration: `${rotationDuration}s`
            }}
          />
        </div>
        {message && (
          <p 
            className="global-loader-text"
            style={{ color: textColor }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default GlobalLoader;
