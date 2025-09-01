import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import { imagesURL } from '../api/index.js';
import { getStoredHomeData } from '../api/home.js';

// Helper function to build image URLs
const buildImg = (key) => {
  if (!key) return null;
  return `${imagesURL}${key}/public`;
};

// Helper function to get zone background color
const getZoneBackgroundColor = (zoneId, boothData) => {
  const zone = boothData?.find(item => item?.id == zoneId);
  const zoneColor = zone?.zone_color;
  
  // Check if it's a valid hex color
  const isHexColor = /^#[0-9A-F]{6}$/i;
  return isHexColor.test(zoneColor) ? zoneColor : '#F8B737';
};

// Format time function to match mobile app
const formatTime = (time) => {
  if (!time) return '';
  
  try {
    // Handle different time formats
    const timeString = typeof time === 'string' ? time : String(time);
    
    // If it's already in HH:MM format
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Handle other formats
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    
    return timeString;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time;
  }
};

// Format date function to match mobile app
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
    return dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export default function ExhibitorDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  // Get booth data from navigation state or load from storage
  const [booth, setBooth] = useState(location.state?.booth || null);
  const [zoneName, setZoneName] = useState(location.state?.zoneName || '');
  const [sampleIconShow, setSampleIconShow] = useState(location.state?.sampleIconShow || false);
  const [loading, setLoading] = useState(!booth);
  const [likeIcon, setLikeIcon] = useState(false);
  const [visibleCodes, setVisibleCodes] = useState({});
  const [selectedMyDay, setSelectedMyDay] = useState(0);
  
  // State for UI interactions
  const [scrollY, setScrollY] = useState(0);
  const [isHalfScrolled, setIsHalfScrolled] = useState(false);


  const getBoothData =async () => {

    if (id) {
      // const existingData = localStorage.getItem('homeData');
      const existingData = await getStoredHomeData();
      if (existingData) {
        try {
          const userData =existingData// JSON.parse(existingData);
          const foundBooth = userData.show_exhibitor?.find(
            exhibitor => exhibitor.exhibitor_id === id
          );
          if (foundBooth) {
            setBooth(foundBooth);
            setZoneName(foundBooth.zone || '');
            setSampleIconShow(Array.isArray(foundBooth?.company?.[0]?.sample_ids));
          }
        } catch (error) {
          console.error('Error loading booth data:', error);
        }
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    // If no booth data from navigation, try to load from localStorage
    getBoothData()
  }, []);

  // Handle scroll events
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrollY(scrollTop);
    setIsHalfScrolled(scrollTop > window.innerHeight / 2);
  };

  // Handle like functionality
  const handleLike = () => {
    setLikeIcon(!likeIcon);
    // TODO: Implement actual like functionality with localStorage/API
  };

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: booth?.company?.[0]?.name || 'Booth Details',
          text: `Check out ${booth?.company?.[0]?.name || 'this booth'} at the show!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Handle add to plan functionality
  const handleAddToPlan = () => {
    setSelectedMyDay(selectedMyDay === 0 ? 1 : 0);
    // TODO: Implement actual plan functionality with localStorage/API
  };

  // Get zone color for this booth
  const getBoothZoneColor = () => {
    try {
      const existingData = localStorage.getItem('homeData');
      if (existingData) {
        const userData = JSON.parse(existingData);
        const zoneData = userData.Booth_N_Zone || [];
        const zone = zoneData.find(item => item?.id == booth?.booth_id);
        const zoneColor = zone?.zone_color;
        
        // Check if it's a valid hex color
        const isHexColor = /^#[0-9A-F]{6}$/i;
        return isHexColor.test(zoneColor) ? zoneColor : '#F8B737';
      }
    } catch (error) {
      console.error('Error getting zone color:', error);
    }
    return '#F8B737'; // Default color
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff'
      }}>
        <div style={{
          fontSize: 18,
          color: '#6B7280'
        }}>
          Loading exhibitor details...
        </div>
      </div>
    );
  }

  if (!booth) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        padding: '20px'
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16
        }}>🔍</div>
        <h2 style={{
          margin: '0 0 8px',
          color: '#1E1F24',
          fontSize: 24,
          fontWeight: 600
        }}>
          Exhibitor not found
        </h2>
        <p style={{
          margin: '0 0 20px',
          color: '#6B7280',
          textAlign: 'center'
        }}>
          The exhibitor you're looking for could not be found.
        </p>
        <button
          onClick={() => navigate('/booths')}
          style={{
            background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 32,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Back to Booths
        </button>
      </div>
    );
  }

  const zoneColor = getBoothZoneColor();
  const companyLogo = buildImg(booth?.exhibitor_image || booth?.company?.[0]?.logo);

  return (
    <AppLayout hideBottomNav={true}>
      <div style={{ 
        backgroundColor: '#fff', 
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
          boxShadow: scrollY > 0 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          transition: 'box-shadow 0.2s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Back button */}
            <button
              onClick={() => navigate('/booths')}
              style={{
                width: 48,
                height: 48,
                border: '1.5px solid #e5e7eb',
                borderRadius: 18,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#2a46a8';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <img 
                src="/assets/iconchevron-left.png" 
                alt="Back" 
                style={{ width: 24, height: 24 }}
              />
            </button>

          {/* Title */}
          <h1 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: '#1E1F24',
            flex: 1,
            textAlign: 'center',
            marginLeft: 12
          }}>
            Exhibitor Detail
          </h1>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 8
          }}>
            {/* Like button */}
            <button
              onClick={handleLike}
              style={{
                width: 48,
                height: 48,
                // border: likeIcon ? '1.5px solid #2a46a8' : '1.5px solid #e5e7eb',
                borderRadius: 18,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = likeIcon ? '#f0f4ff' : '#f8f9fa';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src={likeIcon ? "/assets/boothLikeActive.png" : "/assets/boothLike.png"} 
                alt="Like" 
                style={{ width: 40, height: 40 }}
              />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              style={{
                width: 48,
                height: 48,
                // border: '1.5px solid #e5e7eb',
                borderRadius: 18,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#2a46a8';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="/assets/boothShare.png" 
                alt="Share" 
                style={{ width: 40, height: 40 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          overflowY: 'auto',
          height: 'calc(100vh - 80px)',
          paddingBottom: 40
        }}
      >
        {/* Main booth card */}
        <div style={{ margin: '16px', padding: 2, borderRadius: 28,  }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid #2a46a8',
            borderWidth: 1.5
          }}>
          {/* Company logo and info section */}
          <div style={{
            padding: 16,
          }}>
            <div style={{
              display: 'flex',
              flex: 1,
              gap: 16,
              flexDirection: 'column'
            }}>
              {/* Logo */}
              <div style={{
                flex: 1,
                borderRadius: 20,
                justifyContent: 'center',
                minHeight: '230px',
                border: '1px solid #e5e7eb',
                display: 'flex',
              }}>
                {companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt={booth?.company?.[0]?.name || 'Company'} 
                    style={{ 
                      width: '100%',
                      borderRadius: 20,
                      
                    }} 
                  />
                ) : (
                  <span style={{ 
                    fontSize: 32, 
                    color: '#6B7280' 
                  }}>
                    🏪
                  </span>
                )}
              </div>

              {/* Company info */}
              <div style={{ flex: 1 }}>
                <h2 style={{
                  margin: '0 0 8px',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#1E1F24',
                  lineHeight: 1.2
                }}>
                  {booth?.company?.[0]?.name || 'Company Name'}
                </h2>

                {/* Zone & Booth No. pill (yellow) */}
                {booth?.booth_name && booth?.zone && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFF6D8',
                      borderRadius: 20,
                      padding: '12px '
                    }}>
                      <span style={{ color: '#413C3A', fontSize: 12, fontWeight: 700 }}>Zone & Booth No.</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#F8B737', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {String(booth.zone).toUpperCase()}
                        </div>
                        <div style={{ padding: '6px 10px', backgroundColor: '#fff', border: '1px solid #F8B737', color: '#1E1F24', fontWeight: 700, borderRadius: 16 }}>
                          {booth.booth_name || booth.booth_id}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hours section */}
            {Array.isArray(booth?.opening_closing) && booth.opening_closing.length > 0 && (
              <div style={{
                marginTop: 16,
                padding: 16,
                backgroundColor: `${zoneColor}15`,
                borderRadius: 16,
                border: `1px solid ${zoneColor}30`
              }}>
                <h3 style={{
                  margin: '0 0 12px',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#1E1F24'
                }}>
                  Hours
                </h3>
                
                {booth.opening_closing.map((schedule, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: index < booth.opening_closing.length - 1 ? 8 : 0
                  }}>
                    <div style={{
                      fontSize: 14,
                      color: '#1E1F24',
                      fontWeight: 500
                    }}>
                      {formatDate(schedule.date)}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: '#6B7280'
                    }}>
                      {formatTime(schedule.start_time || schedule.opening_time)} - {formatTime(schedule.end_time || schedule.closing_time)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

         

          {/* Action buttons */}
          <div style={{
            padding: 16,
            borderTop: '1px solid #e5e7eb',
            // display: 'flex',
            gap: 12
          }}>
            {/* View On Map - primary gradient */}
            <div style = {{ flexDirection: 'column'}}>
            <button
              onClick={() => navigate('/map', { state: { booth } })}
              style={{
                width: '100%',
                flex: 1,
                padding: '16px',
                border: 'none',
                borderRadius: 50,
                background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
            >
              <img 
                src="/assets/iconlocation.png" 
                alt="Location" 
                style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }}
              />
              View On Map
            </button>

            {/* Get Directions - outlined with arrow on right */}
            <button
              style={{
                flex: 1,
                width: '100%',
                padding: '16px',
                border: '1.5px solid #2a46a8',
                borderRadius: 50,
                background: 'transparent',
                marginTop: '16px',
                color: '#2a46a8',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span style={{ flex: 1, textAlign: 'center' ,paddingRight: '16px'}}>Get Directions</span>
              <span style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#E9EEFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/iconarrow-right.png" alt="Arrow" style={{ width: 14, height: 14 }} />
              </span>
            </button>
            </div>
          </div>
          {/* close inner white card */}
          </div>
          {/* close gradient wrapper */}
        </div>

         {/* Description section */}
         {booth?.company?.[0]?.description && booth.company[0].description !== 'null' && (
            <div style={{ padding: 16 }}>
              <h3 style={{
                // margin: '0 0 12px',
                // fontSize: 18,
                // fontWeight: 600,
                color: '#1E1F24'
              }}>
                About {booth?.company?.[0]?.name}
              </h3>
              
              <div style={{
                height: 1,
                backgroundColor: '#e5e7eb',
                margin: '0 0 16px'
              }} />
              
              <div style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: '#4B5563'
              }}>
                {booth.company[0].description}
              </div>
            </div>
          )}

        {/* Coupons section */}
        {booth?.coupons && booth.coupons.length > 0 && (
          <div style={{
            margin: '0 16px 16px',
            backgroundColor: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 24,
            padding: 16
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              <img 
                src="/assets/couponIcon.png" 
                alt="Coupon" 
                style={{ width: 20, height: 20 }}
              />
              <h3 style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: '#1E1F24'
              }}>
                Coupons & Offers
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {booth.coupons.map((coupon, index) => (
                <div key={index} style={{
                  padding: 16,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 16,
                  border: '1px solid #e5e7eb',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#1E1F24',
                      flex: 1
                    }}>
                      {coupon.coupon_title || 'Special Offer'}
                    </h4>
                    
                    {coupon.discount_percentage && (
                      <div style={{
                        padding: '4px 8px',
                        backgroundColor: '#10b981',
                        color: '#fff',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {coupon.discount_percentage}% OFF
                      </div>
                    )}
                  </div>
                  
                  {coupon.coupon_description && (
                    <p style={{
                      margin: '0 0 12px',
                      fontSize: 14,
                      color: '#6B7280',
                      lineHeight: 1.4
                    }}>
                      {coupon.coupon_description}
                    </p>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    {visibleCodes[coupon.coupon_id] ? (
                      <div style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        fontFamily: 'monospace',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1E1F24',
                        textAlign: 'center'
                      }}>
                        {coupon.coupon_code || 'SAVE20'}
                      </div>
                    ) : (
                      <button
                        onClick={() => setVisibleCodes(prev => ({...prev, [coupon.coupon_id]: true}))}
                        style={{
                          flex: 1,
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Unlock Code
                      </button>
                    )}
                    
                    {coupon.expiry_date && (
                      <div style={{
                        fontSize: 12,
                        color: '#6B7280'
                      }}>
                        Exp: {formatDate(coupon.expiry_date)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Samples section */}
        {sampleIconShow && (
          <div style={{
            margin: '0 16px 16px',
            backgroundColor: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 24,
            padding: 16
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              <img 
                src="/assets/IconGift.png" 
                alt="Gift" 
                style={{ width: 20, height: 20 }}
              />
              <h3 style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: '#1E1F24'
              }}>
                Free Samples at the Show
              </h3>
            </div>
            
            <div style={{
              padding: 16,
              backgroundColor: '#f0f9ff',
              borderRadius: 16,
              border: '1px solid #0284c7',
              textAlign: 'center'
            }}>
              <img 
                src="/assets/IconGift.png" 
                alt="Gift" 
                style={{ width: 32, height: 32, display: 'block', margin: '0 auto 8px' }}
              />
              <p style={{
                margin: 0,
                fontSize: 14,
                color: '#0284c7',
                fontWeight: 500
              }}>
                This booth offers free samples! Visit them to learn more.
              </p>
            </div>
          </div>
        )}

        {/* Products section */}
        {booth?.company?.[0]?.company_products && booth.company[0].company_products.length > 0 && (
          <div style={{
            margin: '0 16px 16px',
            backgroundColor: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 24,
            padding: 16
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              <img 
                src="/assets/shopIcon.png" 
                alt="Products" 
                style={{ width: 20, height: 20 }}
              />
              <h3 style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: '#1E1F24'
              }}>
                Products at the Show
              </h3>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12
            }}>
              {booth.company[0].company_products.map((product, index) => (
                <div 
                  key={index} 
                  onClick={() => product.product_url && window.open(product.product_url, '_blank')}
                  style={{
                    padding: 12,
                    backgroundColor: '#f0f9ff',
                    borderRadius: 16,
                    border: '1px solid #e5e7eb',
                    cursor: product.product_url ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (product.product_url) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.product_url) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {product.product_image ? (
                    <div style={{
                      width: '100%',
                      height: 80,
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8
                    }}>
                      <img 
                        src={buildImg(product.product_image)} 
                        alt={product.product_name} 
                        style={{ 
                          maxWidth: '80%', 
                          maxHeight: '80%', 
                          objectFit: 'contain' 
                        }} 
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: 80,
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8
                    }}>
                      <img 
                        src="/assets/shopIcon.png" 
                        alt="Product" 
                        style={{ width: 24, height: 24, opacity: 0.5 }}
                      />
                    </div>
                  )}
                  
                  <h4 style={{
                    margin: '0 0 4px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1E1F24',
                    lineHeight: 1.2,
                    textAlign: 'center'
                  }}>
                    {product.product_name || 'Product'}
                  </h4>
                  
                  {product.product_price && (
                    <p style={{
                      margin: '0 0 8px',
                      fontSize: 12,
                      color: '#10b981',
                      fontWeight: 600
                    }}>
                      ${product.product_price}
                    </p>
                  )}
                  
                  {product.product_url && (
                    <div style={{
                      fontSize: 12,
                      color: '#2a46a8',
                      fontWeight: 500
                    }}>
                      View Details →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category section */}
        {booth?.categories && booth.categories.length > 0 && (
          <div style={{
            padding: 16
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E1F24' }}>Category</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {booth.categories.map((cat, index) => (
                <div key={index} style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  backgroundColor: '#9458E2',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 10
                }}>
                  {cat?.name || cat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags section */}
        {booth?.tags && booth.tags.length > 0 && booth.tags[0]?.id !== null && (
          <div style={{
            margin: '16px',
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E1F24' }}>Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {booth.tags.map((tag, index) => (
                <div key={index} style={{
                  padding: '8px 12px',
                  borderRadius: 16,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F4EEFC',
                  color: '#1E1F24',
                  fontWeight: 700,
                  fontSize: 12
                }}>
                  {tag?.name || tag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stay in touch section */}
        <div style={{
          margin: '0 16px 16px',
          backgroundColor: '#f7f8fd',
        //   border: '1.5px solid #e5e7eb',
          borderRadius: 24,
          padding: 16
        }}>
          <h3 style={{
            margin: '0 0 8px',
            fontSize: 18,
            fontWeight: 600,
            color: '#1E1F24',
            textAlign: 'center'
          }}>
            Stay in touch
          </h3>
          
          <p style={{
            margin: '0 0 16px',
            fontSize: 12,
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            Share your details to stay updated on the latest news and offers from {booth?.company?.[0]?.name}
          </p>
          
          <button
            style={{
              width: '95%',
              padding: '14px',
              background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {/* <img 
              src="/assets/Emailicons.png" 
              alt="Email" 
              style={{ width: 16, height: 16 }}
            /> */}
           Let's Connect
          </button>
        </div>

        {booth?.company?.[0] && (
          <div style={{
            margin: '0 16px 16px',
            backgroundColor: '#f3f3f3',
            border: '1.5px solid #e5e7eb',
            borderRadius: 24,
            padding: 16
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1E1F24' }}>Location</h3>
            {(booth.company[0].address || booth.company[0].city || booth.company[0].province || booth.company[0].postal_code) && (
              <div style={{ marginTop: 10, color: '#413C3A', fontSize: 14, lineHeight: 1.5 }}>
                {[booth.company[0].address, booth.company[0].city, booth.company[0].province, booth.company[0].postal_code].filter(Boolean).join(', ')}
              </div>
            )}

            {/* Embedded map identical section */}
            {booth.company[0].location && (booth.company[0].location.latitude || booth.company[0].location.longitude) && (
              <div style={{ marginTop: 12, borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <iframe
                  title="exhibitor-map"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBY-3hXliLps97YEsKntRQ-ht3gwNxEujI&center=${booth.company[0].location.latitude},${booth.company[0].location.longitude}&zoom=16&maptype=roadmap`}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: '#fff', borderTop: '1px solid #e5e7eb' }}>
                  <img src="/assets/iconlocation2.png" alt="loc" style={{ width: 18, height: 18 }} />
                  <div style={{ color: '#1E1F24', fontSize: 14, lineHeight: 1.4 }}>
                    {[booth.company[0].location.addressLine1 || booth.company[0].location.address_line_1,
                      booth.company[0].location.city,
                      booth.company[0].location.state || booth.company[0].location.state_or_region,
                      booth.company[0].location.postalCode || booth.company[0].location.postal_code]
                      .filter(Boolean).join(', ')}
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${booth.company[0].location.latitude},${booth.company[0].location.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 1000, border: '2px solid #556BB9', color: '#556BB9', fontWeight: 700, textDecoration: 'none' }}
                  >
                    View
                  </a>
                </div>
              </div>
            )}

            {(booth.company[0].email || booth.company[0].phone) && (
              <div style = {{color: '#1E1F24', fontWeight: 600, display: 'flex', flexDirection: 'column',gap: 5 ,marginTop: 12}}> Contact Information
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {booth.company[0].email && (
                  <a href={`mailto:${booth.company[0].email}`} style={{ color: '#a8a5a4', fontWeight: 700, textDecoration: 'none',fontSize: 14 }}>{booth.company[0].email}</a>
                )}
                {booth.company[0].phone && (
                  <a href={`tel:${booth.company[0].phone}`} style={{ color: '#a8a5a4', fontWeight: 700, textDecoration: 'none',fontSize: 14 }}>{booth.company[0].phone}</a>
                )}
              </div>
              </div>
            )}

            {booth.company[0].social_media_url && (
              <div style={{ marginTop: 16 }}>
                <div style={{ color: '#1E1F24', fontWeight: 600, marginBottom: 8 }}>Follow us on</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {Object.entries(booth.company[0].social_media_url)
                    .sort(([k]) => (k === 'twitter' ? 1 : 0))
                    .map(([platform, url]) => {
                      if (!url) return null;
                      const icon = platform.toLowerCase() === 'facebook' ? '/assets/iconfacebook.png'
                        : platform.toLowerCase() === 'instagram' ? '/assets/iconinstagram.png'
                        : platform.toLowerCase() === 'linkedin' ? '/assets/iconlinkedin.png'
                        : '/assets/icongoogle.png';
                      return (
                        <a key={platform} href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex' }}>
                          <img src={icon} alt={platform} style={{ width: 28, height: 28 }} />
                        </a>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional space for floating button */}
        <div style={{ height: 100 }} />
      </div>


        {/* Floating action button - Add to Plan */}
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10
        }}>
          <button
            onClick={handleAddToPlan}
            style={{
              width: isHalfScrolled ? 'auto' : 60,
              height: 60,
              backgroundColor: '#2a46a8',
              border: 'none',
              borderRadius: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(42, 70, 168, 0.3)',
              transition: 'all 0.3s ease',
              padding: isHalfScrolled ? '0 20px' : '0',
              gap: isHalfScrolled ? 8 : 0
            }}
          >
            <img 
              src={selectedMyDay ? "/assets/CheckRoundedFill.png" : "/assets/iconcalendar.png"} 
              alt={selectedMyDay ? "Added" : "Added"} 
              style={{ width: 20, height: 20 }}
            />
            {isHalfScrolled && (
              <span style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}>
                {selectedMyDay ? 'Added' : 'Add to My Day'}
              </span>
            )}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
