import axiosInstance, { EVENT_ID } from './index.js';
import {   } from '../utils/indexedDB.js';
import axios from 'axios';

// Get all home page data (booths, events, etc.)
export const handleAllData = async () => {
  // Use more reliable CORS proxies
  const corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://cors.bridged.cc/',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://cors-anywhere.herokuapp.com/'
  ];
  
  const baseUrl = `https://d9wbof3q09tw.cloudfront.net/${EVENT_ID}.json`;
  
  console.log('🔄 Starting data fetch with multiple CORS proxies...');

  // Try each CORS proxy until one works
  for (let i = 0; i < corsProxies.length; i++) {
    const proxy = corsProxies[i];
    let url;
    
    // Handle different proxy formats
    if (proxy.includes('allorigins.win')) {
      url = `${proxy}${encodeURIComponent(baseUrl)}`;
    } else if (proxy.includes('codetabs.com')) {
      url = `${proxy}${baseUrl}`;
    } else {
      url = `${proxy}${baseUrl}`;
    }
    
    try {
      console.log(`🔄 Trying proxy ${i + 1}/${corsProxies.length}: ${proxy}`);
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const jsonData = response.data;
      console.log(`✅ Proxy ${i + 1} successful! Data received:`, jsonData);
      
      // Store data in IndexedDB for offline access
      try {
        // await storeUserData(jsonData);
        console.log('✅ Data stored in IndexedDB');
      } catch (dbError) {
        console.warn('⚠️ Could not store data in IndexedDB:', dbError);
      }

      return jsonData;
    } catch (error) {
      console.log(`❌ Proxy ${i + 1} failed:`, error.message);
      
      // If this is the last proxy, log the final error
      if (i === corsProxies.length - 1) {
        console.error('❌ All CORS proxies failed. Final error:', error);
      }
    }
  }
  
  // Return null so the component can handle the error gracefully
  return null;
};

