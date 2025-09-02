import { useNavigate } from 'react-router-dom'
import { clearToken, } from '../utils/auth.js'
import { useEffect, useState, useMemo } from 'react'
import { getUserInfo } from '../api/auth.js'
import useStore from '../store/useStore.js'
import { requireAuth } from '../utils/authUtils.js'

import AppLayout from '../components/AppLayout.jsx'
import moment from 'moment'
import { imagesURL } from '../api/index.js'
import { handleAllData, getStoredHomeData, clearAndFetchFreshData } from '../api/home.js'
import { getUserInfo as getIndexedDBUserInfo } from '../utils/indexedDB.js'
import GlobalLoader from '../components/GlobalLoader.jsx'

// Helper to build Cloudflare image URL keys into full URLs
const buildImg = (key) => {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return key;
  return `${imagesURL}${key}/public`;
}

// Helper function to get highlight colors
const getHighlightColor = (type) => {
  switch (type) {
    case 'Exhibitor': return '#81BBBC';
    case 'Journey': return '#556BB9';
    case 'GiveAway': return '#556BB9';
    default: return '#676361';
  }
};

// Helper function to get activity colors
const getActivityColor = (type) => {
  switch (type) {
    case 'Journey': return '#556BB9';
    case 'Scavenger Hunt': return '#A979E8';
    case 'Giveaway': return '#81BBBC';
    default: return '#676361';
  }
};

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
  const { showLoginPopup } = useStore()

  const [loading, setLoading] = useState(false)
  const [homeData, setHomeData] = useState(null)
 
  const [localUserInfo, setLocalUserInfo] = useState(null)
  const [visibleBooths, setVisibleBooths] = useState({})


  // Get user info from IndexedDB
  const getUserInfoFromDB = async () => {
    try {
      const userData = await getIndexedDBUserInfo()
      setLocalUserInfo(userData)
      console.log('User info loaded from IndexedDB:', userData)
    } catch (error) {
      console.warn('Could not load user info from IndexedDB:', error)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!localUserInfo) return 'U'
    
    const firstName = localUserInfo.first_name || localUserInfo.firstName || ''
    const lastName = localUserInfo.last_name || localUserInfo.lastName || ''
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase()
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase()
    }
    
    return 'U'
  }

  useEffect(() => {
    const initializeHome = async () => {
      try {
        setLoading(true)
       
        await getUserInfoFromDB()

        // Clear IndexedDB first, then fetch fresh data from API
        console.log('🔄 Clearing IndexedDB and fetching fresh data...')
        const freshData = await clearAndFetchFreshData()
        
        if (freshData) {
          setHomeData(freshData)
          console.log('✅ Fresh data fetched and stored after clearing IndexedDB:', freshData)
        } else {
          console.error('❌ Failed to fetch home data after clearing IndexedDB')
        }
      } catch (error) {
        console.error('Error initializing home:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeHome()
  }, [navigate])

  // Listen for data-version updates from Firebase hook and refresh local state
  useEffect(() => {
    const onVersionUpdate = async () => {
      try {
        const storedData = await getStoredHomeData()
        if (storedData) {
          setHomeData(storedData)
        }
      } catch (e) {
        console.log('Error updating home data after version change:', e)
      }
    }
    window.addEventListener('data-version-updated', onVersionUpdate)
    return () => window.removeEventListener('data-version-updated', onVersionUpdate)
  }, [])

  // Memoized function to create sections for the sponsor, partners, and exhibitor data
  const sections = useMemo(() => {
    if (!homeData) return [];
    
    return [
      {
        key: 'Sponsor',
        title: `${moment().format('YYYY')} Sponsors`,
        data: homeData.sponsor || [],
        logoPath: item => item.logo,
      },
      {
        key: 'Partners',
        title: `${moment().format('YYYY')} Partners`,
        data: homeData.partners || [],
        logoPath: item => item.logo,
      },
      {
        key: 'Exhibitor',
        title: `${moment().format('YYYY')} Participating Brands`,
        data: homeData.show_exhibitor?.slice().sort(() => Math.random() - 0.5) || [], // shuffle
        logoPath: item => item?.company?.[0]?.logo,
      },
    ];
  }, [homeData]);

  const filteredSections = useMemo(() => {
    return sections
      .map(section => {
        const data = section.data || [];

        if (section.key === 'Exhibitor') {
          // For Exhibitor, show all participating brands/exhibitors
          return data.length > 0 ? section : null;
        }

        // For all other sections, keep them only if data is not empty
        return data.length > 0 ? section : null;
      })
      .filter(Boolean); // Remove null entries
  }, [sections]);

  // Function to show less booths
  const showLessBooths = (zone) => {
    setVisibleBooths(prev => ({
      ...prev,
      [zone]: 9,
    }));
  };

  // Function to show more booths
  const showMoreBooths = (zone) => {
    setVisibleBooths(prev => ({
      ...prev,
      [zone]: (prev[zone] || 9) + 9,
    }));
  };

  // Component to render logos section
  const RenderLogos = ({ key, title, data, logoPath }, index) => {
    const boothsToShow = visibleBooths[key] || 9;
    
    return (
      <div key={`${key}-${index}`} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ 
            margin: '0 0 8px', 
            fontSize: 18, 
            color: '#1E1F24',
            marginTop: title.includes('Sponsors') ? 5 : 15 
          }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
            {key === 'Sponsor' && 'Thank you to our amazing sponsors'}
            {key === 'Partners' && 'Our valued partners supporting this event'}
            {key === 'Exhibitor' && 'Discover all participating brands and exhibitors'}
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: 16,
          marginBottom: 16
        }}>
          {data?.slice(0, boothsToShow)?.map((item, index) => {
            const logo = logoPath(item);
            return (
              <div 
                key={index} 
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                onClick={() => {
                  if (key === 'Exhibitor') {
                    console.log('Navigate to exhibitor details:', item);
                    // Navigate to exhibitor details
                  } else {
                    console.log('Navigate to sponsor/partner details:', item);
                    // Navigate to sponsor/partner details
                  }
                }}
              >
                {logo ? (
                  <img 
                    src={`${imagesURL}${logo}/public`}
                    alt="Logo"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '50px', 
                      objectFit: 'contain' 
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  style={{ 
                    fontSize: 24, 
                    color: '#9ca3af',
                    display: logo ? 'none' : 'flex'
                  }}
                >
                  🏢
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Load More/Less buttons */}
        <div style={{ textAlign: 'center' }}>
          {data.length > boothsToShow ? (
            <button
              style={{
                background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => showMoreBooths(key)}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Load More
            </button>
          ) : (
            boothsToShow > 9 && (
              <button
                style={{
                  background: 'transparent',
                  color: '#4A57C7',
                  border: '2px solid #C9D3FF',
                  borderRadius: 20,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => showLessBooths(key)}
                onMouseEnter={(e) => {
                  e.target.style.background = '#4A57C7';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#4A57C7';
                }}
              >
                Load Less
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <GlobalLoader visible={true} />
  }

  return (
    <AppLayout>
    
     
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          // background: 'linear-gradient(135deg, #2a46a8 0%, #17275c 100%)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          // boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Welcome Text */}
          

          {/* User Avatar */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          // onMouseEnter={(e) => {
          //   e.target.style.background = 'rgba(255, 255, 255, 0.3)'
          //   e.target.style.transform = 'scale(1.05)'
          // }}
          // onMouseLeave={(e) => {
          //   e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          //   e.target.style.transform = 'scale(1)'
          // }}
          onClick={() => {
            console.log('👤 Profile button clicked - checking auth...');
            requireAuth(() => navigate('/profile'), showLoginPopup)
          }}
          >
            {getUserInitials()}
          </div>
        </div>
      

      {/* Main content */}
      <div className='mainContentCstm'>
        <div className='mainContentCstmIner'>
        
          {/* Data Display Sections */}
          {homeData && (
            <>
              {/* Event Information */}
              {homeData.event && homeData.event.length > 0 && (
                <div className='eventInfoDivUpr'>
                  <div className='eventInfoDiv'>
                    {/* Event Image */}
                    <div className='eventImgDiv'>
                      {homeData.event[0]?.show_img?.[0] ? (
                        <img 
                          src={`${imagesURL}${homeData.event[0].show_img[0]}/public`} 
                          alt="Event" />
                      ) : (
                        <div className='eventDivShw'>
                          <span>🎪</span>
                        </div>
                      )}
                    
                    </div>

                    {/* Event Details */}
                    <div className='eventDetails'>
                      <div className='eventDetailsIner'>
                        <div className='eventDetailsData'>
                        <h2>
                          {homeData.event[0]?.title || 'Event Title'}
                        </h2>
                        <p>
                          {homeData.event[0]?.organizer_name || 'Organizer'}
                        </p>
                        </div>
                        <div className='eventDateTBD'>
                          {homeData.event[0]?.show_date?.[0]?.date ? 
                            moment(homeData.event[0].show_date[0].date).format('D MMM, YYYY') : 
                            'Date TBD'
                          }
                        </div>
                      </div>
                      
                      <div className='eventDateLoc'>
                        <span className='eventDateLocFrstSpan'>📍</span>
                        <span className='eventDateLocFrstTxt'>
                          {homeData.event[0]?.address ? 
                            `${homeData.event[0].address.address_line_1 || ''}, ${homeData.event[0].address.city || ''}, ${homeData.event[0].address.state_or_region || ''}` : 
                            'Location TBD'
                          }
                        </span>
                      </div>

                      {/* <button style={{
                        background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 20,
                        padding: '8px 16px',
                        fontSize: 14,
                        cursor: 'pointer'
                      }}>
                        Plan Visit
                      </button> */}
                    </div>


                  </div>
                </div>
              )}

              {/* Highlights Section */}
              {/* Highlights Section */}
              {homeData.Highlight && homeData.Highlight.length > 0 && (
                <div className='highlightSection'>
                  <div className='highlightSectionInr'>
                    <h3>Highlights</h3>
                    <p>
                      {homeData?.event[0]?.global_test?.find(item => item?.Type === 'Highlights')?.description}
                    </p>
                  </div>
                  
                  <div className='highlightSectionGrid'>
                    {homeData.Highlight.slice(0, 6).map((highlight, index) => (
                      <div className='highlightSectionGridInr' key={index}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                             onClick={()=>{
                         if(highlight?.type === 'GiveAway'){
                           navigate('/giveaway-detail', {
                             state: {
                               giveawayData: highlight,
                               fromActivities: false
                             }
                           });
                         }else if( highlight?.type === 'Exhibitor'){
                           console.log('highlight', highlight?.additional_data?.data?.exhibitor_id);
                           navigate(`/booths/${highlight?.additional_data?.data?.exhibitor_id}`, {
                             state: {
                               exhibitorData: highlight,
                             }
                           });

                         }else if( highlight?.type === 'Location'){
                          //  navigate('/highlights-details', {
                          //    state: {
                          //      highlightsData: highlight,
                          //    }
                          //  });

                         }
                       }}
                      >
                        {highlight?.additional_data?.image ? (
                          <img 
                            // src={highlight.additional_data.image} 
                          src={`${imagesURL}${highlight.additional_data.image}/public`} 

                            alt="Highlight"
                            style={{ 
                              width: '100%', 
                              height: '160px', 
                              objectFit: 'cover' 
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '160px', 
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ fontSize: 32 }}>✨</span>
                          </div>
                        )}
                        
                        <div className='highlightTitleSec'>
                          <h4>
                            {highlight?.additional_data?.name || highlight?.additional_data?.title || 'Highlight Title'}
                          </h4>
                          <p>
                            {highlight?.additional_data?.description ? 
                              highlight.additional_data.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 
                              'Description coming soon'
                            }
                          </p>
                          <div className='highlightTypeSec' style={{
                            background: `${getHighlightColor(highlight?.type)}25`,
                            border: `1.5px solid ${getHighlightColor(highlight?.type)}`,
                            color: getHighlightColor(highlight?.type),
                          }}>
                            {highlight?.type === 'GiveAway' ? 'Giveaway' : highlight?.type || 'Featured'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips Section */}
              {homeData.Tip && homeData.Tip.length > 0 && (
                <div className='tipsUpr'>
                  <div className='tipsUprIner'>
                    <h3>Tips</h3>
                    <p>
                      Helpful tips to make the most of your experience
                    </p>
                  </div>
                  
                  <div className='tipsMapContent'>
                    {homeData.Tip.slice(0, 5).map((tip, index) => {
                      const tipColor = ['#9458E2', '#FF6E95', '#6B2E3F', '#309866'][index % 4];
                      return (
                        <div key={index} className='tipsMapTxt' style={{
                          minWidth: '280px',
                          background: `${tipColor}15`,
                          border: `1.5px solid ${tipColor}`,
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        onClick={() => {
                          // Navigate to TipsDetails page like React Native version
                          navigate('/tips', {
                            state: {
                              tipData: tip,
                              backColor: tipColor,
                              fromList: true
                            }
                          });
                        }}
                        >
                          <div className='tipsTxtPara' style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <h4 style={{ margin: 0, fontSize: 16, color: tipColor, flex: 1 }}>
                              {tip.title}
                            </h4>
                            {tip.logo && (
                              <div className='tipsTxtLogo' style={{ border: `2px solid ${tipColor}`}}>
                                <img 
                                  // src={tip.logo} 
                                  src={`${imagesURL}${tip.logo}/public`} 
                                  alt="Tip"
                                />
                              </div>
                            )}
                          </div>
                          
                          <p style={{ 
                            margin: 0, 
                            fontSize: 14, 
                            color: `${tipColor}95`, 
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {tip.description ? tip.description.replace(/<[^>]*>/g, '') : 'Tip description'}
                          </p>

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

             

                        {/* Speakers Section */}
              {homeData.speaker && homeData.speaker.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#1E1F24' }}>Speakers</h3>
                    <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                      {homeData?.event[0]?.global_test?.find(item => item?.Type === 'Speaker')?.description || 'Meet the experts and thought leaders'}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: 16, 
                    overflowX: 'auto', 
                    paddingBottom: 8 
                  }}>
                    {homeData.speaker.slice(0, 7).map((speaker, index) => (
                      <div 
                        key={index} 
                        style={{
                          minWidth: '80px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => navigate('/speakers')}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {speaker?.image ? (
                          <img 
                            // src={speaker.image} 
                            src={`${imagesURL}${speaker.image}/public`} 
                            alt={speaker.name}
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '3px solid #e5e7eb'
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%',
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid #e5e7eb'
                          }}>
                            <span style={{ fontSize: 24 }}>👤</span>
                          </div>
                        )}
                        <p style={{ 
                          margin: '8px 0 0', 
                          fontSize: 12, 
                          color: '#6B7280',
                          maxWidth: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {speaker?.name || 'Speaker Name'}
                        </p>
                      </div>
                    ))}
                    
                    {homeData.speaker.length > 1 && (
                      <div 
                        style={{
                          minWidth: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '3px solid #e5e7eb',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => navigate('/speakers')}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#e5e7eb';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f3f4f6';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <span style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>See All</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seminars Section */}
              {homeData.seminars && homeData.seminars.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#1E1F24' }}>Upcoming Seminars</h3>
                    <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                      Don't miss these informative sessions
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: 16 
                  }}>
                    {homeData.seminars.slice(0, 3).map((seminar, index) => (
                      <div key={index} style={{
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 12,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onClick={() => navigate(`/seminars/${seminar.seminar_id}`, { state: { item: seminar } })}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        {seminar?.seminar_img?.[0] ? (
                          <img 
                            // src={seminar.seminar_img[0]} 
                            src={`${imagesURL}${seminar.seminar_img[0]}/public`} 
                            alt="Seminar"
                            style={{ 
                              width: '100%', 
                              height: '160px', 
                              objectFit: 'cover' 
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '160px', 
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ fontSize: 32 }}>🎓</span>
                          </div>
                        )}
                        
                        <div style={{ padding: 16 }}>
                          <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1E1F24' }}>
                            {seminar.title || 'Seminar Title'}
                          </h4>
                          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#6B7280', lineHeight: 1.4 }}>
                            {seminar.description ? 
                              seminar.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 
                              'Seminar description coming soon'
                            }
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>
                              {seminar.seminar_date ? 
                                moment(seminar.seminar_date).format('D MMM, YYYY') : 
                                'Date TBD'
                              }
                            </div>
                            <button style={{
                              background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 16,
                              padding: '6px 12px',
                              fontSize: 12,
                              cursor: 'pointer'
                            }}>
                              Add to Schedule
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* View All Seminars Button */}
                    {homeData.seminars.length > 3 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginTop: '20px' 
                      }}>
                        <button
                          onClick={() => navigate('/seminars')}
                          style={{
                            padding: '12px 28px',
                            background: 'transparent',
                            color: '#4A57C7',
                            border: '3px solid #C9D3FF',
                            borderRadius: '999px',
                            fontSize: '18px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#4A57C7';
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#4A57C7';
                          }}
                        >
                          View All Seminars
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activities Section */}
              {homeData.AllAcivity && homeData.AllAcivity.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#1E1F24' }}>In-Show Activities</h3>
                    <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                      Engage with interactive activities and games
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: 16 
                  }}>
                    {homeData.AllAcivity.slice(0, 4).map((activity, index) => {
                      const activityColor = getActivityColor(activity?.activity_type);
                      const img = buildImg(activity?.image || activity?.logo);
                      const boothLabel = activity?.booth_name || activity?.zone || activity?.stage || '';
                      return (
                        <div key={index} style={{
                          background: '#F6F7FF',
                          border: '1px solid #e5e7eb',
                          borderRadius: 24,
                          overflow: 'hidden',
                          padding: 16
                        }}>
                          {/* Image */}
                          <div style={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 20,
                            height: 220,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16
                          }}>
                            {img ? (
                              <img src={img} alt={activity.title || 'Activity'} style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }} />
                            ) : (
                              <span style={{ fontSize: 40 }}>🎮</span>
                            )}
                          </div>

                          {/* Title + Booth badge */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <h4 style={{ margin: 0, fontSize: 24, color: '#1E1F24', fontWeight: 800, lineHeight: 1.25 }}>
                              {activity.title || 'Activity Title'}
                            </h4>
                            {boothLabel && (
                              <div style={{
                                padding: '6px 10px',
                                background: '#E4EBFF',
                                color: '#3F57D0',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 700
                              }}>{boothLabel}</div>
                            )}
                          </div>

                          {/* Type chip */}
                          <div style={{ marginTop: 12, marginBottom: 16 }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '8px 14px',
                              borderRadius: 24,
                              border: `2px solid ${activityColor}`,
                              color: activityColor,
                              background: `${activityColor}15`,
                              fontWeight: 600,
                              fontSize: 14
                            }}>
                              {activity.activity_type || 'Activity'}
                            </span>
                          </div>

                          {/* View Details button */}
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              style={{
                                width: '100%',
                                padding: '12px 18px',
                                background: 'transparent',
                                color: '#3F57D0',
                                border: '3px solid #C9D3FF',
                                borderRadius: 999,
                                fontSize: 18,
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                // Navigate to giveaway details page
                                navigate('/giveaway-details', {
                                  state: {
                                    activityData: activity,
                                    fromActivities: true
                                  }
                                });
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            

              {/* Enhanced Sponsors & Partners Section */}
              {filteredSections.length > 0 && (
                <div style={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: 20,
                  marginBottom: 24 
                }}>
                  {filteredSections?.map(RenderLogos)}
                </div>
              )}

              {/* Products Section */}
              {homeData.product && homeData.product.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 22, color: '#1E1F24' }}>Recommended Products</h3>
                      <p style={{ margin: 0, fontSize: 14, color: '#6B7280', maxWidth: 720 }}>
                        Manage the list of recommended products to showcase to users based on preferences, trends, or related categories.
                      </p>
                    </div>
                   
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 16
                  }}>
                    {homeData.product.slice(0, 4).map((product, index) => {
                      const img = buildImg(product?.product_image?.[0]);
                      return (
                        <div key={index} style={{
                          background: '#F0F7FB',
                          border: '1px solid #e5e7eb',
                          borderRadius: 20,
                          overflow: 'hidden'
                        }}>
                          <div style={{ padding: 14 }}>
                            <div style={{
                              height: 180,
                              background: '#fff',
                              borderRadius: 16,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid #e5e7eb'
                            }}>
                              {img ? (
                                <img
                                  src={img}
                                  alt={product.product_name || 'Product'}
                                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                />
                              ) : (
                                <span style={{ fontSize: 32 }}>📦</span>
                              )}
                            </div>

                            <div style={{ marginTop: 14 }}>
                              <h4 style={{
                                margin: '0 0 8px',
                                fontSize: 16,
                                color: '#1E1F24',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {product.product_name || 'Product Name'}
                              </h4>
                              <p style={{ margin: '0 0 14px', fontSize: 16, color: '#6B7280' }}>
                                Price ${product.product_price || '—'}
                              </p>

                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                  onClick={() => {
                                    if (product?.product_url) {
                                      window.open(product.product_url, '_blank');
                                    }
                                  }}
                                  style={{
                                    minWidth: 140,
                                    padding: '10px 18px',
                                    background: '#2743B8',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 28,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Buy
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <button
                      onClick={() => navigate('/products')}
                      style={{
                        padding: '12px 28px',
                        background: 'transparent',
                        color: '#4A57C7',
                        border: '3px solid #C9D3FF',
                        borderRadius: 999,
                        fontSize: 20,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View More
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {homeData.reviews && homeData.reviews.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ marginBottom: 12 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 22, color: '#1E1F24' }}>Reviews</h3>
                    <p style={{ margin: 0, fontSize: 14, color: '#6B7280', maxWidth: 720 }}>
                      Display authentic reviews to build trust and improve the overall experience.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: 16 }}>
                    {homeData.reviews.map((rev, idx) => {
                      const title = rev.title || rev.headline || rev.subject || 'Review';
                      const body = rev.description || rev.content || rev.review || '';
                      const name = rev.name || rev.user_name || rev.user || 'User';
                      const dateStr = rev.created_at || rev.date || rev.updated_at;
                      const initials = (name || 'U')
                        .split(' ')
                        .map(p => p[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();
                      return (
                        <div key={idx} style={{
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 18,
                          padding: 16
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div style={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              background: '#E6E7EB',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#5B5E68',
                              fontWeight: 700
                            }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontSize: 18, color: '#1E1F24', fontWeight: 700 }}>{title}</div>
                              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                                {dateStr ? moment(dateStr).format('MMM D, YYYY h:mm A') : ''}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>{body}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

           

            
            </>
          )}



        

         
        </div>
      </div>
    </AppLayout>
  )
}



