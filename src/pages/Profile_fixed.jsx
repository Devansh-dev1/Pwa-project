import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { clearToken, getToken } from '../utils/auth.js';
import useStore from '../store/useStore.js';
import { clearAllData } from '../utils/indexedDB.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

export default function Profile() {
  const navigate = useNavigate();
  const { userInfo, clearUserData, setUserInfo } = useStore();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          navigate('/welcome', { replace: true });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/welcome', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await clearToken();
      await clearAllData();
      clearUserData();
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // Here you would call the delete user API
      await clearToken();
      await clearAllData();
      clearUserData();
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Delete account error:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleInviteOthers = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ShowTrail App',
        text: 'Check out ShowTrail - discover amazing booths and experiences!',
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingScreen message="Processing..." />;
  }

  // Exact mobile app styles converted to CSS
  const styles = {
    // Main container - exact mobile styling (full width)
    profileafterAddingFriends: {
      width: '100%',
      paddingTop: 35, // Padding.p_16xl
      flex: 1,
      backgroundColor: '#ffffff', // Color.solidsBlackWhite
      minHeight: '100%',
      boxSizing: 'border-box',
    },
    
    // Header navigation - exact mobile styling
    topNav: {
      paddingBottom: 25, // Padding.p_6xl
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15, // Padding.p_mini
      alignSelf: 'stretch',
      marginTop: -20,
      display: 'flex'
    },
    
    buttonContainer: {
      borderRadius: 18, // Border.br_lg
      width: 48,
      justifyContent: 'center',
      height: 48,
      borderWidth: 1.5,
      borderColor: '#c4c3c2', // Color.solidsBlackBlack100
      borderStyle: 'solid',
      flexDirection: 'row',
      alignItems: 'center',
      display: 'flex',
      background: 'transparent',
      cursor: 'pointer',
      outline: 'none'
    },
    
    iconmoreLayout: {
      height: 24,
      width: 24,
    },
    
    // Content container - exact mobile styling
    outer: {
      paddingBottom: 35, // Padding.p_16xl
      paddingHorizontal: 15, // Padding.p_mini
      alignSelf: 'stretch',
      marginTop: -20,
    },
    
    // Section containers - exact mobile styling
    booths: {
      backgroundColor: '#eff7f7', // Color.solidsTurqoiseTurqoise50
      padding: 15, // Padding.p_mini
      marginTop: 25,
      borderRadius: 24, // Border.br_5xl
      alignSelf: 'stretch',
    },
    
    booths3: {
      backgroundColor: '#fff1f4', // Color.solidsFrenchPinkFrenchPink50
      padding: 15, // Padding.p_mini
      marginTop: 25,
      borderRadius: 24, // Border.br_5xl
      alignSelf: 'stretch',
    },
    
    // Section headers - exact mobile styling
    text7: {
      alignSelf: 'stretch',
    },
    
    expressionAnalysis: {
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif', // FontFamily.textXxs
      letterSpacing: -0.2,
      fontSize: 20, // FontSize.textXl_size
      color: '#413c3a', // Color.solidsBlackBlack500
      textAlign: 'left',
    },
    
    // List containers - exact mobile styling
    list: {
      marginTop: 15,
      alignSelf: 'stretch',
    },
    
    // List items - exact mobile styling
    listItem: {
      padding: 10, // Padding.p_3xs
      borderRadius: 24, // Border.br_5xl
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      backgroundColor: '#ffffff', // Color.solidsBlackWhite
      display: 'flex',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      textAlign: 'left'
    },
    
    listItem1: {
      marginTop: 7,
      padding: 10, // Padding.p_3xs
      borderRadius: 24, // Border.br_5xl
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      backgroundColor: '#ffffff', // Color.solidsBlackWhite
      display: 'flex',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      textAlign: 'left'
    },
    
    listItem11: {
      marginTop: 7,
      padding: 10, // Padding.p_3xs
      borderRadius: 24, // Border.br_5xl
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      backgroundColor: '#ffd2de', // Color.solidsFrenchPinkFrenchPink100
      display: 'flex',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      textAlign: 'left'
    },
    
    // Icon containers - exact mobile styling
    icon: {
      backgroundColor: '#eff7f7', // Color.solidsTurqoiseTurqoise50
      borderRadius: 17, // Border.br_mid
      justifyContent: 'center',
      height: 48,
      width: 48,
      flexDirection: 'row',
      alignItems: 'center',
      display: 'flex'
    },
    
    icon10: {
      backgroundColor: '#fff1f4', // Color.solidsFrenchPinkFrenchPink50
      borderRadius: 17, // Border.br_mid
      justifyContent: 'center',
      height: 48,
      width: 48,
      flexDirection: 'row',
      alignItems: 'center',
      display: 'flex'
    },
    
    // Text styles - exact mobile styling
    iWannaReduce1: {
      marginLeft: 10,
      fontSize: 14, // FontSize.textSm_size
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif', // FontFamily.textSm
      flex: 1,
      color: '#413c3a', // Color.solidsBlackBlack500
      textAlign: 'left',
      fontWeight: 700
    },
    
    iWannaReduce12: {
      color: '#ff6e95', // Color.solidsFrenchPinkFrenchPink500
      marginLeft: 10,
      textAlign: 'left',
      flex: 1,
    },
    
    delAcount: {
      color: '#ff6e95', // Color.solidsFrenchPinkFrenchPink500
      fontSize: 14, // FontSize.textSm_size
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif', // FontFamily.textSm
      fontWeight: 700
    },
    
    // Tag styling - exact mobile styling
    tagMaster1: {
      backgroundColor: '#556bb9', // Color.solidsDenimDenim400
      marginLeft: 10,
      paddingVertical: 4, // Padding.p_9xs
      paddingHorizontal: 12, // Padding.p_xs
      borderRadius: 12, // Border.br_xs
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      display: 'flex'
    },
    
    sendInvite: {
      color: '#ffffff', // Color.solidsBlackWhite
      textAlign: 'center',
      fontSize: 12, // FontSize.paragraphXs_size
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif', // FontFamily.textSm
      fontWeight: 700
    },
    
    // User links container - exact mobile styling
    userLinks: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
      width: '100%',
      gap: 2,
    }
  };

  return (
    <div style={{
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: '#fff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
      }}>
        <div style={styles.profileafterAddingFriends}>
          {/* Header - exact mobile layout */}
          <div style={styles.topNav}>
            <button
              onClick={() => navigate('/home')}
              style={styles.buttonContainer}
            >
              <img
                style={styles.iconmoreLayout}
                src="/assets/iconchevron-left.png"
                alt="Back"
              />
            </button>
          </div>

          {/* Content - exact mobile layout */}
          <div style={styles.outer}>
            {/* General Section - exact mobile styling */}
            <div style={styles.booths}>
              <div style={styles.text7}>
                <span style={styles.expressionAnalysis}>
                  General
                </span>
              </div>
              
              <div style={styles.list}>
                {/* Personal Information */}
                <button
                  onClick={() => navigate('/profile/information')}
                  style={styles.listItem}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/pi.png"
                        alt="Personal Info"
                      />
                    </div>
                    <span style={styles.iWannaReduce1}>
                      Personal Information
                    </span>
                  </div>
                </button>

                {/* My Family */}
                <button
                  onClick={() => navigate('/profile/family')}
                  style={styles.listItem1}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/Baby.png"
                        alt="Family"
                      />
                    </div>
                    <div style={styles.iWannaReduce1}>
                      <span style={{
                        fontSize: 14, // FontSize.textSm_size
                        fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif', // FontFamily.textSm
                        color: '#413c3a', // Color.solidsBlackBlack500
                        fontWeight: 700
                      }}>
                        My Family
                      </span>
                    </div>
                    <img
                      style={{ width: 24, height: 24, marginRight: 10 }}
                      src="/assets/Plus1.png"
                      alt="Add"
                    />
                  </div>
                </button>

                {/* Liked Items */}
                <button
                  onClick={() => navigate('/profile/liked-items')}
                  style={styles.listItem1}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/iconlike.png"
                        alt="Liked Items"
                      />
                    </div>
                    <span style={styles.iWannaReduce1}>
                      Liked Items
                    </span>
                  </div>
                </button>

                {/* My Coupons & Rewards */}
                <button
                  onClick={() => navigate('/profile/coupons')}
                  style={styles.listItem1}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/ProfileGift.png"
                        alt="Coupons"
                      />
                    </div>
                    <span style={styles.iWannaReduce1}>
                      My Coupons & Rewards
                    </span>
                  </div>
                </button>

                {/* Invite Others */}
                <button
                  onClick={handleInviteOthers}
                  style={styles.listItem1}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/iconinvite.png"
                        alt="Invite"
                      />
                    </div>
                    <span style={styles.iWannaReduce1}>
                      Invite Others
                    </span>
                    <div style={styles.tagMaster1}>
                      <span style={styles.sendInvite}>
                        Send Invite
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Security & Privacy Section - exact mobile styling */}
            <div style={styles.booths}>
              <div style={styles.text7}>
                <span style={styles.expressionAnalysis}>
                  Security & Privacy
                </span>
              </div>
              
              <div style={styles.list}>
                {/* Privacy Policy */}
                <button
                  onClick={() => window.open('https://www.iubenda.com/privacy-policy/64723559/full-legal', '_blank')}
                  style={styles.listItem}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/Policy.png"
                        alt="Privacy Policy"
                      />
                    </div>
                    <span style={styles.iWannaReduce1}>
                      Privacy Policy
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Danger Zone Section - exact mobile styling */}
            <div style={styles.booths3}>
              <div style={styles.text7}>
                <span style={styles.expressionAnalysis}>
                  Danger Zone
                </span>
              </div>
              
              <div style={styles.list}>
                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  style={styles.listItem}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon10}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/iconsign-out1.png"
                        alt="Sign Out"
                      />
                    </div>
                    <span style={styles.iWannaReduce1}>
                      Sign Out
                    </span>
                  </div>
                </button>

                {/* Delete Account */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={styles.listItem11}
                >
                  <div style={styles.userLinks}>
                    <div style={styles.icon10}>
                      <img
                        style={styles.iconmoreLayout}
                        src="/assets/iconwarning-solid1.png"
                        alt="Delete Account"
                      />
                    </div>
                    <div style={styles.iWannaReduce12}>
                      <span style={styles.delAcount}>
                        Delete Account & Data
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              maxWidth: 320,
              width: '100%'
            }}>
              <h3 style={{
                fontSize: 18,
                fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
                color: '#413c3a',
                margin: '0 0 12px',
                fontWeight: 700
              }}>
                Delete Account
              </h3>
              <p style={{
                fontSize: 14,
                fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
                color: '#a8a5a4',
                margin: '0 0 24px',
                fontWeight: 500
              }}>
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div style={{
                display: 'flex',
                gap: 12
              }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #c4c3c2',
                    backgroundColor: '#fff',
                    color: '#a8a5a4',
                    fontSize: 14,
                    fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: '#ff6e95',
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
