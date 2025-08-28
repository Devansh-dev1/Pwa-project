# ShowTrail Web App

A fully functional web version of the ShowTrail mobile app, built with React and featuring complete API integration, IndexedDB storage, and mobile-like UI/UX.

## Features

### ✅ Complete Mobile-to-Web Conversion
- **Exact UI/UX Parity**: Every screen matches the mobile app design precisely
- **Responsive Mobile Frame**: Fixed viewport height with centered mobile-width design (430px max)
- **Mobile-like Interactions**: Touch-friendly buttons, modals, and navigation

### ✅ Full API Integration
- **Real Authentication**: Magic link signup/login using production APIs
- **User Data Management**: Fetch and store user profiles from backend
- **Token Management**: JWT token handling with automatic refresh
- **Error Handling**: Comprehensive error states and retry mechanisms

### ✅ IndexedDB Storage (SQLite Replacement)
- **Persistent Storage**: User data, tokens, activity, and preferences
- **Offline Capability**: Data cached locally for offline access
- **Migration Ready**: Easy to extend with additional data tables

### ✅ State Management
- **Zustand Store**: Global state management for user data and app state
- **Real-time Updates**: State syncs across components automatically
- **Persistence**: State persists across browser sessions

### ✅ Mobile-like Components
- **Loading Screens**: Animated spinners with custom messages
- **Modal System**: Native-like modals for confirmations and forms
- **Error Screens**: User-friendly error handling with retry options
- **Magic Link Flow**: Complete email verification workflow

## Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite** - Fast development and build tool
- **Zustand** - Lightweight state management
- **IndexedDB** - Browser-native database
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and Setup**
   ```bash
   cd perkWeb
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## App Flow

### 1. Welcome Screen
- Hero section with app branding
- "Get Started" button leads to onboarding
- "Log In" link for existing users

### 2. Onboarding Flow
- 5-screen interactive tutorial
- Progress bar and navigation
- Skip option available
- Ends with account creation

### 3. Sign In / Magic Link
- Email input with validation
- Real API integration for magic link
- Modal confirmation system
- Guest access option

### 4. Home Dashboard
- User profile display
- Real user data from APIs
- Feature navigation buttons
- Logout functionality

## API Integration

### Authentication Endpoints
- `POST /userCreate` - Magic link signup
- `POST /checkUserShowTrail` - Verify magic link
- `POST /getUserByIdShowtrail` - Get user profile

### Configuration
- **Base URL**: `https://h6wdfhaz34.execute-api.us-east-1.amazonaws.com/dev`
- **Event ID**: `bc2a58dc-e740-4217-b2c0-f06eb3c508fe`
- **Platform**: `showtrail`

## IndexedDB Schema

### Tables
- **Users** - User profile data
- **Tokens** - Authentication tokens
- **Activity** - User activities and interactions
- **LikeItem** - Liked content
- **UserProfile** - Extended profile information
- **Security** - Security preferences
- **TermsConditions** - Legal agreements
- **Coupons** - User coupons and offers
- **Children** - Child profiles (if applicable)

## Mobile-like Features

### Viewport Management
- CSS custom property `--vh` for reliable mobile height
- Fixed viewport prevents browser UI interference
- Responsive design within mobile frame

### Touch Interactions
- Large touch targets (56px minimum)
- Haptic-like button feedback
- Swipe-friendly modal system

### Loading States
- Skeleton screens for content loading
- Animated spinners for API calls
- Progressive data loading

### Error Handling
- Network error detection
- Retry mechanisms
- User-friendly error messages
- Graceful degradation

## Customization

### Styling
- Colors and themes in `src/store/useStore.js`
- Component styles use inline styles for portability
- CSS animations in `src/App.css`

### API Configuration
- Update endpoints in `src/api/index.js`
- Modify authentication flow in `src/api/auth.js`
- Extend IndexedDB schema in `src/utils/indexedDB.js`

### Features
- Add new screens in `src/pages/`
- Create reusable components in `src/components/`
- Extend state management in `src/store/useStore.js`

## Production Deployment

### Build Optimization
```bash
npm run build
```

### Environment Variables
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_EVENT_ID=your-event-id
```

### Hosting Recommendations
- **Vercel** - Automatic deployments with PR previews
- **Netlify** - CDN with form handling
- **AWS S3 + CloudFront** - Enterprise-grade hosting

## Development Tips

### Debugging
- Open browser DevTools → Application → IndexedDB to inspect stored data
- Network tab shows all API calls and responses
- Console logs are comprehensive for troubleshooting

### Testing Flow
1. Start with Welcome screen
2. Go through onboarding
3. Test magic link signup (check network tab)
4. Verify user data persistence
5. Test logout and re-login

### Performance
- IndexedDB operations are asynchronous
- API calls include retry logic
- Images are optimized for mobile viewing
- Bundle size is optimized for fast loading

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify API endpoints are accessible
3. Clear IndexedDB data if needed (DevTools → Application → Storage)
4. Ensure internet connectivity for API calls

---

**Note**: This web app maintains complete feature parity with the mobile version while leveraging modern web technologies for optimal performance and user experience.