import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { handleAllData, getStoredHomeData } from '../api/home.js'
import { imagesURL } from '../api/index.js'

export default function GiveawayDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [homeData, setHomeData] = useState(null)
  
  // Get giveaway data passed from navigation
  const { giveawayData, activityData, fromActivities } = location.state || {}
  const giveaway = giveawayData || activityData
  
  console.log('GiveawayDetailPage - Received data:', { giveawayData, activityData, fromActivities, giveaway })

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
        console.error('Error initializing giveaway detail data:', error)
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

  if (!giveaway) {
    return (
      <AppLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ fontSize: 18, color: '#6B7280' }}>No giveaway data found</div>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
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
          {fromActivities ? 'Activity Details' : 'Giveaway Details'}
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
          
          {/* Giveaway Hero Section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              overflow: 'hidden'
            }}>
              {/* Giveaway Image */}
              <div style={{ position: 'relative' }}>
                {(giveaway?.additional_data?.image || giveaway?.image || giveaway?.logo) ? (
                  <img 
                    src={`${imagesURL}${giveaway?.additional_data?.image || giveaway?.image || giveaway?.logo}/public`}
                    alt="Giveaway"
                    style={{ 
                      width: '100%', 
                      height: '250px', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '250px', 
                    background: 'linear-gradient(135deg, #A979E8 0%, #8B5FCF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 64, color: '#fff' }}>🎁</span>
                  </div>
                )}
                
                {/* Activity/Giveaway Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: fromActivities ? 'rgba(86, 107, 185, 0.9)' : 'rgba(169, 121, 232, 0.9)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  {fromActivities ? (giveaway?.activity_type || 'Activity') : (giveaway?.type === 'GiveAway' ? 'Giveaway' : giveaway?.activity_type || 'Activity')}
                </div>
              </div>
              
              {/* Giveaway Info */}
              <div style={{ padding: 24 }}>
                <h2 style={{ 
                  margin: '0 0 12px', 
                  fontSize: 28, 
                  color: '#1E1F24',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}>
                  {giveaway?.additional_data?.name || 
                   giveaway?.additional_data?.title || 
                   giveaway?.title || 
                   (fromActivities ? 'Activity Title' : 'Giveaway Title')}
                </h2>
                
                <p style={{ 
                  margin: '0 0 20px', 
                  fontSize: 16, 
                  color: '#6B7280', 
                  lineHeight: 1.6 
                }}>
                  {giveaway?.additional_data?.description ? 
                    giveaway.additional_data.description.replace(/<[^>]*>/g, '') : 
                    giveaway?.description ? 
                    giveaway.description.replace(/<[^>]*>/g, '') :
                    (fromActivities ? 'Join this exciting activity and participate in fun activities!' : 'Enter this exciting giveaway to win amazing prizes!')
                  }
                </p>
                
                {/* Location and Zone Info */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                  {(giveaway?.additional_data?.data?.zone || giveaway?.zone) && (
                    <div style={{
                      background: '#E4EBFF',
                      color: '#3F57D0',
                      borderRadius: 12,
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      📍 Zone: {giveaway?.additional_data?.data?.zone || giveaway?.zone}
                    </div>
                  )}
                  
                  {(giveaway?.additional_data?.data?.booth_name || giveaway?.booth_name) && (
                    <div style={{
                      background: '#F0F7FB',
                      color: '#2A46A8',
                      borderRadius: 12,
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      🏢 Booth: {giveaway?.additional_data?.data?.booth_name || giveaway?.booth_name}
                    </div>
                  )}
                </div>
                
                {/* Enter Activity/Giveaway Button */}
                <button style={{
                  width: '100%',
                  background: fromActivities ? 'linear-gradient(90deg, #556BB9 0%, #3A4A8A 100%)' : 'linear-gradient(90deg, #A979E8 0%, #8B5FCF 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 25,
                  padding: '16px 24px',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {fromActivities ? 'Join Activity' : 'Enter Giveaway'}
                </button>
              </div>
            </div>
          </div>

          {/* Activity/Giveaway Details */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              padding: 20
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 20, color: '#1E1F24' }}>
                {fromActivities ? 'Activity Information' : 'Giveaway Information'}
              </h3>
              
              <div style={{ display: 'grid', gap: 16 }}>
                {fromActivities ? (
                  <>
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                        Activity Type
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                        {giveaway?.activity_type || 'Interactive Activity'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                        How to Participate
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                        {giveaway?.participation_instructions || 
                         'Visit the booth and follow the instructions to participate in this exciting activity.'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                        Activity Duration
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                        {giveaway?.duration || 
                         'This activity runs throughout the event. Check with the booth for specific timing.'}
                      </p>
                    </div>
                    
                    {giveaway?.rewards && (
                      <div>
                        <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                          Rewards
                        </h4>
                        <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                          {giveaway.rewards}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                        Prize Details
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                        {giveaway?.additional_data?.data?.prize_description || 
                         giveaway?.prize_description || 
                         'Amazing prizes await the winners! Check with the booth for specific prize details.'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                        How to Participate
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                        {giveaway?.additional_data?.data?.participation_instructions || 
                         giveaway?.participation_instructions || 
                         'Visit the booth, complete the required activities, and submit your entry to participate in this giveaway.'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24', fontWeight: 600 }}>
                        Duration
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                        {giveaway?.additional_data?.data?.duration || 
                         giveaway?.duration || 
                         'This giveaway runs throughout the event. Check with the booth for specific start and end times.'}
                      </p>
                    </div>
                  </>
                )}
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
              <h3 style={{ margin: '0 0 16px', fontSize: 20, color: '#1E1F24' }}>
                {fromActivities ? 'Activity Guidelines' : 'Terms and Conditions'}
              </h3>
              
              <div style={{ 
                fontSize: 14, 
                color: '#6B7280', 
                lineHeight: 1.6,
                marginBottom: 16
              }}>
                {fromActivities ? (
                  <>
                    <p style={{ margin: '0 0 12px' }}>
                      • Participants must follow all safety guidelines
                    </p>
                    <p style={{ margin: '0 0 12px' }}>
                      • Activity participation is subject to availability
                    </p>
                    <p style={{ margin: '0 0 12px' }}>
                      • Please arrive on time for scheduled activities
                    </p>
                    <p style={{ margin: '0 0 12px' }}>
                      • Follow instructions from activity staff
                    </p>
                    <p style={{ margin: '0 0 12px' }}>
                      • Respect other participants and equipment
                    </p>
                    <p style={{ margin: 0 }}>
                      • Activity staff decisions are final
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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

          {/* Related Giveaways */}
          {homeData?.Highlight && homeData.Highlight.filter(h => h.type === 'GiveAway').length > 1 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 20, color: '#1E1F24' }}>
                Other Giveaways
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 16 
              }}>
                {homeData.Highlight
                  .filter(highlight => highlight.type === 'GiveAway' && highlight !== giveaway)
                  .slice(0, 3)
                  .map((relatedGiveaway, index) => (
                  <div key={index} style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  onClick={() => {
                    navigate('/giveaway-detail', {
                      state: {
                        giveawayData: relatedGiveaway,
                        fromActivities: false
                      }
                    });
                  }}
                  >
                    {relatedGiveaway?.additional_data?.image ? (
                      <img 
                        src={`${imagesURL}${relatedGiveaway.additional_data.image}/public`}
                        alt="Giveaway"
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '120px', 
                        background: 'linear-gradient(135deg, #A979E8 0%, #8B5FCF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: 24, color: '#fff' }}>🎁</span>
                      </div>
                    )}
                    
                    <div style={{ padding: 12 }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#1E1F24' }}>
                        {relatedGiveaway?.additional_data?.name || relatedGiveaway?.additional_data?.title || 'Giveaway'}
                      </h4>
                      <div style={{
                        background: '#A979E825',
                        border: '1.5px solid #A979E8',
                        borderRadius: 12,
                        padding: '4px 8px',
                        display: 'inline-block',
                        fontSize: 10,
                        color: '#A979E8',
                        fontWeight: 500
                      }}>
                        Giveaway
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  )
}
