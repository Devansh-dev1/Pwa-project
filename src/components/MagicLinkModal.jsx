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
        
        <div className='checkInboxBnr'>
            <img src="/assets/checkInbox.jpg" alt="" title="" />
        </div>
        
        <h2 className='checkInbox'>
          Check Your Inbox
        </h2>
        
        <p className='sentMagic'>
          We've sent a magic link to:
        </p>
        
        <p className='sentMagicEmail'>
          {email}
        </p>
        
        <p className='sentMagicProcess'>
          Click the link in your email to complete the sign-in process. The link will expire in 30 minutes.
        </p>

        <div className='sentMagicBtns'>
          <button
            className='sentMagicBtnsReSend' 
            onClick={handleResend}
            disabled={resendLoading}>
            {resendLoading ? 'Sending...' : 'Resend Email'}
          </button>
          
          <button
            className='sentMagicBtnsClose'  
            onClick={onClose}>
            Close
          </button>
        </div>
        
        <p className='sentMagicDontRcv'>
          Didn't receive the email? Check your spam folder or try a different email address.
        </p>
      </div>
    </Modal>
  );
}
