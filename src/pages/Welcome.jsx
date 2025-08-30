import { Link, useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="mobile-frame-container">
      <div className="screen-container welcomeContianer">
        <div className='welcomeContianerIner'>
          <img src="/FinalLogo.png" width={64} height={64} alt="Logo" className='welcomeShowLogo' />
          <div  className='welcomeContianerRow'>
            <h2>Welcome to ShowTrail!</h2>
            <p>
              Your guide to navigating shows, discovering booths, and more - all in one app.
            </p>
          </div>
        </div>

        <div className='welcomeMidSlide'>
          <img src="/Mockups.png" alt="Mockups" />
        </div>

        <div className='welcomeBtm'>
          <button className='welcomeBtmStarted' onClick={() => navigate('/onboarding')}>
            <span>Get Started</span>
            <img src="/iconarrow-right.png" width={24} height={24} alt="go" />
          </button>
          <div className='welcomeBtmHaveAc'>
            <span>Already have an account?</span>
            <Link to="/signin">Log In.</Link>
          </div>
        </div>
      </div>
    </div>
  )
}



