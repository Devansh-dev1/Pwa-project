import axiosInstance, { EVENT_ID } from './index.js';
import { getUserData, storeUserData } from '../utils/indexedDB.js';

// Get all home page data (booths, events, etc.)
export const handleAllData = async (userId) => {
  try {
    const response = await axiosInstance.post('/getAllData', {
      user_id: userId,
      event_id: EVENT_ID
    });
    
    console.log('Home data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
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
