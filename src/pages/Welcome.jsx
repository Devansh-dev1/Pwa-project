import { Link, useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="mobile-frame-container">
      <div className="screen-container" style={{ 
        background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '16px', 
        boxSizing: 'border-box' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/FinalLogo.png" width={64} height={64} alt="Logo" />
          <div style={{ marginTop: 15, textAlign: 'center' }}>
            <h2 style={{ margin: '10px 0 4px', color: '#1E1F24' }}>Welcome to ShowTrail!</h2>
            <p style={{ marginTop: 7, color: '#6B7280' }}>
              Your guide to navigating shows, discovering booths, and more - all in one app.
            </p>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/Mockups.png" alt="Mockups" style={{ width: '100%', maxWidth: 430, height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/onboarding')}
            style={{ height: 56, borderRadius: 999, padding: '0 24px', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}
          >
            <span>Get Started</span>
            <img src="/iconarrow-right.png" width={24} height={24} alt="go" />
          </button>
          <div style={{ marginTop: 20, display: 'flex', gap: 8, alignItems: 'center', color: '#6B7280' }}>
            <span>Already have an account?</span>
            <Link to="/signin" style={{ color: '#1E1F24' }}>Log In.</Link>
          </div>
        </div>
      </div>
    </div>
  )
}



