import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDLnPj2sS9YTjy0auVzciykRPsmMYOnBIs",
  authDomain: "showtrail-app.firebaseapp.com",
  projectId: "showtrail-app",
  storageBucket: "showtrail-app.firebasestorage.app",
  messagingSenderId: "779203684210",
  appId: "1:779203684210:web:e4f29bd9de3bf323205feb",
  measurementId: "G-E3GT29DLWK",
  databaseURL: "https://showtrail-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('Firebase messaging not available:', error);
}

// Initialize Analytics
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.log('Firebase analytics not available:', error);
}

// FCM Token and messaging functions
export const requestFCMPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BHdBpI8bTYcQjOhWGU6FXHM6SAQrN5_HzYhM7-e5tFOTkTpYZLQkW3XBOV-fF7m0YWm5wH7RRfS3S5NvlJ2LPqM'
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const onMessageListener = () => {
  if (!messaging) return Promise.resolve();
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export { messaging, analytics };
export default app;
