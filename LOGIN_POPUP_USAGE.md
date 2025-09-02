# Global Login Popup Component

This document explains how to use the global login popup component that appears when unauthenticated users try to access protected features.

## Overview

The global login popup is a reusable component that can be triggered from anywhere in the app when a user needs to be authenticated to perform an action.

## Components Created

1. **LoginPopup.jsx** - The main popup component
2. **LoginPopup.css** - Styling for the popup
3. **authUtils.js** - Utility functions for authentication checks
4. **Updated useStore.js** - Added state management for the popup

## How to Use

### 1. Basic Usage

```javascript
import { requireAuth } from '../utils/authUtils.js';

// In your component
const handleProtectedAction = () => {
  requireAuth(() => {
    // This code will run after user logs in or skips
    console.log('User is authenticated, performing action...');
    // Your protected action here
  });
};
```

### 2. Example: Profile Button Click

```javascript
// In Home.jsx or any other component
onClick={() => {
  requireAuth(() => navigate('/profile'))
}}
```

### 3. Example: Like Button

```javascript
const handleLike = () => {
  requireAuth(() => {
    // User is authenticated, proceed with like action
    likeItem(itemId);
  });
};
```

### 4. Example: Save to My Day

```javascript
const handleSaveToMyDay = () => {
  requireAuth(() => {
    // User is authenticated, save to my day
    addToMyDay(itemId);
  });
};
```

## How It Works

1. **Authentication Check**: The `requireAuth` function checks if the user is authenticated by looking at their stored user data.

2. **Popup Display**: If the user is not authenticated, it shows the login popup.

3. **User Actions**: The user can either:
   - Enter their email and continue (sends magic link)
   - Skip (creates a guest account)
   - Close the popup

4. **Callback Execution**: After successful login/skip, the provided callback function is executed.

## Features

- **Responsive Design**: Works on mobile and desktop
- **Magic Link Integration**: Uses existing magic link system
- **Guest Mode**: Allows users to skip and continue as guest
- **Global State**: Managed through Zustand store
- **Reusable**: Can be called from any component

## State Management

The popup state is managed in the global store:

```javascript
// Store state
showLoginPopup: false,
loginPopupCallback: null,

// Actions
showLoginPopup: (callback = null) => set({ 
  showLoginPopup: true, 
  loginPopupCallback: callback 
}),
hideLoginPopup: () => set({ 
  showLoginPopup: false, 
  loginPopupCallback: null 
}),
```

## Styling

The popup matches the design shown in the image with:
- Dark overlay with blur effect
- White rounded modal
- Purple gradient header with user icon
- Blue gradient continue button
- White outlined skip button
- Responsive design for mobile

## Integration Points

The popup is integrated into:
- **App.jsx**: Added as a global component
- **Home.jsx**: Profile button now uses requireAuth
- **Store**: Added popup state management
- **Auth Utils**: Created utility functions

## Future Enhancements

You can easily extend this system by:
1. Adding more authentication methods
2. Customizing the popup content per use case
3. Adding analytics tracking
4. Implementing different popup styles for different actions
