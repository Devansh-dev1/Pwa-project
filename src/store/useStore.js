import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // User state
    userInfo: null,
    isAuthenticated: false,
    
    // App state
    loading: false,
    error: null,
    theme: {
      solidsBlackBlack700: '#1E1F24',
      solidsBlackBlack500: '#1E1F24',
      solidsBlackBlack300: '#6B7280',
      solidsBlackBlack200: '#9CA3AF',
      solidsBlackWhite: '#FFFFFF',
      colorDarkslateblue: '#2a46a8',
      colorLavender_200: '#E6E9FA',
      solidsFrenchPinkFrenchPink600: '#dc3545',
      solidsFrenchPinkFrenchPink50: '#fff5f5',
    },

    // Consent data
    consent: [],

    // Plan Visit state
    myDayData: [],
    boothIds: '',

    // Navigation state
    currentScreen: 'welcome',
    screenHistory: [],

    // Actions
    setUserInfo: (userInfo) => set({ userInfo, isAuthenticated: !!userInfo }),
    mergeUserInfo: (partial) => set((state) => ({ userInfo: { ...(state.userInfo || {}), ...(partial || {}) } })),
    
    setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    
    setLoading: (loading) => set({ loading }),
    
    setError: (error) => set({ error }),
    
    setConsent: (consent) => set({ consent }),
    
    // Plan Visit actions
    setMyDayData: (data) => set({ myDayData: data }),
    addToMyDay: (itemId) => set((state) => {
      if (!state.myDayData.includes(itemId)) {
        return { myDayData: [...state.myDayData, itemId] };
      }
      return state;
    }),
    removeFromMyDay: (itemId) => set((state) => ({
      myDayData: state.myDayData.filter(id => id !== itemId)
    })),
    setBoothIds: (ids) => set({ boothIds: ids }),
    
    navigateToScreen: (screen) => set((state) => ({
      screenHistory: [...state.screenHistory, state.currentScreen],
      currentScreen: screen
    })),
    
    goBack: () => set((state) => {
      if (state.screenHistory.length > 0) {
        const previousScreen = state.screenHistory[state.screenHistory.length - 1];
        const newHistory = state.screenHistory.slice(0, -1);
        return {
          currentScreen: previousScreen,
          screenHistory: newHistory
        };
      }
      return state;
    }),
    
    resetNavigation: () => set({
      currentScreen: 'welcome',
      screenHistory: []
    }),

    // Clear all user data (for logout)
    clearUserData: () => set({
      userInfo: null,
      isAuthenticated: false,
      consent: [],
      myDayData: [],
      boothIds: '',
      currentScreen: 'welcome',
      screenHistory: []
    }),

    // Initialize app state
    initializeApp: async () => {
      set({ loading: true });
      try {
        // This would typically load user data, check auth, etc.
        // For now, we'll just set loading to false
        set({ loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  }))
);

export default useStore;
