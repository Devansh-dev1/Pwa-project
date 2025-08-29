import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { setToken } from '../utils/auth.js'
import { linkSignup, signfromTokenUser } from '../api/auth.js'
import { replaceUserInfo } from '../utils/indexedDB.js'
import MagicLinkModal from '../components/MagicLinkModal.jsx'
import ErrorScreen from '../components/ErrorScreen.jsx'
import useStore from '../store/useStore.js'
import AppLayout from '../components/AppLayout.jsx'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUserInfo, setLoading: setGlobalLoading, setError, error } = useStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false)
  const [apiError, setApiError] = useState(null)
  
  // New states for handling encoded path
  const [encodedPath, setEncodedPath] = useState(null)
  const [processingEncodedPath, setProcessingEncodedPath] = useState(false)
  const [showEncodedPathLoader, setShowEncodedPathLoader] = useState(false)

  // Extract parameters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    
    // Check for encoded path (id parameter)
    const idParam = urlParams.get('id')
    if (idParam) {
      console.log('Found encoded path in URL:', idParam)
      setEncodedPath(idParam)
      setShowEncodedPathLoader(true)
      setProcessingEncodedPath(true)
      
     
      handleEncodedPath(idParam)
      
     
     
        handleMagicLinkByUserType()
     
    }
    
   
  }, [location.search])

  // Handle the encoded path from URL
  const handleEncodedPath = async (encodedId) => {
    try {
      console.log('Processing encoded path:', encodedId)
      
      // First, decode base64 if it's base64 encoded
      let decodedString = encodedId
      try {
        // Check if it's base64 encoded
        if (encodedId.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
          decodedString = atob(encodedId)
          console.log('Base64 decoded:', decodedString)
        }
      } catch (error) {
        console.log('Not base64 encoded, using as-is')
      }
      
      // Now decode URL parameters
      let decodedPath
      try {
        decodedPath = decodeURIComponent(decodedString)
        console.log('URL decoded:', decodedPath)
      } catch (error) {
        console.warn('Failed to URL decode, using decoded string:', error)
        decodedPath = decodedString
      }

      // Parse the decoded string to extract individual parameters
      const extractedParams = parseEncodedParameters(decodedPath)
      console.log('Extracted parameters:', extractedParams)
      
      // Store all the extracted data
      localStorage.setItem('pendingEncodedPath', encodedId)
      localStorage.setItem('pendingDecodedPath', decodedPath)
      localStorage.setItem('extractedParams', JSON.stringify(extractedParams))
      
      console.log('Encoded path and parameters stored for later processing')
      
    } catch (error) {
      console.error('Error processing encoded path:', error)
      setApiError({
        title: 'Invalid Link',
        message: 'The link you clicked appears to be invalid or expired.',
        onRetry: () => {
          setApiError(null)
          setShowEncodedPathLoader(false)
          setProcessingEncodedPath(false)
        }
      })
    } finally {
      setProcessingEncodedPath(false)
      setShowEncodedPathLoader(false)
    }
  }

  // Parse the decoded string to extract individual parameters
  const parseEncodedParameters = (decodedString) => {
    try {
      // The decoded string looks like: user_id=4a9decc6-6436-402b-a36c-9e7e648f1369&userType=second_time&code=3xnVwZNv&time=08:28:2025, 05:10:13
      
      // Split by & to get individual key-value pairs
      const pairs = decodedString.split('&')
      const params = {}
      
      pairs.forEach(pair => {
        const [key, value] = pair.split('=')
        if (key && value) {
          params[key] = value
        }
      })
      
      console.log('Parsed parameters:', params)
      return params
      
    } catch (error) {
      console.error('Error parsing parameters:', error)
      return {}
    }
  }

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
      
      // Check if there's a pending encoded path to redirect to
      const pendingPath = localStorage.getItem('pendingDecodedPath')
      if (pendingPath) {
        console.log('Redirecting guest to pending path:', pendingPath)
        localStorage.removeItem('pendingEncodedPath')
        localStorage.removeItem('pendingDecodedPath')
        navigate(pendingPath, { replace: true })
      } else {
        navigate('/home', { replace: true }); 
      }
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      setGlobalLoading(false);
    }
  }

  // Show loader when processing encoded path
  if (showEncodedPathLoader) {
    return (
      <AppLayout hideBottomNav={true}>
        <div style={{ 
          height: 'calc(var(--vh, 1vh) * 100)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)',
          flexDirection: 'column',
          gap: 24
        }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            border: '4px solid #E6E9FA', 
            borderTop: '4px solid #2a46a8', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }} />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1E1F24' }}>
              Processing Your Link
            </h3>
            <p style={{ margin: 0, color: '#6B7280' }}>
              Please wait while we prepare your experience...
            </p>
            {processingEncodedPath && (
              <p style={{ margin: '8px 0 0 0', color: '#2a46a8', fontSize: '14px' }}>
                🔄 Extracting parameters and verifying magic link...
              </p>
            )}
          </div>
          
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </AppLayout>
    )
  }

  // Function to handle successful magic link verification
  const handleMagicLinkSuccess = () => {
    // Check if there's a pending encoded path to redirect to
    const pendingPath = localStorage.getItem('pendingDecodedPath')
    if (pendingPath) {
      console.log('Redirecting authenticated user to pending path:', pendingPath)
      localStorage.removeItem('pendingEncodedPath')
      localStorage.removeItem('pendingDecodedPath')
      navigate(pendingPath, { replace: true })
    } else {
      // Default navigation
      navigate('/home', { replace: true })
    }
  }

  // Function to get extracted parameters
  const getExtractedParams = () => {
    try {
      return JSON.parse(localStorage.getItem('extractedParams') || '{}')
    } catch (error) {
      console.error('Error getting extracted params:', error)
      return {}
    }
  }



  // Function to handle magic link verification based on userType (same as NewSignLoading.js)
  const handleMagicLinkByUserType = async () => {
    try {
      setGlobalLoading(true)
      setLoading(true)
      
      const params = getExtractedParams()
      const { user_id, userType, code, time } = params
      
      if (!user_id || !userType || !code) {
        throw new Error('Missing required parameters')
      }
      
      console.log('Processing magic link for:', { user_id, userType, code, time })
      
      let apiData = {}
      
      if (userType === 'second_time') {
        // Login flow - same as loginPages in NewSignLoading.js
        apiData = {
          email: user_id,
          second_time: 'second_time',
          code: code
        }
        console.log('Login flow data:', apiData)
      } else if (userType === 'first_time') {
        // Register flow - same as registerPages in NewSignLoading.js
        apiData = {
          email: user_id,
          code: code,
          times: userType
        }
        console.log('Register flow data:', apiData)
      } else {
        throw new Error('Invalid userType')
      }
      
      // Call the same API as NewSignLoading.js
      const response = await signfromTokenUser(apiData)
      
      
      if (response?.result?.token || response?.token) {
      await replaceUserInfo(response?.result)
        
        // Redirect based on userType and response
        if (userType === 'second_time') {
          // Second time user - go to home page
          console.log('Redirecting second time user to home')
          navigate('/home', { replace: true })
        } else if (userType === 'first_time') {
          // First time user - go to drivers-license page
          console.log('Redirecting first time user to drivers-license')
          navigate('/signup/drivers-license', { replace: true })
        }
        
        // Clear stored parameters
        localStorage.removeItem('pendingEncodedPath')
        localStorage.removeItem('pendingDecodedPath')
        localStorage.removeItem('extractedParams')
        
      } else {
        throw new Error('No token received from API')
      }
      
    } catch (error) {
      console.error('Magic link verification error:', error)
      // setApiError({
      //   title: 'Link Verification Failed',
      //   message: 'The magic link is invalid or has expired. Please request a new one.',
      //   onRetry: () => {
      //     setApiError(null)
      //     setShowMagicLinkModal(true)
      //   }
      // })
    } finally {
      setGlobalLoading(false)
      setLoading(false)
    }
  }



  return (
    <AppLayout hideBottomNav={true}>
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
        {/* <button
          type="button"
          onClick={() => navigate('/signup/drivers-license')}
          style={{
            height: 40,
            padding: '0 24px',
            borderRadius: 999,
            background: 'transparent',
            border: '1.5px solid #2a46a8',
            color: '#2a46a8',
            fontSize: 14,
            width: '100%',
            maxWidth: 430,
            marginTop: 8,
            fontFamily: 'Nunito-SemiBold, sans-serif'
          }}
        >
            Sign Up 
            </button> */}
        {/* </button> */}

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
    </AppLayout>
  )
}

