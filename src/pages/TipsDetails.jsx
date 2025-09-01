import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { imagesURL } from '../api/index.js';
import { getStoredHomeData } from '../api/home.js';
import AppLayout from '../components/AppLayout.jsx';

// Helper to build Cloudflare image URL keys into full URLs
const buildImg = (key) => {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return key;
  return `${imagesURL}${key}/public`;
};

// Tips color array
const tipsColor = [
  '#9458E2',
  '#FF6E95', 
  '#6B2E3F',
  '#309866'
];

const TipsDetails = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state or IndexedDB
  const { tipData, backColor, fromList } = location.state || {};
  
  // Get tips data from IndexedDB
  const [tipsData, setTipsData] = useState([]);
  
  useEffect(() => {
    const loadTipsData = async () => {
      try {
        const storedData = await getStoredHomeData();
        if (storedData && storedData.Tip) {
          setTipsData(storedData.Tip);
          console.log('✅ Loaded tips data from IndexedDB:', storedData.Tip);
        } else {
          console.log('⚠️ No tips data found in IndexedDB');
        }
      } catch (error) {
        console.error('Error loading tips data:', error);
      }
    };

    loadTipsData();
  }, []);

  const extractTextFromHTML = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ''); // Remove HTML tags
  };

  const toggleDescription = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],  
    }));
  };

  // Determine which tips to display
  const tipsToDisplay = tipData ? [tipData] : tipsData;

  return (
    <AppLayout>
      <div style={{
        minHeight: '100vh',
        paddingTop: '24px',
        paddingBottom: '64px',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fff'
      }}>
        {/* Top Navigation */}
        <div style={{
          paddingHorizontal: '16px',
          paddingBottom: '24px',
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch'
        }}>
          <button
            style={{
              borderRadius: '8px',
              width: '48px',
              justifyContent: 'center',
              height: '48px',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: '#c0c0c0',
              flexDirection: 'row',
              alignItems: 'center',
              background: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate(-1)}
          >
            <span style={{ fontSize: '20px' }}>←</span>
          </button>
          <h1 style={{
            marginLeft: '12px',
            color: '#6b7280',
            textAlign: 'left',
            letterSpacing: '-0.1px',
            fontSize: '20px',
            flex: 1,
            margin: '0 0 0 12px'
          }}>
            Tips List
          </h1>
        </div>

        {/* Tips Content */}
        <div style={{
          paddingHorizontal: '16px',
          paddingBottom: '64px',
          alignSelf: 'stretch'
        }}>
          {tipsToDisplay?.length > 0 && (
            <div style={{ alignSelf: 'stretch' }}>
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: '15px',
                alignSelf: 'center'
              }}>
                {tipsToDisplay.map((tip, index) => {
                  let displayColor = tipData ? backColor : tipsColor[index % 4];
                  const plainText = extractTextFromHTML(tip?.description);

                  return (
                    <div
                      key={index}
                      style={{
                        width: '100%',
                        minHeight: '175px',
                        marginBottom: '20px',
                        backgroundColor: `${displayColor}15`,
                        borderRadius: '20px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => toggleDescription(index)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {/* Header Section */}
                      <div style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignSelf: 'stretch'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <h3 style={{
                            width: '60%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            fontSize: '16px',
                            lineHeight: '22px',
                            color: displayColor,
                            letterSpacing: '0.7px',
                            margin: 0,
                            fontWeight: 600
                          }}>
                            {tip?.title || 'Tip Title'}
                          </h3>

                          {/* Tip Logo/Image */}
                          <div style={{
                            borderRadius: '14px',
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: displayColor,
                            padding: '3px',
                            backgroundColor: '#ffffff',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                          }}>
                            {tip?.logo ? (
                              <img
                                src={buildImg(tip.logo)}
                                alt="Tip"
                                style={{
                                  width: '23px',
                                  height: '23px',
                                  objectFit: 'contain'
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: '20px' }}>💡</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div style={{ marginTop: '15px', alignSelf: 'stretch' }}>
                        <p style={{
                          fontSize: '12px',
                          color: `${displayColor}95`,
                          lineHeight: '19px',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: expandedItems[index] ? 'unset' : 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {plainText || 'Tip description coming soon'}
                        </p>
                      </div>

                      {/* Read More/Less Button */}
                      {!fromList && plainText && plainText.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(index);
                          }}
                          style={{
                            marginTop: '10px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            textDecoration: 'underline',
                            color: displayColor,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = `${displayColor}20`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          {expandedItems[index] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Tips Message */}
          {(!tipsToDisplay || tipsToDisplay.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>💡</span>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#374151' }}>
                No Tips Available
              </h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Tips will appear here once they are added to the event.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TipsDetails;

