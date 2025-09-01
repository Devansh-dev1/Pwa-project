import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { handleAllData, getStoredHomeData } from '../api/home.js'
import { imagesURL } from '../api/index.js'

export default function HighlightsDetails() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [homeData, setHomeData] = useState(null)

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
        console.error('Error initializing highlights data:', error)
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
          Location Details
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
          
          {/* Event Information */}
          {homeData?.event && homeData.event.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                background: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: 12, 
                overflow: 'hidden',
                padding: 20
              }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 20, color: '#1E1F24' }}>
                  Event Location
                </h2>
                
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24' }}>
                    {homeData.event[0]?.title || 'Event Title'}
                  </h3>
                  <p style={{ margin: '0 0 8px', fontSize: 14, color: '#6B7280' }}>
                    {homeData.event[0]?.organizer_name || 'Organizer'}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>📍</span>
                  <span style={{ fontSize: 14, color: '#6B7280' }}>
                    {homeData.event[0]?.address ? 
                      `${homeData.event[0].address.address_line_1 || ''}, ${homeData.event[0].address.city || ''}, ${homeData.event[0].address.state_or_region || ''}` : 
                      'Location TBD'
                    }
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>📅</span>
                  <span style={{ fontSize: 14, color: '#6B7280' }}>
                    {homeData.event[0]?.show_date?.[0]?.date ? 
                      new Date(homeData.event[0].show_date[0].date).toLocaleDateString() : 
                      'Date TBD'
                    }
                  </span>
                </div>

                <button style={{
                  background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 16
                }}
                onClick={() => navigate('/map')}
                >
                  View on Map
                </button>
              </div>
            </div>
          )}

          {/* Location Instructions */}
          {homeData?.event?.[0]?.locationinstruction && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                background: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: 12, 
                padding: 20
              }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>
                  Location Instructions
                </h3>
                <div style={{ 
                  fontSize: 14, 
                  color: '#6B7280', 
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}>
                  {homeData.event[0].locationinstruction}
                </div>
              </div>
            </div>
          )}

          {/* Map Section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              padding: 20
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>
                Interactive Map
              </h3>
              <div style={{
                height: 200,
                background: '#f3f4f6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <span style={{ fontSize: 32, color: '#9CA3AF' }}>🗺️</span>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6B7280' }}>
                Use our interactive map to navigate the event venue and find specific locations.
              </p>
              <button style={{
                background: 'transparent',
                color: '#4A57C7',
                border: '2px solid #C9D3FF',
                borderRadius: 20,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}
              onClick={() => navigate('/map')}
              >
                Open Map
              </button>
            </div>
          </div>

          {/* Additional Location Info */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              padding: 20
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1E1F24' }}>
                Getting There
              </h3>
              
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24' }}>
                  Parking Information
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                  Parking is available on-site. Please follow the directional signs to the designated parking areas.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24' }}>
                  Public Transportation
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                  The venue is easily accessible by public transportation. Check local transit schedules for the most up-to-date information.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24' }}>
                  Accessibility
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                  The venue is fully accessible with wheelchair ramps, elevators, and accessible restrooms available throughout the facility.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
