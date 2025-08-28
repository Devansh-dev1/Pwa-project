import axios from 'axios';
import { getToken } from '../utils/indexedDB.js';

// Production Client Configuration
export let EVENT_ID = 'bc2a58dc-e740-4217-b2c0-f06eb3c508fe';
export let STATIC_ID = EVENT_ID;

export let URL = 'https://h6wdfhaz34.execute-api.us-east-1.amazonaws.com/dev';
export let consentUrl = 'https://srbu6brj51.execute-api.us-east-1.amazonaws.com/dev/consent/bc2a58dc-e740-4217-b2c0-f06eb3c508fe';

export let imageURL = 'https://omou36mbo1.execute-api.us-east-1.amazonaws.com/dev';
export let imagesURL = 'https://imagedelivery.net/droh--rvkvo7IkO_o-KYsQ/appImages/';
export let profileImageUrl = 'https://perksevent.s3.amazonaws.com/profileImg/';

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback token for development
      const fallbackToken = 'eyJraWQiOiI1MWdiQVJGMXB5ejlRZldETlBicUZOaXBQNDBBTFQzaVpZd3hwU1BXSEg4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyNDU4ODQ3OC1jMDYxLTcwMzctODZiMC0yYjJlNThiOWIwMjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9CRFBINnBsRGwiLCJjbGllbnRfaWQiOiIyb3M5MGZmb2p0MHYwaXJiNmpiMGprY2FrZSIsIm9yaWdpbl9qdGkiOiJmZjhmMmIwOS02NjljLTRiYzItYWI2Ni0yYjlmNTAyNzI3YjAiLCJldmVudF9pZCI6IjYzOTllMGI3LTVmYzAtNDllNS05MDI3LTExNWFkZWRjNzZhMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3Mjk1MTQwMjAsImV4cCI6MTcyOTUxNzYyMCwiaWF0IjoxNzI5NTE0MDIwLCJqdGkiOiIzYmFmZGM3Zi0yZmFkLTRkZjYtOTM1Mi1mM2JmNDZhYTVhMjQiLCJ1c2VybmFtZSI6IjI0NTg4NDc4LWMwNjEtNzAzNy04NmIwLTJiMmU1OGI5YjAyOCJ9.AVWqAjybrvzf2Hpd_rTdZr7GwVBEyykp-Bi3ALUbX-deTUJ7eiG4lZptz7IOIsM83h700RwX5XtyCBzz8VlJaYzN2LqHqu1kqEPWV4Xrw9sIm20foLdY3AscoaCR8z9ki941k0ZaIEgokHFOIFPc2dqz9HrvdE9VeeR4okD5q31o-XrhKFdWQfLpYKO13xNp396moFp1UMgT7Ut0_I5-BbGdGhUzw4jM8c1k5Ap2CYM35mXUcqMrTdkb13QUMHnsLYXtkiDGA7UPwfdRFhSV9fSR9C14ofD-adSzQNrAn_jv0EGKAjb2ZUmWH7qHcHOIolsSa0fzrWJnifDQvE-oVg';
      config.headers.Authorization = `Bearer ${fallbackToken}`;
    }
  } catch (error) {
    console.error('Error getting token for request:', error);
  }
  
  return config;
});

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication error, token may be expired');
      // Could trigger logout here if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
