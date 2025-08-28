import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Onboarding from './components/Onboarding.jsx'
import Welcome from './pages/Welcome.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/Home.jsx'
import Booths from './pages/Booths.jsx'
import Map from './pages/Map.jsx'
import PlanVisit from './pages/PlanVisit.jsx'
import Scanner from './pages/Scanner.jsx'
import Profile from './pages/Profile.jsx'
import TipsDetails from './pages/TipsDetails.jsx'
import { getToken } from './utils/auth.js'

function RootRedirect() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken()
        setIsAuthenticated(!!token)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/welcome" replace />
}

export default function App() {
  useEffect(() => {
    const setVhVar = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVhVar()
    window.addEventListener('resize', setVhVar)
    window.addEventListener('orientationchange', setVhVar)
    return () => {
      window.removeEventListener('resize', setVhVar)
      window.removeEventListener('orientationchange', setVhVar)
    }
  }, [])
  return (
    <BrowserRouter>
              <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/booths" element={<Booths />} />
          <Route path="/map" element={<Map />} />
          <Route path="/plan-visit" element={<PlanVisit />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tips" element={<TipsDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  )
}
