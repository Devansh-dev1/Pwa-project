import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import { setToken } from '../utils/auth.js';
import { linkSignup } from '../api/auth.js';
import MagicLinkModal from './MagicLinkModal.jsx';
import './LoginPopup.css';

const LoginPopup = () => {
  const navigate = useNavigate();
  const { 
    showLoginPopup, 
    hideLoginPopup, 
    loginPopupCallback,
    setUserInfo,
    setLoading: setGlobalLoading 
  } = useStore();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Debug logging
  console.log('🎭 LoginPopup render - showLoginPopup:', showLoginPopup);

  const handleContinue = async () => {
   

    try {
      setLoading(true);
      hideLoginPopup();
      navigate('/signin');
     
    
    } catch (error) {
      console.error('Error sending magic link:', error);
      setApiError(error.response?.data?.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
  
      
      hideLoginPopup();
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleClose = () => {
    hideLoginPopup();
  };

  if (!showLoginPopup) {
    console.log('🎭 LoginPopup not showing (showLoginPopup is false)');
    return null;
  }

  return (
    <>
      <div className="login-popup-overlay" onClick={handleClose}>
        <div className="login-popup-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header Graphic */}
          <div className="login-popup-header">
            <div className="login-popup-graphic">
              <div className="user-icon-circle">
                <div className="user-icon">👤</div>
                <div className="add-user-icon">+</div>
              </div>
              <div className="decorative-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="login-popup-content">
            <h2 className="login-popup-title">Ready to Dive In?</h2>
            <p className="login-popup-description">
              Log in or create your account to unlock this feature and make the most of your experience. It's quick & secure!
            </p>

         

            {/* Action Buttons */}
            <div className="login-popup-actions">
              <button
                className="login-popup-continue-btn"
                onClick={handleContinue}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
              
              <button
                className="login-popup-skip-btn"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button className="login-popup-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>

      {/* Magic Link Modal */}
      {showMagicLinkModal && (
        <MagicLinkModal
          email={email}
          onClose={() => setShowMagicLinkModal(false)}
        />
      )}
    </>
  );
};

export default LoginPopup;
