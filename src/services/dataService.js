import indexedDBManager from '../utils/indexedDB.js';
import { handleAllData, getBoothsData, getEventsData, getCouponsData } from '../api/home.js';
import { getUserInfo } from '../api/auth.js';

class DataService {
  constructor() {
    this.dbManager = indexedDBManager;
  }

  // Initialize the data service
  async initialize() {
    try {
      await this.dbManager.init();
      console.log('DataService initialized successfully');
    } catch (error) {
      console.error('Error initializing DataService:', error);
      throw error;
    }
  }

  // User Data Management


  async setUserData(userData) {
    // return await this.dbManager.storeUserData(userData);
  }

  async syncUserData() {
    try {
      const token =''// await this.dbManager.getToken();
      if (!token) {
        throw new Error('No token available for sync');
      }

      const userInfo = await getUserInfo();
      if (userInfo) {
        await this.setUserData(userInfo);
        return userInfo;
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
      throw error;
    }
  }

  // Home Data Management
  async getHomeData() {
    try {
      // Try to get from cache first
      const cachedData = await this.getCachedHomeData();
      if (cachedData) {
        // Return cached data and sync in background
        this.syncHomeData().catch(console.error);
        return cachedData;
      }

      // If no cache, fetch from API
      return await this.syncHomeData();
    } catch (error) {
      console.error('Error getting home data:', error);
      throw error;
    }
  }

  async syncHomeData() {
    try {
      const userData ='' //await this.getUserData();
      if (!userData?.auto_id) {
        throw new Error('User data not available');
      }

      const homeData = await handleAllData(userData.auto_id);
      
      // Store in IndexedDB
      await this.storeHomeDataInCache(homeData);
      
      return homeData;
    } catch (error) {
      console.error('Error syncing home data:', error);
      throw error;
    }
  }

  async getCachedHomeData() {
    try {
      // Get from IndexedDB cache table
      const store = await this.dbManager.getStore('HomeCache');
      return new Promise((resolve, reject) => {
        const request = store.get('home_data');
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            // Check if data is still fresh (within 30 minutes)
            const dataAge = Date.now() - new Date(result.timestamp).getTime();
            if (dataAge < 30 * 60 * 1000) { // 30 minutes
              resolve(JSON.parse(result.data));
            } else {
              resolve(null); // Data is stale
            }
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting cached home data:', error);
      return null;
    }
  }

  async storeHomeDataInCache(data) {
    try {
      const store = await this.dbManager.getStore('HomeCache', 'readwrite');
      const cacheData = {
        id: 'home_data',
        data: JSON.stringify(data),
        timestamp: new Date().toISOString()
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(cacheData);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error storing home data in cache:', error);
    }
  }

  // Booths Data Management
  async getBoothsData() {
    try {
      const data = await getBoothsData();
      // Store in local cache
      await this.storeCacheData('booths', data);
      return data;
    } catch (error) {
      // Fallback to cached data
      const cachedData = await this.getCacheData('booths');
      if (cachedData) {
        return cachedData;
      }
      throw error;
    }
  }

  // Events Data Management
  async getEventsData() {
    try {
      const data = await getEventsData();
      await this.storeCacheData('events', data);
      return data;
    } catch (error) {
      const cachedData = await this.getCacheData('events');
      if (cachedData) {
        return cachedData;
      }
      throw error;
    }
  }

  // Coupons Data Management
  async getCouponsData() {
    try {
      const userData ='' //await this.getUserData();
      if (!userData?.auto_id) {
        return [];
      }

      const data = await getCouponsData(userData.auto_id);
      await this.storeCacheData('coupons', data);
      return data;
    } catch (error) {
      const cachedData = await this.getCacheData('coupons');
      if (cachedData) {
        return cachedData;
      }
      return [];
    }
  }

  // Generic cache management
  async storeCacheData(key, data) {
    try {
      const store = await this.dbManager.getStore('AppCache', 'readwrite');
      const cacheData = {
        id: key,
        data: JSON.stringify(data),
        timestamp: new Date().toISOString()
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(cacheData);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error storing cache data for ${key}:`, error);
    }
  }

  async getCacheData(key) {
    try {
      const store = await this.dbManager.getStore('AppCache');
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            resolve(JSON.parse(result.data));
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error getting cache data for ${key}:`, error);
      return null;
    }
  }

  // Activity Management
  async storeActivity(activityData) {
    return await this.dbManager.storeActivity(activityData);
  }

  async getActivities(cognitoId) {
    return await this.dbManager.getActivities(cognitoId);
  }

  // Like Management
  async storeLikeItem(likeData) {
    return await this.dbManager.storeLikeItem(likeData);
  }

  async getLikeItems(cognitoId) {
    return await this.dbManager.getLikeItems(cognitoId);
  }

  // Terms and Conditions
  async storeTermsConditions(terms, policy) {
    return await this.dbManager.storeTermsConditions(terms, policy);
  }

  async getTermsConditions() {
    return await this.dbManager.getTermsConditions();
  }

  // Clear all data (for logout)
  async clearAllData() {
    return await this.dbManager.clearAllData();
  }

  // Data synchronization
  async syncAllData() {
    try {
      console.log('Starting full data sync...');
      
      // Sync user data first
      await this.syncUserData();
      
      // Sync other data in parallel
      await Promise.allSettled([
        this.syncHomeData(),
        this.getBoothsData(),
        this.getEventsData(),
        this.getCouponsData()
      ]);
      
      console.log('Full data sync completed');
    } catch (error) {
      console.error('Error during full data sync:', error);
      throw error;
    }
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
