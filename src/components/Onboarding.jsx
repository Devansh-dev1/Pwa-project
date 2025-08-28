import { useState } from 'react'

const slides = [
  {
    img: '/onboarding/onboard1.png',
    title: 'Easy Navigation with QR Scanning',
    text: 'Get directions fast. Choose a destination, scan a QR code, and follow the shortest route.',
    progress: 20
  },
  {
    img: '/onboarding/onboard2.png',
    title: 'Personalized Recommendations',
    text: 'Get recommendations based on your interests and what’s trending among others.',
    progress: 40
  },
  {
    img: '/onboarding/onboard3.png',
    title: 'Explore Booths and Win Prizes',
    text: 'Explore booths, discover deals, and enter giveaways to win big!',
    progress: 60
  },
  {
    img: '/onboarding/onboard4.png',
    title: 'Stay Connected and Relive Your Experience',
    text: 'Save favorites, get updates, and relive your experience after the show.',
    progress: 80
  },
  {
    img: '/onboarding/Onboard6.jpg',
    title: 'Ready to Explore?',
    text: "Let's get started and make the most of your show experience!",
    progress: 100,
    isFinal: true
  }
]

import { useNavigate } from 'react-router-dom'

export default function Onboarding({ onFinish }) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const current = slides[index]

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1)
    else if (onFinish) onFinish()
    else navigate('/signin')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: 'calc(var(--vh, 1vh) * 100)', background: '#F3F6FE', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 430, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: current.isFinal ? '#ffffff' : '#F3F6FE', flex: 1, minHeight: 0 }}>
          <img src={current.img} alt={current.title} style={{ width: '70%', height: 'auto', objectFit: 'contain' }} onClick={next} />
        </div>

        <div style={{ width: '100%', background: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxSizing: 'border-box' }}>
          <div style={{ width: 180, height: 8, background: '#E6E9FA', borderRadius: 8 }}>
            <div style={{ width: `${current.progress}%`, height: 8, background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', borderRadius: 8 }} />
          </div>
          <h2 style={{ margin: 0, color: '#1E1F24', textAlign: 'center' }}>{current.title}</h2>
          <p style={{ margin: 0, color: '#6B7280', textAlign: 'center' }}>{current.text}</p>

          {current.isFinal ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <button onClick={() => navigate('/signin')} style={{ height: 56, padding: '0 24px', borderRadius: 999, color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', border: 'none', cursor: 'pointer' }}>Create An Account</button>
              <button onClick={() => navigate('/home')} style={{ height: 56, padding: '0 24px', borderRadius: 999, background: '#EFF7F7', border: 'none', cursor: 'pointer', color: '#556BB9' }}>Skip For Now</button>
              <div style={{ color: '#6B7280' }}>
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signin') }} style={{ color: '#1E1F24' }}>Log In.</a>
              </div>
            </div>
          ) : (
            <img src="/onboarding/ButtonArrow.png" alt="Next" width={70} height={70} style={{ cursor: 'pointer' }} onClick={next} />
          )}
        </div>
      </div>
    </div>
  )
}


