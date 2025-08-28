import { getToken as getTokenFromDB, storeToken, deleteToken } from './indexedDB.js';

export async function getToken() {
  try {
    return await getTokenFromDB();
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export async function setToken(token) {
  try {
    await storeToken(token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
}

export async function clearToken() {
  try {
    await deleteToken();
  } catch (error) {
    console.error('Error clearing token:', error);
  }
}



