import { getUserInfo } from './indexedDB.js';

/**
 * Check if user is authenticated and show login popup if not
 * @param {Function} callback - Function to execute after successful login/skip
 * @param {Function} showLoginPopupAction - Function to show login popup
 * @returns {Promise<boolean>} - Returns true if user is authenticated, false otherwise
 */
export const requireAuth = async (callback = null, showLoginPopupAction = null) => {
  try {
    console.log('🔍 Checking authentication...');
    const userInfo = await getUserInfo();
    console.log('👤 User info:', userInfo);
    
    // Check if user is authenticated (has valid user data and is not a guest)
    if (userInfo && userInfo.token && !userInfo.isGuest) {
      console.log('✅ User is authenticated, executing callback');
      // User is authenticated, execute callback if provided
      if (callback) {
        callback();
      }
      return true;
    }
    
    console.log('❌ User is not authenticated, showing login popup');
    // User is not authenticated, show login popup
    if (showLoginPopupAction) {
      showLoginPopupAction(callback);
    } else {
      console.error('showLoginPopupAction not provided');
    }
    return false;
    
  } catch (error) {
    console.error('Error checking authentication:', error);
    
    // Show login popup on error
    if (showLoginPopupAction) {
      showLoginPopupAction(callback);
    } else {
      console.error('showLoginPopupAction not provided');
    }
    return false;
  }
};

/**
 * Check if user is authenticated without showing popup
 * @returns {Promise<boolean>} - Returns true if user is authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  try {
    const userInfo = await getUserInfo();
    return !!(userInfo && userInfo.token && !userInfo.isGuest);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
