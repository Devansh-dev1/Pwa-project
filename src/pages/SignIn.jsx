import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../utils/auth.js'
import { linkSignup, signfromTokenUser, getUserInfo } from '../api/auth.js'
import { storeToken } from '../utils/indexedDB.js'
import MagicLinkModal from '../components/MagicLinkModal.jsx'
import ErrorScreen from '../components/ErrorScreen.jsx'
import useStore from '../store/useStore.js'
import AppLayout from '../components/AppLayout.jsx'

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
    <AppLayout hideBottomNav={true}>
      <div style={{ height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div className='commonContainer AddSpcDiv divSignIn'>
      <form onSubmit={handleMagicLink} className='divSignInForm'>
        <div className='divSignInFormUpr'>
          <h2>Login</h2>
          <div className='divSignInFormOr'>
            <span className='OrSpan'>or</span>
            <span className='SgnFreeSpan'>Sign Up for Free</span>
          </div>
          <p>
            Enter your email to receive a Magic Link for quick and secure access
          </p>
        </div>

        <div className="signinInputUpr">
          <label>Email Address</label>
          <div className="signinDivUpr">
            <div className="signinDivInr">
              <span><img src="/assets/emailicon.svg" alt="" title="" /></span>
              <input
                className="signin-input"
                type="email"
                placeholder="jacobblack@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button className='magicLinkBtn' type="submit" disabled={loading || !email}  style={{ cursor: loading || !email ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Sending…' : 'Send Magic Link'}
        </button>
        <button className='signUpLinkBtn'  type="button" onClick={() => navigate('/signup/drivers-license')}>
            Sign Up 
        </button>
        {/* </button> */}

        <div className='proceedUpr'>
          <span>By proceeding, you agree to the</span>
          <a href="https://www.iubenda.com/terms-and-conditions/64723559" target="_blank" rel="noreferrer">Terms & Conditions</a>
          <span>and</span>
          <a href="https://www.iubenda.com/privacy-policy/64723559/full-legal" target="_blank" rel="noreferrer">Privacy Policy</a>
          <span>including Cookie Use.</span>
        </div>

        <button className='SkipHomeBtn' type="button" onClick={handleGuestLogin}>
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
        <div className='errorScreenMain' style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <ErrorScreen
            title={apiError.title}
            message={apiError.message}
            onRetry={apiError.onRetry}
            onGoBack={() => setApiError(null)}
          />
        </div>
      )}
    </div>
    </AppLayout>
  )
}

