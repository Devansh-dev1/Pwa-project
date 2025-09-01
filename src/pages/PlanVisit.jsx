import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import { fetchPersonalizedData } from '../api/auth.js';
import LoadingScreen from '../components/LoadingScreen.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { imagesURL } from '../api/index.js';
import { useGetPearksData } from '../utils/index.js';
import moment from 'moment';
import { getStoredHomeData } from '../api/home.js';

// EXACT MOBILE APP CONSTANTS - Direct from GlobalStyles
const Padding = {
  p_9xs: 4,
  p_mini: 15,
  p_lg: 18,
  p_16xl: 35,
  p_6xl: 25,
  p_base: 16,
  p_xs: 12,
  p_3xs: 10,
};

const Border = {
  br_81xl: 100,
  br_981xl: 1000,
  br_8xl: 27,
  br_lg: 18,
  br_5xl: 24,
  br_mid: 17,
  br_xs: 12,
  br_21xl: 20,
};

const FontSize = {
  labelLg_size: 16,
  textXl_size: 20,
  paragraphSm_size: 13,
  textXs_size: 11,
  paragraphXs_size: 12,
};

const FontFamily = {
  textSm: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
  textXs: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
  textXxs: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
  paragraphSm: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
  paragraphXs: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
  labelLg: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
  textMd: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
  textXl: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
};

const Color = {
  oslerGrayWhite: '#ffffff',
  solidsDenimDenim50: '#e9ecf7',
  solidsDenimDenim500: '#2A46A8',
  solidsDenimDenim300: '#7083c5',
  solidsDenimDenim400: '#556bb9',
  solidsDenimDenim200: '#a8b4d9',
  solidsBlackBlack50: '#f8f9fa',
  solidsBlackBlack100: '#c4c3c2',
  solidsBlackBlack200: '#a8a5a4',
  solidsBlackBlack400: '#807c7b',
  solidsBlackBlack500: '#413c3a',
  solidsFrenchPinkFrenchPink600: '#e86488',
  colorDarkslateblue: '#2a46a8',
  solidsTurqoiseTurqoise400: '#00b4a6',
  solidsTurqoiseTurqoise50: '#eff7f7',
};

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

