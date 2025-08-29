import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

import { imagesURL } from '../api/index.js';

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

// Categories component
const Categories = ({ category, setCategory }) => (
  <div style={{ 
    display: 'flex', 
    gap: 0, 
    padding: '0 16px', 
    paddingBottom: 8,
    WebkitOverflowScrolling: 'touch'
  }}>
    <button
      onClick={() => setCategory(0)}
      style={{
        flex: 1,
        background: category === 0 ? 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)' : '#f8f9fa',
        color: category === 0 ? '#fff' : '#6B7280',
        border: 'none',
        borderRadius: '20px 0 0 20px',
        padding: '12px 16px',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        borderRight: category === 0 ? 'none' : '1px solid #e5e7eb'
      }}
    >
      Zones
    </button>
    <button
      onClick={() => setCategory(1)}
      style={{
        flex: 1,
        background: category === 1 ? 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)' : '#f8f9fa',
        color: category === 1 ? '#fff' : '#6B7280',
        border: 'none',
        borderRadius: '0 20px 20px 0',
        padding: '12px 16px',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        borderLeft: category === 1 ? 'none' : '1px solid #e5e7eb'
      }}
    >
      Categories
    </button>
  </div>
);

// Booth card component
const BoothCard = ({ booth, zone, zoneColor, onClick, isSuggested }) => {
  const img = buildImg(booth.exhibitor_image || booth.company?.[0]?.logo);
  const hasSamples = Array.isArray(booth.company?.[0]?.sample_ids);
  
  return (
    <div
      onClick={onClick}
      style={{
        width: 'calc(50% - 30px)',
        padding: '8px',
        minHeight: 180,
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        backgroundColor: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      }}
    >
      {/* Suggestion icon */}
      {isSuggested && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 10
        }}>
          <span style={{ fontSize: 20 }}>⭐</span>
        </div>
      )}

      {/* Logo/Image section */}
      <div style={{
        width: '100%',
        height: 80,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        border: '1px solid #f1f3f4'
      }}>
        {img ? (
          <img 
            src={img} 
            alt={booth.company?.[0]?.name || 'Booth'} 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain' 
            }} 
          />
        ) : (
          <span style={{ 
            fontSize: 32, 
            color: '#6B7280',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1
          }}>
            {booth.company?.[0]?.name?.charAt(0) || '🏪'}
          </span>
        )}
      </div>

      {/* Company name */}
      <div style={{ 
        marginBottom: 8, 
        textAlign: 'center' 
      }}>
        <h4 style={{ 
          margin: '0 0 4px', 
          fontSize: 14, 
          color: '#1E1F24',
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.2
        }}>
          {booth.company?.[0]?.name || 'Company Name'}
        </h4>
      </div>

      {/* Booth badge */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 10px',
          backgroundColor: `${zoneColor}15`,
          color: zoneColor,
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          border: `1px solid ${zoneColor}30`
        }}>
          {zone} {booth.booth_name || booth.booth_id || 'Booth'}
        </div>
      </div>
    </div>
  );
};

// Zone section component
const ZoneSection = ({ zone, booths, zoneColor, onBoothClick, visibleBooths, onShowMore, onShowLess, numberOfCard }) => {
  const boothsToShow = visibleBooths[zone] || numberOfCard;
  
  return (
    <div style={{
      marginTop: 24,
      padding: '20px 16px 20px',
      borderRadius: 20,
      backgroundColor: `${zoneColor}08`,
      border: `1px solid ${zoneColor}20`,
      marginHorizontal: 16
    }}>
      {/* Zone header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          margin: 0,
          fontSize: 22,
          color: zoneColor,
          fontWeight: 700,
          textAlign: 'center'
        }}>
          Zone {zone}
        </h3>
      </div>

      {/* Booths grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between'
      }}>
        {booths.slice(0, boothsToShow).map((booth, index) => (
          <BoothCard
            key={index}
            booth={booth}
            zone={zone}
            zoneColor={zoneColor}
            onClick={() => onBoothClick(booth)}
            isSuggested={false} // TODO: Implement suggestion logic
          />
        ))}
      </div>

      {/* Load more/less buttons */}
      {booths.length > boothsToShow ? (
        <button
          onClick={() => onShowMore(zone)}
          style={{
            width: '100%',
            height: 56,
            border: `1.5px solid ${zoneColor}`,
            borderRadius: 1000,
            backgroundColor: 'transparent',
            color: zoneColor,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 10
          }}
        >
          Load More
        </button>
      ) : (
        boothsToShow > 4 && (
          <button
            onClick={() => onShowLess(zone)}
            style={{
              width: '100%',
              height: 56,
              border: `1.5px solid ${zoneColor}`,
              borderRadius: 1000,
              backgroundColor: `${zoneColor}20`,
              color: zoneColor,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 10
            }}
          >
            Load Less
          </button>
        )
      )}
    </div>
  );
};