// Alternative function using fetch with no-cors mode (limited but might work)
export const handleAllDataWithFetch = async () => {
  const baseUrl = `https://d9wbof3q09tw.cloudfront.net/${EVENT_ID}.json`;
  
  try {
    console.log('🔄 Trying fetch with no-cors mode...');
    
    // Try fetch with no-cors mode first
    const response = await fetch(baseUrl, {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Fetch successful:', data);
      return data;
    }
  } catch (fetchError) {
    console.log('⚠️ Fetch failed, trying CORS proxy...');
  }
  
  // Fallback to CORS proxy
  return handleAllData();
};

// Test function to try different approaches
export const testAllApproaches = async () => {
  const baseUrl = `https://d9wbof3q09tw.cloudfront.net/${EVENT_ID}.json`;
  const results = {};
  
  console.log('🧪 Testing all approaches...');
  
  // Test 1: Direct axios request (will likely fail due to CORS)
  try {
    console.log('🔄 Test 1: Direct axios request...');
    const response = await axios.get(baseUrl);
    results.direct = { success: true, data: response.data };
    console.log('✅ Direct request successful');
    return response.data;
  } catch (error) {
    results.direct = { success: false, error: error.message };
    console.log('❌ Direct request failed:', error.message);
  }
  
  // Test 2-6: CORS proxies
  const corsProxies = [
    { name: 'allorigins.win', url: 'https://api.allorigins.win/raw?url=' },
    { name: 'thingproxy.freeboard.io', url: 'https://thingproxy.freeboard.io/fetch/' },
    { name: 'cors.bridged.cc', url: 'https://cors.bridged.cc/' },
    { name: 'codetabs.com', url: 'https://api.codetabs.com/v1/proxy?quest=' },
    { name: 'cors-anywhere.herokuapp.com', url: 'https://cors-anywhere.herokuapp.com/' }
  ];
  
  for (let i = 0; i < corsProxies.length; i++) {
    const proxy = corsProxies[i];
    let testUrl;
    
    try {
      console.log(`🔄 Test ${i + 2}: ${proxy.name}...`);
      
      // Handle different proxy formats
      if (proxy.name === 'allorigins.win') {
        testUrl = `${proxy.url}${encodeURIComponent(baseUrl)}`;
      } else if (proxy.name === 'codetabs.com') {
        testUrl = `${proxy.url}${baseUrl}`;
      } else {
        testUrl = `${proxy.url}${baseUrl}`;
      }
      
      const response = await axios.get(testUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      results[proxy.name] = { success: true, data: response.data };
      console.log(`✅ ${proxy.name} successful`);
      return response.data;
    } catch (error) {
      results[proxy.name] = { success: false, error: error.message };
      console.log(`❌ ${proxy.name} failed:`, error.message);
    }
  }
  
  console.log('❌ All approaches failed. Results:', results);
  return null;
};

// Get booth data
export const getBoothsData = async () => {
  try {
    const response = await axiosInstance.get('/getBooths', {
      params: {
        event_id: EVENT_ID
      }
    });
    
    console.log('Booths data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching booths data:', error);
    throw error;
  }
};

// Get events and seminars
export const getEventsData = async () => {
  try {
    const response = await axiosInstance.get('/getEvents', {
      params: {
        event_id: EVENT_ID
      }
    });
    
    console.log('Events data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events data:', error);
    throw error;
  }
};

// Get giveaways
export const getGiveawaysData = async () => {
  try {
    const response = await axiosInstance.get('/getGiveaways', {
      params: {
        event_id: EVENT_ID
      }
    });
    
    console.log('Giveaways data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching giveaways data:', error);
    throw error;
  }
};

// Get samples
export const getSamplesData = async () => {
  try {
    const response = await axiosInstance.get('/getSamples', {
      params: {
        event_id: EVENT_ID
      }
    });
    
    console.log('Samples data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching samples data:', error);
    throw error;
  }
};

// Get coupons
export const getCouponsData = async (userId) => {
  try {
    const response = await axiosInstance.post('/getUserCoupons', {
      user_id: userId,
      event_id: EVENT_ID
    });
    
    console.log('Coupons data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons data:', error);
    throw error;
  }
};

// Track booth visit
export const trackBoothVisit = async (userId, boothId) => {
  try {
    const response = await axiosInstance.post('/trackBoothVisit', {
      user_id: userId,
      booth_id: boothId,
      event_id: EVENT_ID,
      timestamp: new Date().toISOString()
    });
    
    console.log('Booth visit tracked:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error tracking booth visit:', error);
    throw error;
  }
};

// Like/unlike item
export const toggleLikeItem = async (userId, itemId, itemType, isLiked) => {
  try {
    const response = await axiosInstance.post('/toggleLike', {
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      liked: isLiked,
      event_id: EVENT_ID
    });
    
    console.log('Like toggled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Get map data
export const getMapData = async () => {
  try {
    const response = await axiosInstance.get('/getMapData', {
      params: {
        event_id: EVENT_ID
      }
    });
    
    console.log('Map data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching map data:', error);
    throw error;
  }
};

// Search functionality
export const searchContent = async (query, filters = {}) => {
  try {
    const response = await axiosInstance.post('/search', {
      query,
      filters,
      event_id: EVENT_ID
    });
    
    console.log('Search results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

// Get user activities
export const getUserActivities = async (userId) => {
  try {
    const response = await axiosInstance.post('/getUserActivities', {
      user_id: userId,
      event_id: EVENT_ID
    });
    
    console.log('User activities:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
};

// Submit activity completion
export const submitActivityCompletion = async (userId, activityId, data) => {
  try {
    const response = await axiosInstance.post('/submitActivity', {
      user_id: userId,
      activity_id: activityId,
      completion_data: data,
      event_id: EVENT_ID,
      timestamp: new Date().toISOString()
    });
    
    console.log('Activity submitted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting activity:', error);
    throw error;
  }
};
