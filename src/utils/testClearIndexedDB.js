// Test utility to verify IndexedDB clearing functionality
import { clearAllData, getDatabaseStats } from './indexedDB.js';
import { clearAndFetchFreshData } from '../api/home.js';

export const testClearAndFetch = async () => {
  try {
    console.log('🧪 Testing IndexedDB clear and fetch functionality...');
    
    // Get initial database stats
    const initialStats = await getDatabaseStats();
    console.log('📊 Initial database stats:', initialStats);
    
    // Test the clear and fetch function
    const result = await clearAndFetchFreshData();
    
    if (result) {
      console.log('✅ Test successful - Data fetched after clearing IndexedDB');
      
      // Get final database stats
      const finalStats = await getDatabaseStats();
      console.log('📊 Final database stats:', finalStats);
      
      return {
        success: true,
        initialStats,
        finalStats,
        data: result
      };
    } else {
      console.error('❌ Test failed - No data returned');
      return {
        success: false,
        error: 'No data returned from clearAndFetchFreshData'
      };
    }
  } catch (error) {
    console.error('❌ Test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export for use in browser console or other testing
if (typeof window !== 'undefined') {
  window.testClearAndFetch = testClearAndFetch;
}

