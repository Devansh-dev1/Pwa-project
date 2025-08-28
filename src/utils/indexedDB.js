// IndexedDB wrapper to replace SQLite functionality
class IndexedDBManager {
  constructor() {
    this.dbName = 'PerkAppDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create Users table
        if (!db.objectStoreNames.contains('Users')) {
          const usersStore = db.createObjectStore('Users', { 
            keyPath: 'event_id', 
            autoIncrement: true 
          });
          usersStore.createIndex('time_stamp', 'time_stamp', { unique: false });
        }

        // Create Tokens table
        if (!db.objectStoreNames.contains('Tokens')) {
          db.createObjectStore('Tokens', { keyPath: 'id' });
        }

        // Create Activity table
        if (!db.objectStoreNames.contains('Activity')) {
          const activityStore = db.createObjectStore('Activity', { keyPath: 'id' });
          activityStore.createIndex('cognito_id', 'cognito_id', { unique: false });
          activityStore.createIndex('activity_id', 'activity_id', { unique: false });
        }

        // Create LikeItem table
        if (!db.objectStoreNames.contains('LikeItem')) {
          const likeStore = db.createObjectStore('LikeItem', { keyPath: 'id' });
          likeStore.createIndex('global_id', 'global_id', { unique: false });
          likeStore.createIndex('cognito_id', 'cognito_id', { unique: false });
        }

        // Create UserProfile table
        if (!db.objectStoreNames.contains('UserProfile')) {
          const profileStore = db.createObjectStore('UserProfile', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          profileStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Create Security table
        if (!db.objectStoreNames.contains('Security')) {
          const securityStore = db.createObjectStore('Security', { keyPath: 'id' });
          securityStore.createIndex('cognito_id', 'cognito_id', { unique: false });
        }

        // Create TermsConditions table
        if (!db.objectStoreNames.contains('TermsConditions')) {
          db.createObjectStore('TermsConditions', { keyPath: 'id' });
        }

        // Create Coupons table
        if (!db.objectStoreNames.contains('Coupons')) {
          const couponsStore = db.createObjectStore('Coupons', { keyPath: 'id' });
          couponsStore.createIndex('cognito_id', 'cognito_id', { unique: false });
        }

        // Create Children table
        if (!db.objectStoreNames.contains('Children')) {
          const childrenStore = db.createObjectStore('Children', { keyPath: 'id' });
          childrenStore.createIndex('cognito_id', 'cognito_id', { unique: false });
        }

        // Create AppCache table for general caching
        if (!db.objectStoreNames.contains('AppCache')) {
          const cacheStore = db.createObjectStore('AppCache', { keyPath: 'id' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create HomeCache table for home data caching
        if (!db.objectStoreNames.contains('HomeCache')) {
          const homeCacheStore = db.createObjectStore('HomeCache', { keyPath: 'id' });
          homeCacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('IndexedDB tables created successfully');
      };
    });
  }

  async getStore(storeName, mode = 'readonly') {
    await this.init();
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Token management
  async storeToken(token) {
    const store = await this.getStore('Tokens', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'auth_token', token, timestamp: new Date().toISOString() });
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getToken() {
    const store = await this.getStore('Tokens');
    return new Promise((resolve, reject) => {
      const request = store.get('auth_token');
      request.onsuccess = () => resolve(request.result?.token || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteToken() {
    const store = await this.getStore('Tokens', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete('auth_token');
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // User data management
  async storeUserData(userData) {
    const store = await this.getStore('Users', 'readwrite');
    
    // Clear existing user data first
    await this.clearUserData();
    
    const data = {
      jsonData: JSON.stringify(userData),
      time_stamp: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserData() {
    const store = await this.getStore('Users');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result;
        if (results.length > 0) {
          const userData = JSON.parse(results[0].jsonData);
          resolve(userData);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearUserData() {
    const store = await this.getStore('Users', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // User profile management
  async storeUserProfile(profileData) {
    const store = await this.getStore('UserProfile', 'readwrite');
    
    // Clear existing profile data first
    await this.clearUserProfile();
    
    const data = {
      profile_data: JSON.stringify(profileData),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserProfile() {
    const store = await this.getStore('UserProfile');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result;
        if (results.length > 0) {
          const profileData = JSON.parse(results[0].profile_data);
          resolve(profileData);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearUserProfile() {
    const store = await this.getStore('UserProfile', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Activity management
  async storeActivity(activityData) {
    const store = await this.getStore('Activity', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(activityData);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getActivities(cognitoId) {
    const store = await this.getStore('Activity');
    const index = store.index('cognito_id');
    return new Promise((resolve, reject) => {
      const request = index.getAll(cognitoId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Like items management
  async storeLikeItem(likeData) {
    const store = await this.getStore('LikeItem', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(likeData);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getLikeItems(cognitoId) {
    const store = await this.getStore('LikeItem');
    const index = store.index('cognito_id');
    return new Promise((resolve, reject) => {
      const request = index.getAll(cognitoId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Terms and conditions management
  async storeTermsConditions(terms, policy) {
    const store = await this.getStore('TermsConditions', 'readwrite');
    const data = {
      id: 'terms_policy',
      terms,
      policy,
      timestamp: new Date().toISOString()
    };
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getTermsConditions() {
    const store = await this.getStore('TermsConditions');
    return new Promise((resolve, reject) => {
      const request = store.get('terms_policy');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic clear all data method
  async clearAllData() {
    const storeNames = ['Users', 'Tokens', 'Activity', 'LikeItem', 'UserProfile', 'Security', 'TermsConditions', 'Coupons', 'Children', 'AppCache', 'HomeCache'];
    
    for (const storeName of storeNames) {
      try {
        const store = await this.getStore(storeName, 'readwrite');
        await new Promise((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error(`Error clearing ${storeName}:`, error);
      }
    }
    
    return true;
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Create a singleton instance
const indexedDBManager = new IndexedDBManager();

export default indexedDBManager;

// Export convenience functions that match the SQLite API
export const getToken = () => indexedDBManager.getToken();
export const storeToken = (token) => indexedDBManager.storeToken(token);
export const deleteToken = () => indexedDBManager.deleteToken();
export const storeUserData = (userData) => indexedDBManager.storeUserData(userData);
export const getUserData = () => indexedDBManager.getUserData();
export const storeUserProfile = (profileData) => indexedDBManager.storeUserProfile(profileData);
export const getUserProfile = () => indexedDBManager.getUserProfile();
export const clearAllData = () => indexedDBManager.clearAllData();
