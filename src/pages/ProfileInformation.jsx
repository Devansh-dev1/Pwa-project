import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserInfo } from '../utils/indexedDB';

export default function ProfileInformation() {
  const navigate = useNavigate();
  
  const [imageUrl, setImageUrl] = useState(null);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const fileInputRef = useRef(null);

  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const getUserInfos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userInfo = await getUserInfo()
      setUserInfo(userInfo)
      console.log('🔍 ProfileInformation - User data loaded:', userInfo)
    } catch (error) {
      console.error('❌ ProfileInformation - Error loading user data:', error)
      setError('Failed to load user data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getUserInfos()
  }, [])

  useEffect(() => {
    const setVhVar = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVhVar();
    window.addEventListener('resize', setVhVar);
    window.addEventListener('orientationchange', setVhVar);
    return () => {
      window.removeEventListener('resize', setVhVar);
      window.removeEventListener('orientationchange', setVhVar);
    };
  }, []);

  const styles = {
    shapeIcon: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: -780,
      width: 965,
      height: 960,
      zIndex: 0,
      borderRadius: 24,
      pointerEvents: 'none'
    },
    screen: {
      width: '100%',
      paddingTop: 35,
      paddingBottom: 35,
      flex: 1,
      backgroundColor: '#ffffff',
      minHeight: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1
    },
    topNav: {
      paddingBottom: 25,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      alignSelf: 'stretch',
      marginTop: -20,
      display: 'flex'
    },
    backBtn: {
      borderRadius: 18,
      width: 48,
      height: 48,
      border: '1.5px solid #c4c3c2',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      cursor: 'pointer',
      outline: 'none'
    },
    headerWrap: {
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 0,
      marginBottom: 10
    },
    headerTitle: {
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: -0.2,
      fontSize: 20,
      color: '#413c3a',
      textAlign: 'left'
    },
    middle: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 15,
      alignSelf: 'stretch',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column'
    },
    avatarWrap: {
      position: 'relative',
      width: 133,
      height: 133,
      borderRadius: 527,
      border: '2.6px solid #7EC8C9',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarImg: {
      width: 128,
      height: 128,
      borderRadius: 200,
      objectFit: 'cover'
    },
    editBubble: {
      position: 'absolute',
      top: 105,
      left: 48,
      width: 28,
      height: 28,
      borderRadius: 188,
      backgroundColor: '#2A46A8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fieldsBlock: {
      alignSelf: 'stretch',
      width: '100%',
      marginTop: 20
    },
    fieldGroup: {
      marginTop: 10,
      marginBottom: 15
    },
    label: {
      color: '#2A46A8',
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold, -apple-system, BlinkMacSystemFont, sans-serif',
      textAlign: 'left'
    },
    asterisk: {
      color: '#ff6e95'
    },
    inputRow: {
      marginTop: 5,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eff7f7',
      borderRadius: 24,
      height: 56,
      paddingLeft: 15,
      paddingRight: 15,
      position: 'relative'
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#213C6B',
      border: 'none',
      outline: 'none',
      background: 'transparent'
    },
    editBtn: {
      position: 'absolute',
      right: 16,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    saveBtnWrap: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: 15,
      marginBottom: 20
    },
    saveBtn: {
      borderRadius: 999,
      padding: '16px 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      background: 'linear-gradient(90deg, #2a46a8 25%, #17275c 100%)',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 16,
      letterSpacing: -0.1,
      textTransform: 'capitalize'
    },
    photoSheetOverlay: {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1000
    },
    photoSheet: {
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: 430,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16
    },
    sheetHandle: {
      width: 50,
      height: 5,
      backgroundColor: '#ddd',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 12
    },
    sheetBtn: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 12,
      border: '1px solid #eee',
      backgroundColor: '#fff',
      color: '#413c3a',
      fontSize: 14,
      fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
      cursor: 'pointer',
      outline: 'none',
      textAlign: 'center',
      marginBottom: 10
    }
  };

  const openPhotoSheet = () => setShowPhotoSheet(true);
  const closePhotoSheet = () => setShowPhotoSheet(false);

  const handlePick = (captureMode) => {
    if (!fileInputRef.current) return;
    if (captureMode) {
      fileInputRef.current.setAttribute('capture', 'environment');
    } else {
      fileInputRef.current.removeAttribute('capture');
    }
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    closePhotoSheet();
  };

  const removePhoto = () => {
    setImageUrl(null);
    closePhotoSheet();
  };

  const EditIcon = ({ onClick, tooltip }) => (
    <button 
      onClick={onClick} 
      style={{
        ...styles.editBtn,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }} 
      aria-label="Edit"
      title={tooltip}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.backgroundColor = '#f0f0f0';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.backgroundColor = 'transparent';
      }}
    >
      <img src="/assets/iconedit.png" alt="Edit" style={{ width: 24, height: 24 }} />
    </button>
  );

  return (
    <div className="mobile-frame-container">
      <div className="screen-container">
        <img src="/assets/shape.png" alt="" style={styles.shapeIcon} />
        <div style={styles.screen}>
          <div style={styles.topNav}>
            <button onClick={() => navigate('/profile')} style={styles.backBtn}>
              <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
            </button>
          </div>

          <div style={styles.headerWrap}>
            <div style={styles.headerTitle}>Profile Information</div>
          </div>

          <div style={styles.middle}>
            {/* Loading State */}
            {isLoading && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading profile information...</div>
                <div style={{ fontSize: '14px' }}>Please wait while we fetch your data</div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                margin: '20px',
                backgroundColor: '#ffebee',
                border: '1px solid #f44336',
                borderRadius: '8px',
                color: '#c62828'
              }}>
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>⚠️ Error</div>
                <div style={{ fontSize: '14px', marginBottom: '15px' }}>{error}</div>
                <button 
                  onClick={getUserInfos}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Profile Content - Only show when not loading and no error */}
            {!isLoading && !error && userInfo ? (
              <>
                <div onClick={openPhotoSheet} style={styles.avatarWrap}>
                  <img
                    src={imageUrl || '/assets/porifle.png'}
                    alt="Profile"
                    style={styles.avatarImg}
                  />
                  <div style={styles.editBubble}>
                    <img src="/assets/editPopup.png" alt="" style={{ width: 28, height: 28 }} />
                  </div>
                </div>

            <div style={styles.fieldsBlock}>
                                <div style={styles.fieldGroup}>
                    <div style={styles.label}>First Name <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.first_name || userInfo?.firstName || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/name')} 
                        tooltip="Edit Name Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Middle Name</div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.middle_name || userInfo?.middleName || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/name')} 
                        tooltip="Edit Name Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Last Name <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.last_name || userInfo?.lastName || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/name')} 
                        tooltip="Edit Name Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Gender <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.gender || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/gender')} 
                        tooltip="Edit Gender"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Date of Birth <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.dob || userInfo?.date_of_birth || userInfo?.birth_date || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/dob')} 
                        tooltip="Edit Date of Birth"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Address <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.address || userInfo?.address1 || userInfo?.street_address || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/address')} 
                        tooltip="Edit Address Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>City <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.city || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/address')} 
                        tooltip="Edit Address Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>State/Province <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.state || userInfo?.province || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/address')} 
                        tooltip="Edit Address Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Postal Code <span style={styles.asterisk}>*</span></div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.postal_code || userInfo?.postal || userInfo?.zip_code || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/address')} 
                        tooltip="Edit Address Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Country</div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.country || 'Canada'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/address')} 
                        tooltip="Edit Address Information"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Phone Number</div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.phone || userInfo?.phone_number || userInfo?.mobile || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/phone')} 
                        tooltip="Edit Phone Number"
                      />
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>Email</div>
                    <div style={styles.inputRow}>
                      <input style={styles.input} value={userInfo?.email || 'Not provided'} readOnly />
                      <EditIcon 
                        onClick={() => navigate('/signup/name')} 
                        tooltip="Edit Email"
                      />
                    </div>
                  </div>

            

             

           
            </div>

            <div style={styles.saveBtnWrap}>
              <button style={styles.saveBtn} onClick={() => navigate('/profile')}>
                Save & Close
              </button>
            </div>
              </>
            ) : !isLoading && !error && !userInfo ? (
              // No user data state
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>No Profile Data</div>
                <div style={{ fontSize: '14px', marginBottom: '20px' }}>No user information found in your profile</div>
                <button 
                  onClick={() => navigate('/welcome')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2a46a8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Go to Welcome
                </button>
              </div>
            ) : null}
          </div>
        </div>

      

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}