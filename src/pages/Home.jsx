import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../utils/auth.js'
import { useEffect, useState } from 'react'
import { getUserInfo } from '../api/auth.js'
import useStore from '../store/useStore.js'
import LoadingScreen from '../components/LoadingScreen.jsx'
import AppLayout from '../components/AppLayout.jsx'

const QuickActionCard = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
  >
    <span style={{ fontSize: 24 }}>{icon}</span>
    <span style={{ fontSize: 14, color: '#1E1F24', fontWeight: 500 }}>{title}</span>
  </button>
);

export default function Home() {
  const navigate = useNavigate()
  const { userInfo, clearUserData, setUserInfo } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeHome = async () => {
      try {
        const token = await getToken()
        if (!token) {
          navigate('/welcome', { replace: true })
          return
        }

        // Try to get user info if not already loaded
        if (!userInfo || !userInfo.auto_id) {
          try {
            const fetchedUserInfo = await getUserInfo()
            setUserInfo(fetchedUserInfo)
          } catch (error) {
            console.warn('Could not fetch user info:', error)
          }
        }
      } catch (error) {
        console.error('Error initializing home:', error)
        navigate('/welcome', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    initializeHome()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await clearToken()
      clearUserData()
      navigate('/welcome', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />
  }

  return (
    <AppLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2a46a8 0%, #17275c 100%)',
        padding: '20px 16px',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              {userInfo?.fName ? `Hi, ${userInfo.fName}!` : 'Welcome!'}
            </h1>
            <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: 14 }}>
              Ready to explore the event?
            </p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/profile')}
            >
              <span style={{ fontSize: 18 }}>👤</span>
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '8px 12px', 
            borderRadius: 12, 
            flex: 1,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>0</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Booths Visited</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '8px 12px', 
            borderRadius: 12, 
            flex: 1,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>0</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Activities</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '8px 12px', 
            borderRadius: 12, 
            flex: 1,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>0</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Points</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px 16px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* Quick Actions */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <QuickActionCard 
              title="Find Booths"
              icon="🏪"
              onClick={() => navigate('/booths')}
            />
            <QuickActionCard 
              title="Map & Navigation"
              icon="🗺️"
              onClick={() => navigate('/map')}
            />
            <QuickActionCard 
              title="My Schedule"
              icon="📅"
              onClick={() => navigate('/plan-visit')}
            />
            <QuickActionCard 
              title="Scan QR"
              icon="📱"
              onClick={() => navigate('/scanner')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>For You</h3>
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>🎯</span>
            <h4 style={{ margin: '0 0 8px', color: '#1E1F24' }}>Get Started</h4>
            <p style={{ margin: 0, color: '#6B7280', fontSize: 14 }}>
              Complete your profile to get personalized recommendations
            </p>
            <button 
              style={{
                marginTop: 12,
                padding: '8px 16px',
                background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                fontSize: 14,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/profile/setup')}
            >
              Complete Profile
            </button>
          </div>
        </div>

        {/* Featured */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>Featured</h3>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 120, background: 'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32 }}>🎪</span>
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24' }}>Welcome to the Show!</h4>
              <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                Discover amazing booths, win prizes, and make the most of your visit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}



