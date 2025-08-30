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
    img: '/onboarding/Onboard6.2.jpg',
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
    <div className='onboardingUpr'>
      <div className='onboardingInr'>
        <div className='onboardingBnr'>
          <img src={current.img} alt={current.title} onClick={next} className={current.isFinal ? "onboardingFinal" : ""}  />
        </div>

        <div className='onboardingSlides onboardingSlidesBg'>
          <div className='onboardingSlidesBar'>
            <div style={{ width: `${current.progress}%`, height: 8, background: 'linear-gradient(90deg, #d37cfb 0%, #7d4dfc 100%)', borderRadius: 8 }} />
          </div>
          <h2>{current.title}</h2>
          <p>{current.text}</p>

          {current.isFinal ? (
            <div className='onboardingSlidesBtns'>
              <button className='onboardingBtnsCreatAc' onClick={() => navigate('/signin')}><label>Create An Account</label><img src="/assets/iconarrow-right.png" alt="" title="" /></button>
              <button className='onboardingBtnsSkipAc' onClick={() => navigate('/home')}>Skip For Now</button>
              <div className='onboardingSlidesHaveBtns'>
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signin') }}>Log In.</a>
              </div>
            </div>
          ) : (
            <img src="/onboarding/ButtonArrow.png" alt="Next" width={70} height={70} onClick={next} className='onboardingSlidesNext' />
          )}
        </div>

      </div>
    </div>
  )
}


