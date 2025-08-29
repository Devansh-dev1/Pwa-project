/**
 * IndexedDB Usage Examples
 * This file shows how to use the simplified IndexedDB functions
 */

import {
  // UserInfo functions
  addUserInfo,
  getUserInfo, // Main function - returns user without ID
  getUserInfoById,
  getUserInfoByEmail,
  getAllUserInfo, // Internal use only
  editUserInfo,
  deleteUserInfo,
  clearAllUserInfo,
  
  // GlobalJson functions
  addGlobalJson,
  getGlobalJson,
  getAllGlobalJson,
  editGlobalJson,
  deleteGlobalJson,
  clearAllGlobalJson,
  
  // Utility functions
  clearAllData,
  getDatabaseStats,
  closeDatabase
} from './indexedDB.js';

// ========================================
// USERINFO TABLE EXAMPLES
// ========================================

/**
 * Example: Add a new user
 */
export const exampleAddUser = async () => {
  try {
    const userData = {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      age: 25
    };
    
    const result = await addUserInfo(userData);
    console.log('User added successfully:', result);
    return result;
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

/**
 * Example: Get user by email
 */
export const exampleGetUserByEmail = async (email) => {
  try {
    const user = await getUserInfoByEmail(email);
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
  }
};

/**
 * Example: Get current user info (without ID)
 * This is the main function to use - returns user data without ID field
 */
export const exampleGetCurrentUser = async () => {
  try {
    const user = await getUserInfo();
    if (user) {
      console.log('Current user info (without ID):', user);
      // user object will NOT have 'id' field
      // Only contains: email, firstName, lastName, phone, age, timestamp, created_at, updated_at
    } else {
      console.log('No user found');
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
  }
};

/**
 * Example: Get user by ID
 */
export const exampleGetUserById = async (id) => {
  try {
    const user = await getUserInfoById(id);
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
  }
};

/**
 * Example: Get all users
 */
export const exampleGetAllUsers = async () => {
  try {
    const users = await getAllUserInfo();
    console.log('All users:', users);
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
  }
};

/**
 * Example: Edit user information
 */
export const exampleEditUser = async (userId, updateData) => {
  try {
    const result = await editUserInfo(userId, updateData);
    console.log('User updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

/**
 * Example: Delete user
 */
export const exampleDeleteUser = async (userId) => {
  try {
    const result = await deleteUserInfo(userId);
    console.log('User deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

// ========================================
// GLOBALJSON TABLE EXAMPLES
// ========================================

/**
 * Example: Store app settings
 */
export const exampleStoreSettings = async () => {
  try {
    const settings = {
      theme: 'dark',
      language: 'en',
      notifications: true,
      autoSave: false
    };
    
    const result = await addGlobalJson('app_settings', settings);
    console.log('Settings stored successfully:', result);
    return result;
  } catch (error) {
    console.error('Error storing settings:', error);
  }
};

/**
 * Example: Store user preferences
 */
export const exampleStorePreferences = async (userId) => {
  try {
    const preferences = {
      userId: userId,
      favoriteCategories: ['sports', 'music', 'food'],
      lastVisitedPages: ['/home', '/profile', '/settings'],
      customTheme: {
        primaryColor: '#2a46a8',
        secondaryColor: '#17275c'
      }
    };
    
    const result = await addGlobalJson(`user_preferences_${userId}`, preferences);
    console.log('Preferences stored successfully:', result);
    return result;
  } catch (error) {
    console.error('Error storing preferences:', error);
  }
};

/**
 * Example: Store cache data
 */
export const exampleStoreCache = async () => {
  try {
    const cacheData = {
      homeData: {
        banners: ['banner1.jpg', 'banner2.jpg'],
        featuredItems: ['item1', 'item2', 'item3'],
        lastUpdated: new Date().toISOString()
      }
    };
    
    const result = await addGlobalJson('home_cache', cacheData);
    console.log('Cache stored successfully:', result);
    return result;
  } catch (error) {
    console.error('Error storing cache:', error);
  }
};

/**
 * Example: Get stored data by key
 */
export const exampleGetData = async (key) => {
  try {
    const data = await getGlobalJson(key);
    console.log(`Data for key "${key}":`, data);
    return data;
  } catch (error) {
    console.error('Error getting data:', error);
  }
};

/**
 * Example: Get all stored JSON data
 */
export const exampleGetAllData = async () => {
  try {
    const allData = await getAllGlobalJson();
    console.log('All stored data:', allData);
    return allData;
  } catch (error) {
    console.error('Error getting all data:', error);
  }
};

/**
 * Example: Update existing data
 */
export const exampleUpdateData = async (key, newData) => {
  try {
    const result = await editGlobalJson(key, newData);
    console.log('Data updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating data:', error);
  }
};

/**
 * Example: Delete specific data
 */
export const exampleDeleteData = async (key) => {
  try {
    const result = await deleteGlobalJson(key);
    console.log('Data deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};

// ========================================
// UTILITY EXAMPLES
// ========================================

/**
 * Example: Get database statistics
 */
export const exampleGetStats = async () => {
  try {
    const stats = await getDatabaseStats();
    console.log('Database statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
  }
};

/**
 * Example: Clear all data
 */
export const exampleClearAll = async () => {
  try {
    const result = await clearAllData();
    console.log('All data cleared successfully:', result);
    return result;
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

/**
 * Example: Complete user management workflow
 */
export const exampleCompleteWorkflow = async () => {
  try {
    console.log('=== Starting Complete Workflow ===');
    
    // 1. Add a new user
    const userData = {
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1987654321',
      age: 30
    };
    
    await addUserInfo(userData);
    console.log('1. User added (all previous users cleared)');
    
    // 2. Get user by email
    const user = await getUserInfoByEmail('jane@example.com');
    console.log('2. User retrieved:', user);
    
    // 3. Store user preferences
    const preferences = {
      userId: user.id, // user.id exists when getting by email
      theme: 'light',
      notifications: false,
      language: 'es'
    };
    
    await addGlobalJson(`preferences_${user.id}`, preferences);
    console.log('3. Preferences stored');
    
    // 4. Update user information
    await editUserInfo(user.id, { age: 31, phone: '+1987654322' });
    console.log('4. User updated');
    
    // 5. Get current user info (without ID) - main function
    const currentUser = await getUserInfo();
    console.log('5. Current user (without ID):', currentUser);
    
    // 6. Get database stats
    const stats = await getDatabaseStats();
    console.log('6. Database stats:', stats);
    
    console.log('=== Workflow Completed Successfully ===');
    
  } catch (error) {
    console.error('Workflow failed:', error);
  }
};

// ========================================
// USAGE IN COMPONENTS
// ========================================

/**
 * Example: How to use in React components
 * 
 * // In your component:
 * import { addUserInfo, getUserInfoByEmail } from '../utils/indexedDB.js';
 * 
 * const handleSignUp = async (userData) => {
 *   try {
 *     // Store user in IndexedDB
 *     await addUserInfo(userData);
 *     
 *     // Store additional data
 *     await addGlobalJson('user_session', {
 *       lastLogin: new Date().toISOString(),
 *       loginCount: 1
 *     });
 *     
 *     console.log('User data stored successfully');
 *   } catch (error) {
 *     console.error('Failed to store user data:', error);
 *   }
 * };
 * 
 * const handleLogin = async (email) => {
 *   try {
 *     // Get user from IndexedDB
 *     const user = await getUserInfoByEmail(email);
 *     
 *     if (user) {
 *       // Update session data
 *       await editGlobalJson('user_session', {
 *         lastLogin: new Date().toISOString(),
 *         loginCount: (await getGlobalJson('user_session'))?.loginCount + 1 || 1
 *       });
 *       
 *       console.log('User logged in:', user);
 *       return user;
 *     }
 *   } catch (error) {
 *     console.error('Failed to get user data:', error);
 *   }
 * };
 */
