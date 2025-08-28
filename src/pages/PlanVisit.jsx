import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import { fetchPersonalizedData } from '../api/auth.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

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
      setBoothData(BoothId);
    } catch (error) {
      console.error('Error fetching booth suggestions:', error);
    }
  };

  const suggestionsSeminarData = async () => {
    try {
      const res = await fetchPersonalizedData(userInfo?.auto_id, 'Seminar');
      let BoothId = res?.map(item => item.itemId) || [];
      setSeminarData(BoothId);
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
                {/* <h3 style={{
                  fontSize: FontSize.textXl_size,
                  letterSpacing: -0.2,
                  color: Color.solidsBlackBlack500,
                  fontFamily: FontFamily.textXxs,
                  textAlign: 'left',
                  margin: '0 0 5px',
                  fontWeight: 900,
                }}>
                  Booths
                </h3> */}
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
              
              {/* Mock booth item */}
              {/* <div style={{
                marginTop: 15,
                padding: Padding.p_mini,
                borderRadius: Border.br_5xl,
                borderWidth: 1.5,
                borderStyle: 'solid',
                borderColor: Color.solidsDenimDenim200,
                backgroundColor: Color.oslerGrayWhite,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 4px', 
                      fontSize: 16, 
                      color: Color.solidsBlackBlack500,
                      fontFamily: FontFamily.textSm,
                      fontWeight: 700,
                    }}>
                      Sample Boothekh
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: 14, 
                      color: Color.solidsBlackBlack400,
                      fontFamily: FontFamily.paragraphSm,
                    }}>
                      Discover amazing products and services
                    </p>
                  </div>
                </div>
              </div> */}

              {/* <button style={{
                borderColor: Color.solidsDenimDenim400,
                borderWidth: 1.5,
                borderStyle: 'solid',
                marginTop: 15,
                minHeight: 48,
                alignSelf: 'stretch',
                backgroundColor: 'transparent',
                borderRadius: Border.br_981xl,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                cursor: 'pointer',
                outline: 'none',
                width: '100%',
              }}>
                <span style={{
                  color: Color.solidsDenimDenim400,
                  fontSize: FontSize.paragraphSm_size,
                  lineHeight: '15px',
                  fontFamily: FontFamily.textXl,
                  textAlign: 'center',
                  fontWeight: 700,
                }}>
                  View More
                </span>
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PlanVisit() {
  return (
    <div className="mobile-frame-container">
      <div className="screen-container">
        <PlanVisitFirstTime />
      </div>
    </div>
  );
}