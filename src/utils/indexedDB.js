

class IndexedDBManager {
  constructor() {
    this.dbName = 'PerkAppDB';
    this.version = 1;
    this.db = null;
  }

  /**
   * Initialize the IndexedDB database
   * Creates the database and tables if they don't exist
   * @returns {Promise<IDBDatabase>} Database instance
   */
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
        
        // Create UserInfo table for storing user information
        if (!db.objectStoreNames.contains('UserInfo')) {
          const userInfoStore = db.createObjectStore('UserInfo', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          // Create index on email for quick lookups
          userInfoStore.createIndex('email', 'email', { unique: true });
          // Create index on timestamp for sorting
          userInfoStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create GlobalJson table for storing any JSON data
        if (!db.objectStoreNames.contains('GlobalJson')) {
          const globalJsonStore = db.createObjectStore('GlobalJson', { 
            keyPath: 'key' 
          });
          // Create index on timestamp for sorting
          globalJsonStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('IndexedDB tables created successfully');
      };
    });
  }

  /**
   * Get an object store for database operations
   * @param {string} storeName - Name of the object store
   * @param {string} mode - Transaction mode ('readonly' or 'readwrite')
   * @returns {Promise<IDBObjectStore>} Object store instance
   */
  async getStore(storeName, mode = 'readonly') {
    await this.init();
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // ========================================
  // USERINFO TABLE OPERATIONS
  // ========================================

  /**
   * Add a new user to the UserInfo table
   * Deletes all existing users first, then adds the new one
   * @param {Object} userData - User data object
   * @returns {Promise<boolean>} Success status
   */
  async addUserInfo(userData) {
    try {
      // Delegate to the more reliable implementation
      return await this.replaceUserInfo(userData);
    } catch (error) {
      console.error('Error in addUserInfo:', error);
      throw error;
    }
  }

  /**
   * Replace user information (alternative to addUserInfo)
   * Uses put instead of clear+add for better reliability
   * @param {Object} userData - User data object
   * @returns {Promise<boolean>} Success status
   */
  async replaceUserInfo(userData) {
    try {
      await this.init();
      
      // 1) Clear all existing users in its own short-lived transaction
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction(['UserInfo'], 'readwrite');
        const store = tx.objectStore('UserInfo');
        store.clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted while clearing UserInfo'));
      });

      // 2) Add the new user in a fresh transaction (avoid reusing stores across awaits)
      const data = {
        ...userData,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await new Promise((resolve, reject) => {
        const tx = this.db.transaction(['UserInfo'], 'readwrite');
        const store = tx.objectStore('UserInfo');
        store.add(data);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted while adding UserInfo'));
      });

      console.log('UserInfo replaced successfully');
      return true;
    } catch (error) {
      console.error('Error in replaceUserInfo:', error);
      throw error;
    }
  }

  /**
   * Get user information by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User data or null if not found
   */
  async getUserInfoById(id) {
    try {
      const store = await this.getStore('UserInfo');
      
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => {
          const result = request.result;
          console.log('UserInfo retrieved by ID:', result);
          resolve(result || null);
        };
        request.onerror = () => {
          console.error('Error getting UserInfo by ID:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getUserInfoById:', error);
      throw error;
    }
  }

  /**
   * Get user information by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User data or null if not found
   */
  async getUserInfoByEmail(email) {
    try {
      const store = await this.getStore('UserInfo');
      const index = store.index('email');
      
      return new Promise((resolve, reject) => {
        const request = index.get(email);
        request.onsuccess = () => {
          const result = request.result;
          console.log('UserInfo retrieved by email:', result);
          resolve(result || null);
        };
        request.onerror = () => {
          console.error('Error getting UserInfo by email:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getUserInfoByEmail:', error);
      throw error;
    }
  }

  /**
   * Get user information (only one user exists at a time)
   * Returns user data without ID field
   * @returns {Promise<Object|null>} User data or null if not found
   */
  async getUserInfo() {
    try {
      const store = await this.getStore('UserInfo');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result;
          if (results && results.length > 0) {
            // Get the first (and only) user, remove ID field
            const user = results[0];
            const { id, ...userDataWithoutId } = user;
            console.log('UserInfo retrieved (without ID):', userDataWithoutId);
            resolve(userDataWithoutId);
          } else {
            console.log('No UserInfo found');
            resolve(null);
          }
        };
        request.onerror = () => {
          console.error('Error getting UserInfo:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      throw error;
    }
  }

  /**
   * Get all users from the UserInfo table (for internal use)
   * @returns {Promise<Array>} Array of all users with IDs
   */
  async getAllUserInfo() {
    try {
      const store = await this.getStore('UserInfo');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result;
          console.log('All UserInfo retrieved:', results);
          resolve(results || []);
        };
        request.onerror = () => {
          console.error('Error getting all UserInfo:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getAllUserInfo:', error);
      throw error;
    }
  }

  /**
   * Update existing user information
   * @param {number} id - User ID to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<boolean>} Success status
   */
  async editUserInfo(id, updateData) {
    try {
      const store = await this.getStore('UserInfo', 'readwrite');
      
      // First get the existing user data
      const existingUser = await this.getUserInfoById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      const updatedData = {
        ...existingUser,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        const request = store.put(updatedData);
        request.onsuccess = () => {
          console.log('UserInfo updated successfully');
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error updating UserInfo:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in editUserInfo:', error);
      throw error;
    }
  }

  /**
   * Delete user information by ID
   * @param {number} id - User ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteUserInfo(id) {
    try {
      const store = await this.getStore('UserInfo', 'readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => {
          console.log('UserInfo deleted successfully');
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error deleting UserInfo:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in deleteUserInfo:', error);
      throw error;
    }
  }

  /**
   * Clear all user information
   * @returns {Promise<boolean>} Success status
   */
  async clearAllUserInfo() {
    try {
      const store = await this.getStore('UserInfo', 'readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log('All UserInfo cleared successfully');
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error clearing all UserInfo:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in clearAllUserInfo:', error);
      throw error;
    }
  }

  // ========================================
  // GLOBALJSON TABLE OPERATIONS
  // ========================================

  /**
   * Add or update data in the GlobalJson table
   * @param {string} key - Unique key for the data
   * @param {Object} data - JSON data to store
   * @returns {Promise<boolean>} Success status
   */
  async addGlobalJson(key, data) {
    try {
      const store = await this.getStore('GlobalJson', 'readwrite');
      
      const jsonData = {
        key: key,
        data: data,
        timestamp: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        const request = store.put(jsonData);
        request.onsuccess = () => {
          console.log('GlobalJson added/updated successfully:', key);
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error adding/updating GlobalJson:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in addGlobalJson:', error);
      throw error;
    }
  }

  /**
   * Get data from GlobalJson table by key
   * @param {string} key - Key to retrieve
   * @returns {Promise<Object|null>} Stored data or null if not found
   */
  async getGlobalJson(key) {
    try {
      const store = await this.getStore('GlobalJson');
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          console.log('GlobalJson retrieved:', key, result);
          resolve(result ? result.data : null);
        };
        request.onerror = () => {
          console.error('Error getting GlobalJson:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getGlobalJson:', error);
      throw error;
    }
  }

  /**
   * Get all data from GlobalJson table
   * @returns {Promise<Array>} Array of all stored JSON data
   */
  async getAllGlobalJson() {
    try {
      const store = await this.getStore('GlobalJson');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result;
          console.log('All GlobalJson retrieved:', results);
          resolve(results || []);
        };
        request.onerror = () => {
          console.error('Error getting all GlobalJson:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getAllGlobalJson:', error);
      throw error;
    }
  }

  /**
   * Update existing data in GlobalJson table
   * @param {string} key - Key to update
   * @param {Object} newData - New data to store
   * @returns {Promise<boolean>} Success status
   */
  async editGlobalJson(key, newData) {
    try {
      const store = await this.getStore('GlobalJson', 'readwrite');
      
      // First get the existing data
      const existingData = await this.getGlobalJson(key);
      if (existingData === null) {
        throw new Error(`GlobalJson with key ${key} not found`);
      }

      const updatedData = {
        key: key,
        data: newData,
        timestamp: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        const request = store.put(updatedData);
        request.onsuccess = () => {
          console.log('GlobalJson updated successfully:', key);
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error updating GlobalJson:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in editGlobalJson:', error);
      throw error;
    }
  }

  /**
   * Delete data from GlobalJson table by key
   * @param {string} key - Key to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteGlobalJson(key) {
    try {
      const store = await this.getStore('GlobalJson', 'readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => {
          console.log('GlobalJson deleted successfully:', key);
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error deleting GlobalJson:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in deleteGlobalJson:', error);
      throw error;
    }
  }

  /**
   * Clear all data from GlobalJson table
   * @returns {Promise<boolean>} Success status
   */
  async clearAllGlobalJson() {
    try {
      const store = await this.getStore('GlobalJson', 'readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log('All GlobalJson cleared successfully');
          resolve(true);
        };
        request.onerror = () => {
          console.error('Error clearing all GlobalJson:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in clearAllGlobalJson:', error);
      throw error;
    }
  }

  // ========================================
  // UTILITY OPERATIONS
  // ========================================

  /**
   * Clear all data from both tables
   * @returns {Promise<boolean>} Success status
   */
  async clearAllData() {
    try {
      console.log('Clearing all data from IndexedDB...');
      
      await this.clearAllUserInfo();
      await this.clearAllGlobalJson();
      
      console.log('All data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('IndexedDB connection closed');
    }
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database statistics
   */
  async getDatabaseStats() {
    try {
      const userInfoCount = (await this.getAllUserInfo()).length;
      const globalJsonCount = (await this.getAllGlobalJson()).length;
      
      return {
        userInfoCount,
        globalJsonCount,
        totalRecords: userInfoCount + globalJsonCount,
        databaseName: this.dbName,
        version: this.version
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const indexedDBManager = new IndexedDBManager();

export default indexedDBManager;

// ========================================
  // CONVENIENCE EXPORTS
  // ========================================

// Small helper to decode a JWT payload safely (no verification)
const _decodeJwtPayload = (token) => {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
};

// Get token from stored UserInfo
export const getUserToken = async () => {
  const user = await indexedDBManager.getUserInfo();
  return user?.token || null;
};

// Get visitor_id from stored UserInfo (tries user.visitor_id, then user.auto_id, then JWT payload)
export const getVisitorId = async () => {
  const user = await indexedDBManager.getUserInfo();
  if (!user) return null;
  if (user.visitor_id) return user.visitor_id;
  if (user.auto_id) return user.auto_id;
  if (user.token) {
    const payload = _decodeJwtPayload(user.token);
    return payload?.visitor_id || null;
  }
  return null;
};

// UserInfo convenience functions
export const addUserInfo = (userData) => indexedDBManager.addUserInfo(userData);
export const replaceUserInfo = (userData) => indexedDBManager.replaceUserInfo(userData); // Alternative to addUserInfo
export const getUserInfo = () => indexedDBManager.getUserInfo(); // Main function - returns user without ID
export const getUserInfoById = (id) => indexedDBManager.getUserInfoById(id);
export const getUserInfoByEmail = (email) => indexedDBManager.getUserInfoByEmail(email);
export const getAllUserInfo = () => indexedDBManager.getAllUserInfo(); // Internal use only
export const editUserInfo = (id, updateData) => indexedDBManager.editUserInfo(id, updateData);
export const deleteUserInfo = (id) => indexedDBManager.deleteUserInfo(id);
export const clearAllUserInfo = () => indexedDBManager.clearAllUserInfo();

// GlobalJson convenience functions
export const addGlobalJson = (key, data) => indexedDBManager.addGlobalJson(key, data);
export const getGlobalJson = (key) => indexedDBManager.getGlobalJson(key);
export const getAllGlobalJson = () => indexedDBManager.getAllGlobalJson();
export const editGlobalJson = (key, newData) => indexedDBManager.editGlobalJson(key, newData);
export const deleteGlobalJson = (key) => indexedDBManager.deleteGlobalJson(key);
export const clearAllGlobalJson = () => indexedDBManager.clearAllGlobalJson();

// Utility functions
export const clearAllData = () => indexedDBManager.clearAllData();
export const getDatabaseStats = () => indexedDBManager.getDatabaseStats();
export const closeDatabase = () => indexedDBManager.close();
