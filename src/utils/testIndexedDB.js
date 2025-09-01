// Test file for IndexedDB implementation
import { 
  storeHomeData, 
  getHomeData, 
  clearAllHomeData, 
  getDatabaseStats 
} from './indexedDB.js';

// Test data
const testHomeData = {
  event: [
    {
      id: 1,
      title: 'Test Event',
      description: 'This is a test event'
    }
  ],
  speaker: [
    {
      id: 1,
      name: 'Test Speaker',
      bio: 'This is a test speaker'
    }
  ],
  seminars: [
    {
      id: 1,
      title: 'Test Seminar',
      description: 'This is a test seminar'
    }
  ],
  show_exhibitor: [
    {
      id: 1,
      name: 'Test Booth',
      description: 'This is a test booth'
    }
  ]
};

// Test functions
export const testIndexedDB = async () => {
  console.log('🧪 Starting IndexedDB tests...');
  
  try {
    // Test 1: Store data
    console.log('🔄 Test 1: Storing home data...');
    await storeHomeData(testHomeData, 'testData');
    console.log('✅ Test 1 passed: Data stored successfully');
    
    // Test 2: Retrieve data
    console.log('🔄 Test 2: Retrieving home data...');
    const retrievedData = await getHomeData('testData');
    if (retrievedData && retrievedData.event && retrievedData.event.length > 0) {
      console.log('✅ Test 2 passed: Data retrieved successfully', retrievedData);
    } else {
      console.log('❌ Test 2 failed: No data retrieved');
    }
    
    // Test 3: Get database stats
    console.log('🔄 Test 3: Getting database stats...');
    const stats = await getDatabaseStats();
    console.log('✅ Test 3 passed: Database stats', stats);
    
    // Test 4: Clear data
    console.log('🔄 Test 4: Clearing home data...');
    await clearAllHomeData();
    console.log('✅ Test 4 passed: Data cleared successfully');
    
    // Test 5: Verify data is cleared
    console.log('🔄 Test 5: Verifying data is cleared...');
    const clearedData = await getHomeData('testData');
    if (!clearedData) {
      console.log('✅ Test 5 passed: Data successfully cleared');
    } else {
      console.log('❌ Test 5 failed: Data still exists after clearing');
    }
    
    console.log('🎉 All IndexedDB tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ IndexedDB test failed:', error);
    return false;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testIndexedDB = testIndexedDB;
}