// Category section component
const CategorySection = ({ categories, onBoothClick, zoneData }) => {
  return (
    <div style={{ padding: '0 16px' }}>
      {categories.map((category, index) => (
        <div key={index} style={{
          marginBottom: 24,
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          overflow: 'hidden'
        }}>
          {/* Category header */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: 18,
              color: '#1E1F24',
              fontWeight: 600
            }}>
              {category.name}
            </h3>
          </div>

          {/* Booths in category */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
            padding: '16px'
          }}>
            {category.fulldata.map((booth, boothIndex) => (
              <div
                key={boothIndex}
                onClick={() => onBoothClick(booth)}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
                <div style={{
                  width: '100%',
                  height: 120,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  {booth.company?.[0]?.logo ? (
                    <img 
                      src={buildImg(booth.company[0].logo)} 
                      alt="Company Logo" 
                      style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} 
                    />
                  ) : (
                    <span style={{ fontSize: 32 }}>🏪</span>
                  )}
                </div>
                
                <h4 style={{
                  margin: '0 0 8px',
                  fontSize: 16,
                  color: '#1E1F24',
                  fontWeight: 600
                }}>
                  {booth.company?.[0]?.name || 'Company Name'}
                </h4>
                
                <p style={{
                  margin: '0 0 8px',
                  fontSize: 14,
                  color: '#6B7280'
                }}>
                  {booth.booth_name || 'Booth Name'}
                </p>
                
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500
                }}>
                  Zone {booth.zone || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Booths() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(0);
  const [search, setSearch] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [visibleBooths, setVisibleBooths] = useState({});
  const [isEnabled, setIsEnabled] = useState(0);
  
  // Data states
  const [showExhibitor, setShowExhibitor] = useState([]);
  const [boothNZone, setBoothNZone] = useState([]);
  const [categories, setCategories] = useState([]);

  const numberOfCard = 4; // Default number of cards to show initially

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get data from localStorage
         const userData = ''//await getUserData();
        const existingData = localStorage.getItem('homeData')
        if (existingData) {
          try {
            const userData = JSON.parse(existingData)
            if (userData) {
              setShowExhibitor(userData.show_exhibitor || []);
              setBoothNZone(userData.Booth_N_Zone || []);
              
              // Extract categories from exhibitor data
              const allCategories = [];
              userData.show_exhibitor?.forEach(booth => {
                if (booth.categories && Array.isArray(booth.categories)) {
                  booth.categories.forEach(cat => {
                    if (cat.name) {
                      const existingCategory = allCategories.find(c => c.name === cat.name);
                      if (existingCategory) {
                        existingCategory.fulldata.push(booth);
                      } else {
                        allCategories.push({
                          id: cat.id,
                          name: cat.name,
                          fulldata: [booth]
                        });
                      }
                    }
                  });
                }
              });
              
              setCategories(allCategories.sort((a, b) => a.name.localeCompare(b.name)));
            }
            
                         console.log('✅ Loaded existing data from localStorage:', userData)
          } catch (parseError) {
            console.warn('Could not parse existing data from localStorage:', parseError)
          }
        }
        
       
      } catch (error) {
        console.error('Error loading booth data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Group exhibitors by zone
  const groupedByZone = useMemo(() => {
    if (!showExhibitor.length) return [];

    // Group by zones
    let grouped = showExhibitor.reduce((acc, booth) => {
      const zone = booth.zone || 'Unknown';
      if (!acc[zone]) {
        acc[zone] = [];
      }
      acc[zone].push(booth);
      return acc;
    }, {});

    // Convert to array format
    let groupedArray = Object.entries(grouped).map(([zone, booths]) => ({
      zone,
      booths: booths.map(booth => ({ ...booth }))
    }));

    // Apply isEnabled filter (only booths with sample_ids)
    if (isEnabled) {
      groupedArray = groupedArray
        .map(group => ({
          ...group,
          booths: group.booths.filter(booth =>
            Array.isArray(booth?.company?.[0]?.sample_ids)
          )
        }))
        .filter(group => group.booths.length > 0);
    }

    // Apply search filter
    if (search && category === 0) {
      groupedArray = groupedArray.map(group => ({
        ...group,
        booths: group.booths.filter(booth =>
          booth?.booth_name?.toLowerCase().includes(search.toLowerCase()) ||
          booth?.company?.[0]?.name?.toLowerCase().includes(search.toLowerCase())
        )
      }));
    }

    return groupedArray.sort((a, b) => a.zone.localeCompare(b.zone));
  }, [showExhibitor, search, isEnabled, category]);

  // Filter categories data
  const filteredCategories = useMemo(() => {
    if (!categories.length) return [];

    let filtered = categories;

    // Apply isEnabled filter
    if (isEnabled) {
      filtered = filtered.map(cat => ({
        ...cat,
        fulldata: cat.fulldata.filter(booth =>
          Array.isArray(booth?.company?.[0]?.sample_ids)
        )
      })).filter(cat => cat.fulldata.length > 0);
    }

    // Apply search filter
    if (search && category === 1) {
      filtered = filtered.map(cat => ({
        ...cat,
        fulldata: cat.fulldata.filter(booth =>
          booth?.booth_name?.toLowerCase().includes(search.toLowerCase()) ||
          booth?.company?.[0]?.name?.toLowerCase().includes(search.toLowerCase())
        )
      }));
    }

    return filtered;
  }, [categories, search, isEnabled, category]);

  // Show more booths
  const showMoreBooths = (zone) => {
    setVisibleBooths(prev => ({
      ...prev,
      [zone]: (prev[zone] || numberOfCard) + 6
    }));
  };

  // Show less booths
  const showLessBooths = (zone) => {
    setVisibleBooths(prev => ({
      ...prev,
      [zone]: numberOfCard
    }));
  };

  // Handle booth click
  const handleBoothClick = (booth) => {
    navigate(`/booths/${booth.booth_id || booth.exhibitor_id}`, { 
      state: { 
        booth,
        zoneName: booth.zone,
        sampleIconShow: Array.isArray(booth?.company?.[0]?.sample_ids)
      } 
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading booths..." />;
  }

  return (
    <AppLayout>
      <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 16px 16px'
        }}>
          <h1 style={{ 
            margin: '0 0 16px', 
            fontSize: 24, 
            fontWeight: 600, 
            color: '#1E1F24',
            textAlign: 'center'
          }}>
            Booths
          </h1>

          {/* Categories */}
          <Categories category={category} setCategory={setCategory} />

          {/* Search */}
          <div style={{ marginTop: 25 }}>
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              alignItems: 'center' 
            }}>
              {/* Search Bar */}
              <div style={{ 
                position: 'relative', 
                flex: 1 
              }}>
                <input
                  type="text"
                  placeholder="Search booth name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setFocusedField('search')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    height: 56,
                    border: `1px solid ${focusedField === 'search' ? '#2a46a8' : '#e5e7eb'}`,
                    borderRadius: 32,
                    padding: '0 16px 0 45px',
                    fontSize: 16,
                    backgroundColor: focusedField === 'search' ? '#fff' : '#f8f9fa',
                    outline: 'none',
                    color: focusedField === 'search' || search.length > 0 ? '#2a46a8' : '#6B7280'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 20,
                  color: focusedField === 'search' ? '#2a46a8' : '#6B7280'
                }}>
                  🔍
                </span>
                {search.length > 0 && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: 20,
                      cursor: 'pointer',
                      color: '#6B7280'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                style={{
                  width: 50,
                  height: 56,
                  backgroundColor: '#2a46a8',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(42, 70, 168, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(42, 70, 168, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(42, 70, 168, 0.3)';
                }}
              >
                <span style={{
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: 600
                }}>
                  ⚙️
                </span>
              </button>
            </div>
          </div>

          {/* Free sample toggle */}
          {categories.some(cat => cat.fulldata.some(booth => 
            Array.isArray(booth?.company?.[0]?.sample_ids)
          )) && (
            <div style={{
              marginTop: 15,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#413C3A', fontSize: 16 }}>
                Free sample booths only
              </span>
              <button
                onClick={() => setIsEnabled(prev => prev ? 0 : 1)}
                style={{
                  width: 48,
                  height: 24,
                  backgroundColor: isEnabled ? '#2a46a8' : '#C4C3C2',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 2,
                  left: isEnabled ? 26 : 2,
                  transition: 'left 0.2s ease'
                }} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '0 16px 16px' }}>
          {category === 0 ? (
            // Zones view
            <>
              {search.length > 0 && groupedByZone.some(item => item.booths.length > 0) && (
                <div style={{
                  color: '#1E1F24',
                  fontSize: 20,
                  marginBottom: -20,
                  marginTop: 15,
                  fontWeight: 700
                }}>
                  {groupedByZone.filter(item => item.booths.length > 0).length} Results Found
                </div>
              )}

              {groupedByZone.map((item, index) => {
                if (item.booths.length === 0 || item.zone === 'null') {
                  return null;
                }

                const zoneColor = getZoneBackgroundColor(item.booths[0]?.booth_id, boothNZone);
                
                return (
                  <ZoneSection
                    key={index}
                    zone={item.zone}
                    booths={item.booths}
                    zoneColor={zoneColor}
                    onBoothClick={handleBoothClick}
                    visibleBooths={visibleBooths}
                    onShowMore={showMoreBooths}
                    onShowLess={showLessBooths}
                    numberOfCard={numberOfCard}
                  />
                );
              })}

              {groupedByZone.every(item => item.booths.length === 0) && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6B7280'
                }}>
                  <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
                  <h3 style={{ margin: '0 0 8px', color: '#1E1F24' }}>No booths found</h3>
                  <p style={{ margin: 0 }}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          ) : (
            // Categories view
            <CategorySection
              categories={filteredCategories}
              onBoothClick={handleBoothClick}
              zoneData={boothNZone}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
