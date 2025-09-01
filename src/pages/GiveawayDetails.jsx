import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { handleAllData, getStoredHomeData } from '../api/home.js'
import { imagesURL } from '../api/index.js'

export default function GiveawayDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [homeData, setHomeData] = useState(null)
  
  // Get activity data passed from In-Show Activities
  const { activityData, fromActivities } = location.state || {}

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        
        // Get stored data from IndexedDB
        let storedData = await getStoredHomeData()
        
        if (storedData) {
          setHomeData(storedData)
        } else {
          // If no stored data, fetch fresh data
          const freshData = await handleAllData()
          if (freshData) {
            setHomeData(freshData)
          }
        }
      } catch (error) {
        console.error('Error initializing giveaway data:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ fontSize: 20 }}>←</span>
          <span style={{ fontSize: 16, color: '#1E1F24' }}>Back</span>
        </button>
        <h1 style={{ 
          margin: 0, 
          fontSize: 18, 
          color: '#1E1F24',
          fontWeight: 600
        }}>
          Giveaway Details
        </h1>
        <div style={{ width: 60 }}></div> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px 16px',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{ 
          padding: '24px', 
          minHeight: '100vh',
          background: '#f8f9fa'
        }}>
          
          {/* Specific Activity Details (when coming from In-Show Activities) */}
          {fromActivities && activityData && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                background: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: 12, 
                overflow: 'hidden',
                padding: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <span style={{ fontSize: 48 }}>🎁</span>
                  <div>
                    <h2 style={{ margin: '0 0 8px', fontSize: 24, color: '#1E1F24' }}>
                      {activityData.title || 'Activity Details'}
                    </h2>
                    <p style={{ margin: 0, fontSize: 16, color: '#6B7280' }}>
                      {activityData.activity_type || 'Giveaway Activity'}
                    </p>
                  </div>
                </div>
                
                {activityData.description && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                      {activityData.description.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                )}
                
               
              </div>
            </div>
          )}

          {/* Giveaway Overview */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #A979E8 0%, #8B5FCF 100%)', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              overflow: 'hidden',
              padding: 24,
              color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 48 }}>🎁</span>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 24, color: '#fff' }}>
                    {fromActivities ? 'Related Giveaways' : 'Exciting Giveaways'}
                  </h2>
                  <p style={{ margin: 0, fontSize: 16, color: 'rgba(255,255,255,0.9)' }}>
                    {fromActivities ? 'Explore more giveaways and activities' : 'Win amazing prizes from our participating brands'}
                  </p>
                </div>
              </div>
            </div>
          </div>

       

        

       

          {/* Terms and Conditions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              padding: 20
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>
                Terms and Conditions
              </h3>
              
              <div style={{ 
                fontSize: 14, 
                color: '#6B7280', 
                lineHeight: 1.6,
                marginBottom: 16
              }}>
                <p style={{ margin: '0 0 12px' }}>
                  • Participants must be 18 years or older to enter
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  • One entry per person per giveaway
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  • Winners will be notified within 48 hours of the event
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  • Prizes must be claimed within 30 days of notification
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  • Employees and immediate family members are not eligible
                </p>
                <p style={{ margin: 0 }}>
                  • All decisions are final and binding
                </p>
              </div>

              <button style={{
                background: 'transparent',
                color: '#A979E8',
                border: '2px solid #A979E8',
                borderRadius: 20,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                View Full Terms
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