// Categories component for PlanVisit
const PlanVisitCategories = ({ category, setCategory, addedMyDay, setAddedMyDay, setopenSignUp11 }) => (
  <div style={{
    backgroundColor: Color.solidsDenimDenim50,
    padding: 4,
    borderRadius: Border.br_81xl,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch'
  }}>
    <button
      onClick={() => setCategory(0)}
      style={{
        flex: 1,
        paddingVertical: Padding.p_lg,
        borderRadius: Border.br_981xl,
        paddingHorizontal: 36,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        background: category === 0 ? Color.solidsDenimDenim500 : 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <span style={{
        color: category === 0 ? Color.oslerGrayWhite : Color.solidsDenimDenim300,
        fontSize: FontSize.labelLg_size,
        fontFamily: FontFamily.textSm
      }}>
        List
      </span>
    </button>
    <button
      onClick={() => setCategory(1)}
      style={{
        flex: 1,
        paddingVertical: Padding.p_lg,
        borderRadius: Border.br_981xl,
        paddingHorizontal: 36,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        background: category === 1 ? Color.solidsDenimDenim500 : 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <span style={{
        color: category === 1 ? Color.oslerGrayWhite : Color.solidsDenimDenim300,
        fontSize: FontSize.labelLg_size,
        fontFamily: FontFamily.textSm
      }}>
        My Day
      </span>
    </button>
  </div>
);

// Booth card component
const BoothCard = ({ booth, zone, zoneColor, onClick, isSuggested, onThreeDotClick }) => {
  // const img = buildImg(booth.exhibitor_image || booth.company?.[0]?.logo);
  console.log('booth.company?.[0]?.logo',booth);
  
  return (
    <div
      onClick={onClick}
      style={{
        padding: Padding.p_mini,
        marginBottom: 10,
        overflow: 'hidden',
        borderColor: Color.solidsDenimDenim200,
        borderRadius: Border.br_5xl,
        alignSelf: 'stretch',
        backgroundColor: Color.oslerGrayWhite,
        border: `1.5px solid ${isSuggested ? '#CE8AEE' : Color.solidsDenimDenim200}`,
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
      {/* Suggestion icon */}
      {isSuggested && (
        <div style={{
          position: 'absolute',
          top: -5,
          left: 72,
          zIndex: 10
        }}>
          <span style={{ fontSize: 24 }}>⭐</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
        {/* Image section */}
        <div style={{
          width: 110,
          borderRadius: 12,
          overflow: 'hidden',
          aspectRatio: '3/2',
          alignSelf: 'center',
          justifyContent: 'space-between'
        }}>
          {booth.company_logo ? (
            <img 
              // src={img} 
              src={`${imagesURL}${booth?.company_logo}/public`}
              // src={buildImg(booth.exhibitor_image || booth.company?.[0]?.logo)}
              alt={booth.company?.[0]?.name || 'Booth'} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          ) : (
            <span style={{ fontSize: 40 }}>🏪</span>
          )}
        </div>

        {/* Content section */}
        <div style={{ marginLeft: 7, flex: 1 }}>
          <div style={{ flex: 1 }}>
            <h4 style={{
              color: Color.solidsBlackBlack500,
              letterSpacing: -0.1,
              marginBottom: 10,
              fontSize: FontSize.labelLg_size,
              fontFamily: FontFamily.textXs,
              margin: '0 0 10px'
            }}>
              {booth.company_name || 'Company Name'}
            </h4>
            
            {/* Zone badge */}
            <div style={{
              display: 'inline-block',
              padding: '4px 8px',
              backgroundColor: `${zoneColor}20`,
              color: zoneColor,
              borderRadius: 12,
              fontSize: FontSize.textXs_size,
              fontWeight: 600
            }}>
              {booth.booth_name} - Zone {zone}
            </div>
          </div>
        </div>

        {/* Three dot menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onThreeDotClick(booth);
          }}
          style={{
            borderRadius: 12,
            backgroundColor: '#fff',
            border: '1.5px solid #C4C3C2',
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            // border: 'none'
          }}
        >
          <span style={{ fontSize: 16 , color: '#1E1F24'}}>⋯</span>
        </button>
      </div>
    </div>
  );
};

// EXACT MOBILE APP STYLES - Direct copy from PlanVisitList.js
const styles = {
  planVisitfirstTime: {
    width: '100%',
    paddingTop: Padding.p_mini,
    paddingBottom: Padding.p_mini,
    alignItems: 'center',
    minHeight: '100%',
    backgroundColor: Color.oslerGrayWhite,
    display: 'flex',
    flexDirection: 'column',
  },
  outer: {
    paddingBottom: Padding.p_16xl,
    flex: 1,
    width: '100%',
  },
  outerSpaceBlock: {
    paddingHorizontal: Padding.p_mini,
    alignSelf: 'stretch',
  },
  top: {
    alignSelf: 'stretch',
  },
  tabs: {
    backgroundColor: Color.solidsDenimDenim50,
    padding: Padding.p_9xs,
    borderRadius: Border.br_81xl,
    flexDirection: 'row',
    alignSelf: 'stretch',
    display: 'flex',
  },
  buttonFlexBox: {
    paddingVertical: Padding.p_lg,
    borderRadius: Border.br_981xl,
    paddingHorizontal: 32, // More padding for better mobile look
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
  },
  button: {
    backgroundColor: Color.solidsDenimDenim500,
  },
  button1: {
    marginLeft: 4,
    backgroundColor: 'transparent', // Ensure no background
    border: 'none',
    outline: 'none'
  },
  text: {
    color: Color.oslerGrayWhite,
  },
  text1: {
    color: Color.solidsDenimDenim300,
  },
  textTypo: {
    fontSize: FontSize.labelLg_size,
    textAlign: 'center',
    fontFamily: FontFamily.textXs,
    fontWeight: 700,
  },
  topNav: {
    paddingBottom: Padding.p_6xl,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingHorizontal: Padding.p_mini,
    alignSelf: 'stretch',
  },
  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 50,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.solidsBlackBlack50,
    cursor: 'pointer',
  },
  // NoMyDay container styles
  noMyDayContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    textAlign: 'center',
    width: '100%', // Fill container width
    maxWidth: '100%', // Never exceed
    overflow: 'hidden', // Prevent content overflow
    boxSizing: 'border-box',
  },
  graphicContainer: {
    width: '100%',
    maxWidth: 315, // Don't exceed original mobile size
    height: 248,
    marginBottom: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  graphic: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    objectFit: 'contain', // Maintain aspect ratio within bounds
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.textXxs,
    color: Color.solidsBlackBlack500,
    fontWeight: 900,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: FontFamily.paragraphSm,
    color: Color.solidsBlackBlack400,
    lineHeight: 1.5,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 320,
  },
  browseButton: {
    borderRadius: Border.br_981xl,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: Color.solidsDenimDenim400,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 280,
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  browseButtonText: {
    color: Color.solidsDenimDenim400,
    fontSize: FontSize.labelLg_size,
    fontFamily: FontFamily.textSm,
    fontWeight: 700,
    textAlign: 'center',
  },
};

// Categories component - EXACT mobile replica from Tab.js
const Categories = ({ category, setCategory, addedMyDay = false, setAddedMyDay = () => {} }) => {
  const categories = [
    { id: 1, label: 'My Day' },
    { id: 0, label: 'List' },
  ];

  return (
    <div style={styles.tabs}>
      {categories.map(({ id, label }) => (
        <button
          key={id}
          style={{
            ...styles.buttonFlexBox,
            ...(category === id ? styles.button : styles.button1),
          }}
          onClick={() => setCategory(id)}
        >
          <span
            style={{
              ...styles.textTypo,
              ...(category === id ? styles.text : styles.text1),
            }}
          >
            {label}
          </span>

          {id === 1 && addedMyDay && category === 0 && (
            <div style={{
              backgroundColor: Color.solidsFrenchPinkFrenchPink600,
              width: 22,
              height: 22,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              display: 'flex',
              marginLeft: 5,
            }}>
              <span style={{
                fontSize: 12,
                fontFamily: FontFamily.textXxs,
                color: Color.oslerGrayWhite,
                fontWeight: 900,
              }}>
                +1
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

// CustomHeader component - EXACT mobile replica
const CustomHeader = () => {
  const navigate = useNavigate();
  const { userInfo } = useStore();
  const email = userInfo?.email;

  return (
    <div style={styles.topNav}>
      <button
        onClick={() => {
          if (email === 'unknown@dev.familyone.io') {
            console.log('Guest user - would show signup modal');
          } else {
            navigate('/profile');
          }
        }}
        style={styles.settingsIcon}
      >
        {email === 'unknown@dev.familyone.io' ? (
          <img
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
            }}
            src="/assets/profile-pic.png"
            alt="Profile"
          />
        ) : userInfo?.meta_data?.profile_image ? (
          <img
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
            }}
            src={`https://profileimageurl/${userInfo.meta_data.profile_image}`}
            alt="Profile"
          />
        ) : (
          <span
            style={{
              fontFamily: FontFamily.labelLg,
              color: Color.solidsBlackBlack500,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {userInfo?.first_name?.charAt(0)?.toUpperCase()}
            {userInfo?.last_name?.charAt(0)?.toUpperCase() ?? ''}
          </span>
        )}
      </button>
    </div>
  );
};

// NoMyDay component - EXACT mobile replica with original graphic
const NoMyDay = ({ onPress }) => {
  return (
    <div style={styles.noMyDayContainer}>
      <div style={styles.graphicContainer}>
        <img
          src="/assets/Graphic.svg"
          alt="Plan your day illustration"
          style={styles.graphic}
        />
      </div>
      
      <h1 style={styles.title}>
        Let's build your day!
      </h1>
      
      <p style={styles.description}>
        Add booths, sessions, and samples you don't want to miss. 
        Everything you pick will show up right here easy to plan, 
        easier to enjoy.
      </p>
      
      <button
        onClick={onPress}
        style={styles.browseButton}
      >
        <span style={styles.browseButtonText}>
          Browse All & Add to My Day
        </span>
      </button>
    </div>
  );
};

// SearchPlay component - EXACT mobile replica
const SearchPlay = ({ searchValues, setSearchValues, setSearch, search, setFocusedField, focusedField }) => {
  const searchStyles = {
    container: {
      width: '100%',
      marginTop: 25,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputContainer: {
      width: '100%',
      position: 'relative',
    },
    input: {
      fontSize: FontSize.labelLg_size,
      fontFamily: FontFamily.paragraphSm,
      color: Color.colorDarkslateblue,
      width: '100%',
      minHeight: 56,
      borderRadius: Border.br_8xl,
      paddingHorizontal: 12,
      paddingLeft: 45,
      border: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      borderWidth: focusedField === 'search' ? 1 : 0,
      borderStyle: 'solid',
      borderColor: focusedField === 'search' ? Color.solidsDenimDenim500 : Color.solidsBlackBlack200,
      backgroundColor: focusedField === 'search' ? Color.oslerGrayWhite : Color.solidsBlackBlack50,
    },
    searchIcon: {
      width: 24,
      height: 24,
      position: 'absolute',
      top: 18,
      left: 15,
    },
    clearButton: {
      position: 'absolute',
      top: 18,
      right: 15,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    clearIcon: {
      width: 24,
      height: 24,
    },
  };

  return (
    <div style={searchStyles.container}>
      <div style={searchStyles.inputContainer}>
        <input
          style={searchStyles.input}
          placeholder="Search booths, sample etc."
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearchValues(val.trim().toLowerCase());
            setSearch(val);
          }}
          onFocus={() => setFocusedField('search')}
          onBlur={() => setFocusedField(null)}
        />

        <img
          style={searchStyles.searchIcon}
          src="/assets/iconsearch.png"
          alt="Search"
        />
        
        {searchValues.length > 0 && (
          <button
            style={searchStyles.clearButton}
            onClick={() => {
              setSearchValues('');
              setSearch('');
            }}
          >
            <img
              style={searchStyles.clearIcon}
              src="/assets/Cross.png"
              alt="Clear"
            />
          </button>
        )}
      </div>
    </div>
  );
};

// Main PlanVisit component - EXACT mobile structure
const PlanVisitFirstTime = () => {
  const navigate = useNavigate();
  const { userInfo, myDayData, setMyDayData } = useStore();
  
  const [category, setCategory] = useState(1); 
  const [searchValues, setSearchValues] = useState('');
  const [search, setSearch] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [boothData, setBoothData] = useState([]);
  const [seminarData, setSeminarData] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  const [addedMyDay, setAddedMyDay] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [loading, setLoading] = useState(true);

  const email = userInfo?.email;

  // EXACT mobile app API calls
  const suggestionsData = async () => {
    try {
      let boothIds = useStore.getState().boothIds;
      const res = await fetchPersonalizedData(userInfo?.auto_id, 'Booth', boothIds ? boothIds : '', 20);
      let BoothId = res?.map(item => item.itemId) || [];
      // setBoothData(BoothId);
    } catch (error) {
      console.error('Error fetching booth suggestions:', error);
    }
  };

  const suggestionsSeminarData = async () => {
    try {
      const res = await fetchPersonalizedData(userInfo?.auto_id, 'Seminar');
      let BoothId = res?.map(item => item.itemId) || [];
      // setSeminarData(BoothId);
    } catch (error) {
      console.error('Error fetching seminar suggestions:', error);
    }
  };

  const suggestionsSampleData = async () => {
    try {
      const res = await fetchPersonalizedData(userInfo?.auto_id, 'Sample');
      let BoothId = res?.map(item => item.itemId) || [];
      setSampleData(BoothId);
    } catch (error) {
      console.error('Error fetching sample suggestions:', error);
    }
  };

  // EXACT mobile useFocusEffect equivalent
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userData = await getStoredHomeData()
        if (userData) {
          try {
            setAlldata(userData);
            // const userData = JSON.parse(existingData)
            setBoothData(userData.show_exhibitor || []);
            setSeminarData(userData.seminars || []);
            setSampleData(userData.samples || []);
          } catch (error) {
            console.error('Error parsing homeData:', error);
          }
        }
    
        
        if (userInfo?.auto_id && email !== 'unknown@dev.familyone.io') {
          await Promise.all([
            suggestionsData(),
            suggestionsSeminarData(),
            suggestionsSampleData()
          ]);
        }
      } catch (error) {
        console.error('Error loading Plan Visit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userInfo?.auto_id, myDayData]);

  if (loading) {
    return <LoadingScreen message="Loading your plan..." />;
  }

  return (
    <div style={{
      ...styles.planVisitfirstTime,
      width: '100%', // Fill container width exactly
      height: '100%', // Fill container height exactly  
      maxWidth: '100%', // Never exceed container
      maxHeight: '100%', // Never exceed container
      overflow: 'hidden', // Prevent content from breaking layout
    }}>
      <CustomHeader />
      <div style={{
        ...styles.outer, 
        ...styles.outerSpaceBlock,
        width: '100%', // Fill available width
        maxWidth: '100%', // Never exceed
        overflow: 'hidden', // Prevent layout breaks
      }}>
        <div style={styles.top}>
          <Categories
            setCategory={(val) => { 
              setCategory(val); 
              setSearch(''); 
              setSearchValues(''); 
              setFocusedField(''); 
            }}
            category={category}
            addedMyDay={addedMyDay}
            setAddedMyDay={setAddedMyDay}
          />
        </div>
        
        {category === 1 ? (
          myDayData && myDayData.length > 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 20,
            }}>
              <h2 style={{
                fontSize: FontSize.textXl_size,
                fontFamily: FontFamily.textXxs,
                color: Color.solidsBlackBlack500,
                textAlign: 'left',
                margin: '0 0 8px',
                fontWeight: 900,
              }}>
                My Day Schedule
              </h2>
              <p style={{
                fontSize: FontSize.paragraphXs_size,
                fontFamily: FontFamily.paragraphXs,
                color: Color.solidsBlackBlack200,
                textAlign: 'left',
                margin: 0,
              }}>
                Your personalized event schedule
              </p>
            </div>
          ) : (
            <NoMyDay onPress={() => setCategory(0)} />
          )
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <SearchPlay
              searchValues={searchValues}
              setSearchValues={setSearchValues}
              setSearch={setSearch}
              search={search}
              setFocusedField={setFocusedField}
              focusedField={focusedField}
            />

            {/* Smart Suggestions */}
            {!(email === 'unknown@dev.familyone.io') && 
             (boothData?.length > 0 || seminarData?.length > 0 || sampleData?.length > 0) && 
             !searchLoader && (
              <div style={{
                borderRadius: 15,
                borderWidth: 1.5,
                borderColor: '#CE8AEE',
                borderStyle: 'solid',
                padding: 15,
                marginTop: 15,
                backgroundColor: '#F4EEFC',
              }}>
                <div style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  display: 'flex',
                }}>
                  <img
                    style={{
                      width: 24,
                      height: 24,
                    }}
                    src="/assets/start.png"
                    alt="Smart Suggestions"
                  />
                  <span style={{
                    color: '#9458E2',
                    fontSize: 14,
                    fontFamily: FontFamily.textSm,
                    fontWeight: 700,
                  }}>
                    Smart Suggestions
                  </span>
                </div>
                <p style={{
                  color: 'rgba(148, 88, 226, 0.58)',
                  marginTop: 3,
                  fontSize: 12,
                  fontFamily: FontFamily.paragraphSm,
                  fontWeight: 600,
                  margin: '3px 0 0',
                }}>
                  Items with having this icon are suggested by AI on the bases
                  of similar attendees like you and their actions.
                </p>
              </div>
            )}

            {/* Loading State */}
            {searchLoader && (
              <div style={{ 
                flex: 1, 
                marginBottom: 70, 
                marginTop: 20,
                textAlign: 'center',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  border: '4px solid #E6E9FA',
                  borderTop: '4px solid #2a46a8',
                  borderRadius: '50%',
                  margin: '20px auto',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ 
                  color: Color.solidsBlackBlack400, 
                  fontSize: 14,
                  fontFamily: FontFamily.paragraphSm,
                }}>
                  Searching...
                </p>
              </div>
            )}

            {/* Placeholder content for List view */}
            <div style={{
              marginTop: 15,
              alignSelf: 'stretch',
            }}>
              <div style={{
                marginBottom: 15,
              }}>
                <p style={{
                  fontFamily: FontFamily.paragraphXs,
                  fontSize: FontSize.paragraphXs_size,
                  color: Color.solidsBlackBlack200,
                  textAlign: 'left',
                  margin: 0,
                }}>
                  Explore exhibitor booths and displays
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PlanVisit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(0);
  const [listCategory, setListCategory] = useState('All');
  const [searchValues, setSearchValues] = useState('');
  const [search, setSearch] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [selectZonenames, setSelectZonenames] = useState([]);
  const [boothData, setBoothData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [diselectedItem, setDiselectedItem] = useState([]);
  const [isHiddenArray, setIsHiddenArray] = useState([]);
  const [isSelectedSamples, setSelectedSamples] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [botamSheetOpen, setBotamSheetOpen] = useState(false);
  const [bothamSheetData, setBothamSheetData] = useState({});
  const [addMyDayItem, setAddMyDayItem] = useState([]);
  const [myDayOpenModel, setMyDayOpenModel] = useState(false);
  const [addedMyDay, setAddedMyDay] = useState(false);
  const [openSignUp1, setopenSignUp11] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);

  // Data states
  const [showExhibitor, setShowExhibitor] = useState([]);
  const [boothNZone, setBoothNZone] = useState([]);
  const [categories, setCategories] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [samples, setSamples] = useState([]);
  const [visibleSeminars, setVisibleSeminars] = useState(3);
  const [visibleSamples, setVisibleSamples] = useState(3);

  const { myDayData, setMyDayData, userInfo } = useStore();
  const { email } = userInfo || {};

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get data from localStorage
        const existingData = localStorage.getItem('homeData');
        if (existingData) {
          try {
            const userData = JSON.parse(existingData);
            if (userData) {
              setShowExhibitor(userData.show_exhibitor || []);
              setBoothNZone(userData.Booth_N_Zone || []);
              setSeminars(userData.seminars || userData.Seminars || []);
              setSamples(userData.sample || userData.samples || []);
              
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
          } catch (parseError) {
            console.warn('Could not parse existing data from localStorage:', parseError);
          }
        }
      } catch (error) {
        console.error('Error loading plan visit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Also mirror mobile hook source of truth so seminars render even if storage keys differ
  // const parksdata = useGetPearksData();
  const perkDAtasho=async () => {
    const parksdata = await getStoredHomeData();
    if ((!seminars || seminars.length === 0) && parksdata?.seminars?.length) {
      setSeminars(parksdata.seminars);
    }
    if ((!samples || samples.length === 0) && parksdata?.sample?.length) {
      setSamples(parksdata.sample);
    }
    if ((!showExhibitor || showExhibitor.length === 0) && parksdata?.show_exhibitor?.length) {
      setShowExhibitor(parksdata.show_exhibitor);
    }
    if ((!boothNZone || boothNZone.length === 0) && parksdata?.Booth_N_Zone?.length) {
      setBoothNZone(parksdata.Booth_N_Zone);
    }

    
  }
  useEffect(() => {
    // prefer loaded state; if empty, hydrate from hook
    perkDAtasho();
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

    // Apply search filter
    if (searchValues) {
      groupedArray = groupedArray.filter(group =>
        searchValues.includes(group.zone)
      );
    }

    return groupedArray.sort((a, b) => a.zone.localeCompare(b.zone));
  }, [showExhibitor, searchValues]);

  // Filter booths data
  const finalBoothsData = useMemo(() => {
    if (!boothNZone.length) return [];

    const filteredData = boothNZone.filter((data) => {
      // Check zone match
      const isZoneMatch =
        selectZonenames.length === 0 || selectZonenames.includes(data?.zone);

      // Check search values
      const isSearchMatch =
        !searchValues ||
        data?.booth_name?.includes(searchValues) ||
        data?.company_name?.toLowerCase().includes(searchValues);

      // Check deselected items
      const isNotDeselected = !diselectedItem?.includes(data?.id);

      // Check if the booth is not in "My Day" data
      const isNotMyDay = !myDayData?.includes(data?.id);

      return isZoneMatch && isSearchMatch && isNotDeselected && isNotMyDay;
    });

    // Separate suggested and non-suggested booths
    const suggestedBooths = [];
    const nonSuggestedBooths = [];

    filteredData.forEach((data) => {
      if (boothData.includes(data?.exhibitor?.booth_id)) {
        suggestedBooths.push(data);
      } else {
        nonSuggestedBooths.push(data);
      }
    });

    // Sort suggested booths according to boothData order
    const sortedSuggestedBooths = suggestedBooths.sort((a, b) => {
      const aIndex = boothData.indexOf(a?.exhibitor?.booth_id);
      const bIndex = boothData.indexOf(b?.exhibitor?.booth_id);
      return aIndex - bIndex;
    });

    // Sort non-suggested booths by other criteria
    const sortedNonSuggestedBooths = nonSuggestedBooths.sort((a, b) => {
      // Sort by zone name (case-insensitive)
      const zoneComparison = (a.zone || '').toLowerCase().localeCompare((b.zone || '').toLowerCase());
      if (zoneComparison !== 0) return zoneComparison;
      
      // Sort by company name (case-insensitive)
      return (a.company_name || '').toLowerCase().localeCompare((b.company_name || '').toLowerCase());
    });

    return [...sortedSuggestedBooths, ...sortedNonSuggestedBooths];
  }, [boothNZone, selectZonenames, searchValues, diselectedItem, myDayData, boothData]);

  const displayedBooths = finalBoothsData.slice(0, visibleCount);

  // Filter seminars and samples similar to mobile
  const finalSeminarsData = useMemo(() => {
    let list = seminars || [];
    if (!list?.length) return [];
    if (searchValues) {
      const q = searchValues.toLowerCase();
      list = list.filter(item =>
        item?.title?.toLowerCase()?.includes(q) ||
        item?.speaker?.toLowerCase?.()?.includes(q)
      );
    }
    return list;
  }, [seminars, searchValues]);

  const finalSamplesData = useMemo(() => {
    let list = samples || [];
    if (!list?.length) return [];
    if (searchValues) {
      const q = searchValues.toLowerCase();
      list = list.filter(item =>
        item?.title?.toLowerCase()?.includes(q) ||
        item?.company_name?.toLowerCase?.()?.includes(q)
      );
    }
    return list;
  }, [samples, searchValues]);

  // Show more booths
  const handleViewMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, finalBoothsData.length));
  };

  // Show less booths
  const handleViewLess = () => {
    setVisibleCount(4);
  };

  // Handle booth click
  const handleBoothClick = (booth) => {
    console.log('booth-->',booth?.company_id    );
    let exhibitorId = showExhibitor?.find(item=>item?.company?.[0]?.company_id == booth?.company_id)
    console.log('exhibitorId-->',exhibitorId);
    navigate(`/booths/${exhibitorId?.exhibitor_id}`, { 
      state: { 
        booth,
        zoneName: booth.zone,
        sampleIconShow: Array.isArray(booth?.company?.[0]?.sample_ids)
      } 
    });
  };

  // Helpers for seminar/sample display
  const formatDateTime = (val) => {
    if (!val) return '';
    const m = moment(val);
    if (!m.isValid()) return '';
    return m.format('MMM D, h:mm A');
  };

  const parseSeminarTimes = (item) => {
    // Derive date and hours as shown in mobile
    let dateSource = item?.seminar_date || item?.date || item?.start_time || item?.end_time;
    let dateText = '';
    if (dateSource) {
      const d = moment(dateSource);
      if (d.isValid()) {
        dateText = d.format('DD MMM YYYY');
      }
    }

    const parseTime = (t) => {
      if (!t) return '';
      const iso = moment(t);
      if (iso.isValid()) return iso.format('HH:mm');
      const hm = moment(t, ['HH:mm', 'H:mm', 'hh:mm A'], true);
      if (hm.isValid()) return hm.format('HH:mm');
      return '';
    };

    const startH = parseTime(item?.start_time);
    const endH = parseTime(item?.end_time);
    const hoursText = startH && endH ? `${startH} - ${endH}` : '';

    return { dateText, hoursText };
  };

  // View more/less handlers for seminars and samples
  const handleSeminarMore = () => setVisibleSeminars(prev => Math.min(prev + 3, finalSeminarsData.length));
  const handleSeminarLess = () => setVisibleSeminars(3);
  const handleSampleMore = () => setVisibleSamples(prev => Math.min(prev + 3, finalSamplesData.length));
  const handleSampleLess = () => setVisibleSamples(3);

  // Handle three dot menu click
  const handleThreeDotClick = (booth) => {
    setBothamSheetData(booth);
    setBotamSheetOpen(true);
  };

  if (loading) {
    return <LoadingScreen message="Loading plan visit..." />;
  }

  return (
    <AppLayout>
      <div style={{ backgroundColor: Color.oslerGrayWhite, minHeight: '100vh' }}>
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
            Plan Your Visit
          </h1>

          {/* Categories */}
          <PlanVisitCategories 
            category={category} 
            setCategory={setCategory} 
            addedMyDay={addedMyDay} 
            setAddedMyDay={setAddedMyDay} 
            setopenSignUp11={setopenSignUp11} 
          />
        </div>

        {/* Content */}
        <div style={{ padding: '0 16px 16px' }}>
          {category === 0 ? (
            <>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                {[
                  { name: 'All', values: finalBoothsData.length + finalSeminarsData.length + finalSamplesData.length },
                  { name: 'Booths', values: finalBoothsData.length },
                  { name: 'Seminars', values: finalSeminarsData.length },
                  ...(samples?.length > 0 ? [{ name: 'Samples', values: finalSamplesData.length }] : []),
                ].map(tab => (
                  <button
                    key={tab.name}
                    onClick={() => setListCategory(tab.name)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 22,
                      border: listCategory === tab.name ? '1.5px solid #2A46A8' : '1.5px solid #E6E9FA',
                      backgroundColor: listCategory === tab.name ? '#2A46A8' : '#F0F2FA',
                      color: listCategory === tab.name ? '#fff' : '#556bb9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{tab.name}</span>
                    <span style={{
                      padding: '2px 8px',
                      background: '#fff',
                      color: '#2A46A8',
                      borderRadius: 14,
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>{tab.values}</span>
                  </button>
                ))}
              </div>
              {/* Smart Suggestions */}
              {!(email === 'unknown@dev.familyone.io') && 
               (finalBoothsData?.length > 0 || seminars?.length > 0 || samples?.length > 0) && 
               !searchLoader && (
                <div style={{
                  borderRadius: 15,
                  border: '1.5px solid #CE8AEE',
                  padding: 15,
                  marginTop: 15,
                  backgroundColor: '#F4EEFC',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                    <span style={{ fontSize: 24 }}>⭐</span>
                    <span style={{
                      color: '#9458E2',
                      fontSize: 14,
                      fontWeight: 600,
                    }}>
                      Smart Suggestions
                    </span>
                  </div>
                  <p style={{
                    color: '#9458E295',
                    marginTop: 3,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    Items with having this icon are suggested by AI on the bases
                    of similar attendees like you and their actions.
                  </p>
                </div>
              )}

              {/* Booths Section */}
              {['All', 'Booths'].includes(listCategory) && finalBoothsData?.length > 0 && (
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginBottom: 15 }}>
                    <h3 style={{
                      margin: '0 0 8px',
                      fontSize: 20,
                      color: '#1E1F24',
                      fontWeight: 600
                    }}>
                      Booths
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#6B7280'
                    }}>
                      Explore exhibitor booths and discover new products
                    </p>
                  </div>

                  {/* Booths List */}
                  <div>
                    {displayedBooths.map((booth, index) => {
                      const isSuggested = boothData.slice(0, 5).includes(booth?.exhibitor?.booth_id);
                      const zoneColor = getZoneBackgroundColor(booth?.id, boothNZone);
                      if(!booth.company_name) return null;
                      
                      return (
                        <BoothCard
                          key={booth?.id?.toString() || index}
                          booth={booth}
                          zone={booth.zone}
                          zoneColor={zoneColor}
                          onClick={() => handleBoothClick(booth)}
                          isSuggested={isSuggested}
                          onThreeDotClick={handleThreeDotClick}
                        />
                      );
                    })}
                  </div>

                  {/* View More/Less */}
                  {finalBoothsData?.length > 4 && (
                    <button
                      onClick={visibleCount < finalBoothsData?.length ? handleViewMore : handleViewLess}
                      style={{
                        width: '100%',
                        height: 56,
                        border: `1.5px solid ${Color.solidsDenimDenim400}`,
                        borderRadius: 1000,
                        backgroundColor: 'transparent',
                        color: Color.solidsDenimDenim400,
                        fontSize: 18,
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: 15
                      }}
                    >
                      {visibleCount < finalBoothsData?.length ? 'View More' : 'View Less'}
                    </button>
                  )}
                </div>
              )}

              {/* Seminars Section */}
              {['All', 'Seminars'].includes(listCategory) && finalSeminarsData?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ marginBottom: 15 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#1E1F24', fontWeight: 600 }}>Seminars</h3>
                    <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>Discover sessions and talks</p>
                  </div>

                  <div>
                    {finalSeminarsData.slice(0, visibleSeminars).map((item, index) => {
                      const { dateText, hoursText } = parseSeminarTimes(item);
                      // booth and zone via booth_stage_id like mobile
                      const booth = boothNZone?.find(b => String(b?.id) === String(item?.booth_stage_id));
                      const zoneColor = booth?.zone_color ? booth.zone_color : '#A6B3DA';
                      const zoneName = booth?.zone || '';
                      const boothName = booth?.booth_name || '';
                      const img = Array.isArray(item?.seminar_img) && item.seminar_img[0]
                        ? `${imagesURL}${item.seminar_img[0]}/public`
                        : null;

                      return (
                        <div key={item?.seminar_id?.toString() || index} style={{
                          padding: 15,
                          marginBottom: 10,
                          borderRadius: 24,
                          border: `1.5px solid ${zoneColor}55`,
                          backgroundColor: '#fff'
                        }} onClick ={()=> navigate(`/seminars/${item?.seminar_id}`, { state: { item } })}
                        >
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: 72, height: 56, borderRadius: 12, overflow: 'hidden', background: '#f8f9fa' }}>
                              {img ? (
                                <img src={img} alt={item?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗓️</div>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, color: '#1E1F24' }}>{item?.title}</h4>
                              {/* Zone badge like mobile */}
                              {(zoneName || boothName) && (
                                <div style={{
                                  display: 'inline-block', padding: '2px 8px', marginTop: 6,
                                  backgroundColor: `${zoneColor}20`, color: zoneColor, borderRadius: 12, fontSize: 12, fontWeight: 700
                                }}>
                                  {boothName} {zoneName && `• ${zoneName}`}
                                </div>
                              )}
                            </div>
                            <button 
        onClick={(e) => {
        }} 
        style={{
          border: '1.5px solid #C4C3C2',
          background: '#fff',
          borderRadius: 12,
          width: 36,
          height: 36,
          cursor: 'pointer',
          color: '#1E1F24',
          fontSize: 18
        }}
      >
        ⋯
      </button>
                          </div>

                          <div style={{
                            display: 'flex',
                            gap: 12,
                            marginTop: 12,
                            background: '#F7F9FF',
                            border: `1.5px solid ${zoneColor}40`,
                            borderRadius: 17,
                            padding: '10px 15px'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Date</div>
                              <div style={{ fontWeight: 700, color: '#1E1F24' }}>{dateText}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Hours</div>
                              <div style={{ fontWeight: 700, color: '#1E1F24' }}>{hoursText}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {finalSeminarsData.length > 3 && (
                    <button
                      onClick={visibleSeminars < finalSeminarsData.length ? handleSeminarMore : handleSeminarLess}
                      style={{
                        width: '100%', height: 56, border: '1.5px solid #556bb9', borderRadius: 1000,
                        backgroundColor: 'transparent', color: '#556bb9', fontSize: 18, fontWeight: 700, cursor: 'pointer', marginTop: 15
                      }}
                    >
                      {visibleSeminars < finalSeminarsData.length ? 'View More' : 'View Less'}
                    </button>
                  )}
                </div>
              )}

              {/* Samples Section */}
              {['All', 'Samples'].includes(listCategory) && finalSamplesData?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ marginBottom: 15 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#1E1F24', fontWeight: 600 }}>Samples</h3>
                    <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>Taste and try samples available at booths</p>
                  </div>

                  <div>
                    {finalSamplesData.slice(0, visibleSamples).map((item, index) => {
                      const img = item?.sample_image ? `${imagesURL}${item.sample_image}/public` : null;
                      const start = item?.sample_start || item?.starttime || item?.create_at;
                      const end = item?.sample_end || item?.endtime || item?.update_at;
                      const startTime = start ? formatDateTime(start) : 'Available throughout';
                      const endTime = end ? formatDateTime(end) : 'Available throughout';
                      return (
                        <div key={item?.sample_id?.toString() || index} style={{
                          padding: 15,
                          marginBottom: 10,
                          borderRadius: 24,
                          border: '1.5px solid #a8b4d9',
                          backgroundColor: '#fff'
                        }}>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ width: 110, height: 74, borderRadius: 12, overflow: 'hidden', background: '#f8f9fa' }}>
                              {img ? <img src={img} alt={item?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>🧃</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '2px 0 6px', color: '#1E1F24' }}>{item?.title}</h4>
                              <div style={{ display: 'flex', gap: 12, background: '#F7F9FF', border: '1.5px solid #E6E9FA', borderRadius: 17, padding: '10px 15px' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Start Time</div>
                                  <div style={{ fontWeight: 700, color: '#1E1F24' }}>{startTime}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>End Time</div>
                                  <div style={{ fontWeight: 700, color: '#1E1F24' }}>{endTime}</div>
                                </div>
                              </div>
                            </div>
                            <button style={{ border: '1.5px solid #C4C3C2', background: '#fff', borderRadius: 12, width: 36, height: 36, cursor: 'pointer' }}>⋯</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {finalSamplesData.length > 3 && (
                    <button
                      onClick={visibleSamples < finalSamplesData.length ? handleSampleMore : handleSampleLess}
                      style={{
                        width: '100%', height: 56, border: '1.5px solid #556bb9', borderRadius: 1000,
                        backgroundColor: 'transparent', color: '#556bb9', fontSize: 18, fontWeight: 700, cursor: 'pointer', marginTop: 15
                      }}
                    >
                      {visibleSamples < finalSamplesData.length ? 'View More' : 'View Less'}
                    </button>
                  )}
                </div>
              )}

              {/* No Results */}
              {['Booths'].includes(listCategory) && finalBoothsData?.length === 0 && (
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
              {['Seminars'].includes(listCategory) && finalSeminarsData?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                  <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
                  <h3 style={{ margin: '0 0 8px', color: '#1E1F24' }}>No seminars found</h3>
                </div>
              )}
              {['Samples'].includes(listCategory) && finalSamplesData?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                  <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
                  <h3 style={{ margin: '0 0 8px', color: '#1E1F24' }}>No samples found</h3>
                </div>
              )}
            </>
          ) : (
            // My Day view
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6B7280'
            }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📅</span>
              <h3 style={{ margin: '0 0 8px', color: '#1E1F24' }}>My Day</h3>
              <p style={{ margin: 0 }}>
                Your personalized schedule and saved items will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}