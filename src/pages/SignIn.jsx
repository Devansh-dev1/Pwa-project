import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../utils/auth.js'
import { linkSignup, signfromTokenUser, getUserInfo } from '../api/auth.js'
import { storeToken } from '../utils/indexedDB.js'
import MagicLinkModal from '../components/MagicLinkModal.jsx'
import ErrorScreen from '../components/ErrorScreen.jsx'
import useStore from '../store/useStore.js'

export default function SignIn() {
  const navigate = useNavigate()
  const { setUserInfo, setLoading: setGlobalLoading, setError, error } = useStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setApiError(null)
    
    try {
      console.log('Sending magic link for email:', email);
      
      // Send magic link
      const linkResponse = await linkSignup(email.toLowerCase());
      console.log('Magic link response:', linkResponse);
      
      if (linkResponse?.status === 201) {
        // Show magic link modal instead of alert
        setShowMagicLinkModal(true);
      } else {
        // User might already exist, show modal anyway
        setShowMagicLinkModal(true);
      }
    } catch (error) {
      console.error('Magic link error:', error);
      setApiError({
        title: 'Unable to Send Magic Link',
        message: error.message || 'Please check your email address and try again.',
        onRetry: () => setApiError(null)
      });
    } finally {
      setLoading(false);
    }
  }

  const handleResendMagicLink = async () => {
    try {
      await linkSignup(email.toLowerCase());
      console.log('Magic link resent');
    } catch (error) {
      console.error('Error resending magic link:', error);
      throw error;
    }
  }

  const handleGuestLogin = async () => {
    try {
      setGlobalLoading(true);
      // Store a guest token for skip functionality
      await setToken('guest-token'); 
      setUserInfo({ email: 'guest@showtrail.com', isGuest: true });
      navigate('/home', { replace: true }); 
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <div style={{ height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 430, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '24px 16px', boxSizing: 'border-box' }}>
      <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#1E1F24', textAlign: 'center' }}>Login</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ color: '#6B7280' }}>or</span>
            <span style={{ color: '#1E1F24' }}>Sign Up for Free</span>
          </div>
          <p style={{ margin: '10px 0 0', color: '#6B7280', textAlign: 'center' }}>
            Enter your email to receive a Magic Link for quick and secure access
          </p>
        </div>

        <div style={{ alignSelf: 'stretch' }}>
          <label style={{ display: 'block', color: '#2a46a8', fontSize: 14, marginBottom: 6 }}>Email Address</label>
          <div style={{ borderRadius: 9999, border: '4px solid #E6E9FA', padding: 2 }}>
            <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1.5px solid #2a46a8', padding: '0 12px', background: '#fff' }}>
              <span style={{ width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2a46a8' }}>@</span>
              <input
                className="signin-input"
                type="email"
                placeholder="jacobblack@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#1E1F24' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading || !email}
          style={{ height: 56, padding: '0 24px', borderRadius: 999, color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', border: 'none', cursor: loading || !email ? 'not-allowed' : 'pointer', width: '100%', maxWidth: 430, marginTop: 10 }}>
          {loading ? 'Sending…' : 'Send Magic Link'}
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 16, color: '#6B7280', fontSize: 12 }}>
          <span>By proceeding, you agree to the</span>
          <a href="https://www.iubenda.com/terms-and-conditions/64723559" target="_blank" rel="noreferrer" style={{ color: '#1E1F24' }}>Terms & Conditions</a>
          <span>and</span>
          <a href="https://www.iubenda.com/privacy-policy/64723559/full-legal" target="_blank" rel="noreferrer" style={{ color: '#1E1F24' }}>Privacy Policy</a>
          <span>including Cookie Use.</span>
        </div>

        <button type="button" onClick={handleGuestLogin} style={{ background: 'none', border: 'none', color: '#556BB9', borderBottom: '4px solid #556BB9', marginTop: 20, cursor: 'pointer' }}>
          Skip To Homepage
        </button>
      </form>
      </div>
      
      {/* Magic Link Modal */}
      <MagicLinkModal
        isOpen={showMagicLinkModal}
        onClose={() => setShowMagicLinkModal(false)}
        email={email}
        onResend={handleResendMagicLink}
      />
      
      {/* Error Screen Overlay */}
      {apiError && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <ErrorScreen
            title={apiError.title}
            message={apiError.message}
            onRetry={apiError.onRetry}
            onGoBack={() => setApiError(null)}
          />
        </div>
      )}
    </div>
  )
}

