import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function ProfileInformation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageUrl, setImageUrl] = useState(null);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const fileInputRef = useRef(null);

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

  const EditIcon = ({ onClick }) => (
    <button onClick={onClick} style={styles.editBtn} aria-label="Edit">
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
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.firstName) || 'John'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Middle Name</div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.middleName) || 'A.'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Last Name <span style={styles.asterisk}>*</span></div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.lastName) || 'Walker'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Gender <span style={styles.asterisk}>*</span></div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.gender) || 'Male'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Date of Birth <span style={styles.asterisk}>*</span></div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.dob) || '01-01-1990'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Address <span style={styles.asterisk}>*</span></div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.address1) || '3522 Fork Street'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>City & State <span style={styles.asterisk}>*</span></div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={((location.state && location.state.prefill && location.state.prefill.city) ? `${location.state.prefill.city}, ${location.state.prefill.state || ''}` : 'New York, NY')} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Postal Code <span style={styles.asterisk}>*</span></div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value={(location.state && location.state.prefill && location.state.prefill.postal) || '10001'} readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>Phone Number</div>
                <div style={styles.inputRow}>
                  <input style={styles.input} value="(555) 123-4567" readOnly />
                  <EditIcon onClick={() => {}} />
                </div>
              </div>
            </div>

            <div style={styles.saveBtnWrap}>
              <button style={styles.saveBtn} onClick={() => navigate('/profile')}>
                Save & Close
              </button>
            </div>
          </div>
        </div>

        {showPhotoSheet && (
          <div style={styles.photoSheetOverlay} onClick={closePhotoSheet}>
            <div style={styles.photoSheet} onClick={(e) => e.stopPropagation()}>
              <div style={styles.sheetHandle} />
              <button style={styles.sheetBtn} onClick={() => handlePick(true)}>
                Take Photo
              </button>
              <button style={styles.sheetBtn} onClick={() => handlePick(false)}>
                Choose from Library
              </button>
              <button style={styles.sheetBtn} onClick={removePhoto}>
                Remove Photo
              </button>
              <button style={{ ...styles.sheetBtn, borderColor: '#c4c3c2' }} onClick={closePhotoSheet}>
                Cancel
              </button>
            </div>
          </div>
        )}

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