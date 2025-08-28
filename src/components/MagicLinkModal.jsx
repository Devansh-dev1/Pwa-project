import { useState } from 'react';
import Modal from './Modal.jsx';

export default function MagicLinkModal({ 
  isOpen, 
  onClose, 
  email, 
  onResend,
  loading = false 
}) {
  const [resendLoading, setResendLoading] = useState(false);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div style={{ textAlign: 'center' }}>
        {/* Success icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2a46a8 0%, #17275c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <span style={{ fontSize: 32, color: '#fff' }}>✉️</span>
        </div>
        
        <h2 style={{ 
          margin: '0 0 12px', 
          color: '#1E1F24',
          fontSize: 24,
          fontWeight: 600
        }}>
          Check Your Inbox
        </h2>
        
        <p style={{ 
          margin: '0 0 8px', 
          color: '#6B7280', 
          fontSize: 16,
          lineHeight: 1.5
        }}>
          We've sent a magic link to:
        </p>
        
        <p style={{ 
          margin: '0 0 24px', 
          color: '#2a46a8', 
          fontSize: 16,
          fontWeight: 600
        }}>
          {email}
        </p>
        
        <p style={{ 
          margin: '0 0 32px', 
          color: '#6B7280', 
          fontSize: 14,
          lineHeight: 1.5
        }}>
          Click the link in your email to complete the sign-in process. The link will expire in 30 minutes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <button 
            onClick={handleResend}
            disabled={resendLoading}
            style={{ 
              height: 56, 
              padding: '0 24px', 
              borderRadius: 999, 
              color: '#fff', 
              background: resendLoading ? '#ccc' : 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', 
              border: 'none', 
              cursor: resendLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            {resendLoading ? 'Sending...' : 'Resend Email'}
          </button>
          
          <button 
            onClick={onClose}
            style={{ 
              height: 56, 
              padding: '0 24px', 
              borderRadius: 999, 
              background: '#EFF7F7', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#556BB9',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Close
          </button>
        </div>
        
        <p style={{ 
          margin: '20px 0 0', 
          color: '#9CA3AF', 
          fontSize: 12,
          lineHeight: 1.4
        }}>
          Didn't receive the email? Check your spam folder or try a different email address.
        </p>
      </div>
    </Modal>
  );
}
