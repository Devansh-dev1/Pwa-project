# IndexedDB Implementation for Home Data Storage

## Overview
This implementation provides a robust IndexedDB storage solution for the home page data (jsonData) in the PWA project. The system automatically stores data when fetched from the API and retrieves it for offline access.

## Features

### 1. New HomeData Table
- **Table Name**: `HomeData`
- **Purpose**: Stores home page data with automatic cleanup of old values
- **Key Features**:
  - Auto-incrementing ID
  - Timestamp tracking
  - Data type categorization
  - Automatic old data deletion before storing new data

### 2. Core Functions

#### Storage Functions
- `storeHomeData(homeData, dataType)` - Stores home data, automatically clears old data first
- `getHomeData(dataType)` - Retrieves the most recent data of specified type
- `clearAllHomeData()` - Clears all stored home data
- `updateHomeData(id, newData, dataType)` - Updates existing data
- `deleteHomeData(id)` - Deletes specific data entry

#### Utility Functions
- `getDatabaseStats()` - Returns database statistics
- `clearAllData()` - Clears all data from all tables

### 3. API Integration

#### Updated Files:
1. **`src/utils/indexedDB.js`** - Added HomeData table and functions
2. **`src/api/home.js`** - Updated to use IndexedDB storage
3. **`src/pages/Home.jsx`** - Updated to use IndexedDB instead of localStorage
4. **`src/pages/Speakers.jsx`** - Updated to use IndexedDB
5. **`src/pages/Seminars.jsx`** - Updated to use IndexedDB
6. **`src/pages/Booths.jsx`** - Updated to use IndexedDB
7. **`src/pages/PlanVisit.jsx`** - Updated to use IndexedDB
8. **`src/pages/TipsDetails.jsx`** - Updated to use IndexedDB

## Usage

### Storing Data
```javascript
import { storeHomeData } from '../api/home.js';

// Data is automatically stored when handleAllData() is called
const data = await handleAllData(); // This now stores data in IndexedDB
```

### Retrieving Data
```javascript
import { getStoredHomeData } from '../api/home.js';

const storedData = await getStoredHomeData();
if (storedData) {
  // Use the stored data
  setHomeData(storedData);
}
```

### Clearing Data
```javascript
import { clearStoredHomeData } from '../api/home.js';

await clearStoredHomeData(); // Clears all stored home data
```

## Data Flow

1. **First Load**: 
   - Check IndexedDB for stored data
   - If found, use stored data
   - If not found, fetch from API and store in IndexedDB

2. **Subsequent Loads**:
   - Always check IndexedDB first
   - Use stored data for immediate display
   - Optionally fetch fresh data in background

3. **Data Updates**:
   - When new data is fetched, old data is automatically deleted
   - New data is stored with timestamp
   - Most recent data is always retrieved

## Benefits

1. **Offline Access**: Data is available even without internet connection
2. **Performance**: Faster loading using cached data
3. **Automatic Cleanup**: Old data is automatically removed when new data is stored
4. **Reliability**: IndexedDB is more reliable than localStorage for large data
5. **Type Safety**: Data is categorized by type for better organization

## Testing

A test file is available at `src/utils/testIndexedDB.js` to verify the implementation:

```javascript
import { testIndexedDB } from '../utils/testIndexedDB.js';

// Run tests in browser console
await testIndexedDB();
```

## Migration from localStorage

The implementation automatically migrates from localStorage to IndexedDB:
- Old localStorage data is ignored
- New data is stored in IndexedDB
- All pages now use IndexedDB for data retrieval

## Error Handling

- Graceful fallback if IndexedDB is not available
- Console logging for debugging
- Error recovery mechanisms
- Data validation before storage

## Browser Compatibility

- Modern browsers with IndexedDB support
- Graceful degradation for older browsers
- Automatic fallback to API calls if IndexedDB fails
