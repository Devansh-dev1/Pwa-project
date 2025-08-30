import axiosInstance, { EVENT_ID, URL } from './index.js';

// Utility function to decode JWT token
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Magic link signup/login
export const linkSignup = async (email) => {
  try {
    const response = await axiosInstance.post('/userCreate', {
      username: email,
      platformKey: 'showtrail',
      address:'local'  //webside ||local
    });
    console.log('Create user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.response) {
      console.error('Server error:', error.response.data);
    }
    throw error;
  }
};

// Check user from magic link token
export const signfromTokenUser = async (data) => {
  try {
    const payload = {
      auto_id: data.email,
      code: data.code,
    };

    if (data.times === 'first_time') {
      payload.first_time = true;
    } else if (data.times === 'second_time') {
      payload.second_time = true;
    }

    console.log('Checking user with payload:', payload);

    const response = await axiosInstance.post('/checkUserShowTrail', payload);
    console.log('Check user response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
};

// Get user info by visitor ID
export const getUserInfo = async (forceRefresh = false) => {
  try {
    // const token = await getToken();
      const userInfo = await getUserInfo()

    
    console.log('userInfouserInfouserInfouserInfouserInfo',userInfo?.visitor_id,userInfo)
    
   

    const response = await axiosInstance.post('/getUserByIdShowtrail', {
      show_id: EVENT_ID,
      auto_id: userInfo?.auto_id,
      showtrail: true
    }, {
      headers: {
        'Authorization': `Bearer ${userInfo?.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const jsonData = response.data?.result;
   
    // if (jsonData?.visitor_id) {
    //   jsonData.auto_id = jsonData.visitor_id;
    //   delete jsonData.visitor_id;
    // }
    // if (jsonData?.cognito_id) {
    //   jsonData.sub = jsonData.cognito_id;
    //   delete jsonData.cognito_id;
    // }

    // console.log('User data fetched from server');

    // // Store in IndexedDB
    // if (jsonData) {
    //   await storeUserData(jsonData);
    // }

    return jsonData;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// Handle login with email
export const handleLogin = async (email) => {
  const password = 'securepassword';

  try {
    const response = await axiosInstance.post('/login', {
      email: email,
      password: password,
    });

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Handle user registration
export const handleRegister = async (email) => {
  const password = 'securepassword';

  try {
    const response = await axiosInstance.post('/signup', {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Handle checking login user
export const handleCheckingLoginUser = async ({ email, option }) => {
  try {
    const response = await axiosInstance.post('/registerfromLinkUser', {
      email: email,
      familyOne: option
    });
    return response.data;
  } catch (error) {
    console.error('Error checking login user:', error);
    throw error;
  }
};

// Get user by email
export const handleGetUserInfo = async (email) => {
  try {
    console.log('handleGetUserInfo called with email:', email);
    const response = await axiosInstance.post('/getUser', {
      email: email,
    });

    console.log('handleGetUserInfo response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

// Update user details
export const handleUpdateUserDetail = async (data) => {
  try {
    const response = await axiosInstance.post('/updateUser', data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Send OTP
export const sendOTP = async (phone, subId) => {
  try {
    const token = ''
    if (!token) {
      return {
        statusCode: 401,
        error: 'No authentication token available',
        body: JSON.stringify({ message: 'Please login first' })
      };
    }

    const decodedToken = decodeToken(token);
    const visitorId = decodedToken?.visitor_id;

    if (!visitorId) {
      return {
        statusCode: 400,
        error: 'Invalid token: missing visitor_id',
        body: JSON.stringify({ message: 'Token does not contain visitor_id' })
      };
    }

    console.log('Sending OTP with visitor_id:', visitorId);

    const response = await axiosInstance.post('/sendPhoneOtp', {
      phone_number: phone,
      visitor_id: visitorId,
      ChannelType: "SMS"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('OTP send response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      statusCode: 500,
      error: error.message || 'Unknown error during OTP send',
      body: JSON.stringify({ message: error.message })
    };
  }
};

// Verify OTP
export const verifyOTP = async (phone, otp, subId) => {
  try {
    const token = ''//();
    if (!token) {
      return {
        success: false,
        error: 'No authentication token available',
        body: JSON.stringify({ message: 'Please login first' })
      };
    }

    const decodedToken = decodeToken(token);
    const visitorId = decodedToken?.visitor_id;

    if (!visitorId) {
      return {
        success: false,
        error: 'Invalid token: missing visitor_id',
        body: JSON.stringify({ message: 'Token does not contain visitor_id' })
      };
    }

    console.log('Verifying OTP with visitor_id:', visitorId);

    const response = await axiosInstance.post('/verifyPhoneOtp', {
      phone_number: phone,
      visitor_id: visitorId,
      otp: otp,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('OTP verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during OTP verification',
      body: JSON.stringify({ message: error.message })
    };
  }
};

// Handle user deletion
export const handleUserDelete = async (email) => {
  try {
    const response = await axiosInstance.post('/deleteUser', {
      email: email,
      showtrail: true,
    });
    console.log('User delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Sync user data
export const syncUserData = async (data) => {
  try {
    if (!data?.records) {
      return {};
    }

    // Remove sensitive fields
    delete data?.records[0]?.single_child;

    let addVersion = data?.records[0]?.version ? Number(data?.records[0]?.version) + 1 : 1;
    let finalData = {
      ...data,
      records: data?.records.map(record => ({
        ...record,
        version: addVersion,
      })),
    };

   // await storeUserData(finalData?.records[0]);
    console.log('User data stored locally in IndexedDB successfully',finalData)
    
    const response = await axiosInstance.post('/ShowTrailSync/sync-data', finalData);
    
    // Trigger user data update
    axiosInstance.post('/UserDataUpdateShowtrail');
    
    return response.data;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};

// Activity sync
export const syncActivityData = async (data) => {
  if (!data) {
    return {};
  }
  
  const payload = {
    "records": [data],
    "show_id": EVENT_ID
  };

  try {
    const updateData = await syncUserData(payload);
    return updateData;
  } catch (error) {
    if (error?.request) {
      console.error('Network error:', error.request);
      return data;
    } else {
      console.error('Error:', error.message);
      return data;
    }
  }
};

// Logout
export const logout = async () => {
  try {
    // await deleteToken();
    // Could also clear other user data if needed
    console.log('User logged out successfully');
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

// Fetch personalized data - exact mobile app API
export const fetchPersonalizedData = async (userId, type, boothIds = '', limit = 20) => {
  try {
    const token = ''//await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const params = {
      userId,
      type,
      limit
    };

    if (boothIds) {
      params.boothIds = boothIds;
    }

    const response = await axiosInstance.get('/personalized-data', { 
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Fetch personalized data error:', error);
    return [];
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = ''//await getToken();
    if (!token) return false;
    
    const decodedToken = decodeToken(token);
    if (!decodedToken) return false;
    
    // Check if token is expired
    const now = Date.now() / 1000;
    if (decodedToken.exp < now) {
      // await deleteToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
