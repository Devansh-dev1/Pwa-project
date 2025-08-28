import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Simple keyboard detection for web - check if window height changed significantly
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      setKeyboardVisible(windowHeight < screenHeight * 0.75);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    {
      name: 'HomeWhileConsideringTheSho',
      path: '/home',
      iconActive: '/assets/ActiveHome.png',
      iconInactive: '/assets/Home.png'
    },
    {
      name: 'MapScreen',
      path: '/map',
      iconActive: '/assets/mapiconbootham.png',
      iconInactive: '/assets/Map.png'
    },
    {
      name: 'MiddleScanner',
      path: '/scanner',
      isSpecial: true
    },
    {
      name: 'PlanVisitFirstTime',
      path: '/plan-visit',
      iconActive: '/assets/Group.png',
      iconInactive: '/assets/Group1.png'
    },
    {
      name: 'BoothHomeWhiteAtOrJoiningTheS',
      path: '/booths',
      iconActive: '/assets/GroupBooth2.png',
      iconInactive: '/assets/GroupBooth.png'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const CustomTabBarButton = ({ children, onPress }) => (
    <button
      onClick={onPress}
      style={{
        position: 'relative',
        bottom: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 6,
        borderStyle: 'solid',
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        display: isKeyboardVisible ? 'none' : 'flex',
        cursor: 'pointer',
        padding: 0,
        outline: 'none'
      }}
    >
      {children}
    </button>
  );

  const TabIcon = ({ tab }) => {
    if (tab.isSpecial) {
      return (
        <CustomTabBarButton onPress={() => navigate(tab.path)}>
          <div
            style={{
              borderRadius: 100,
              padding: 10,
              alignSelf: 'center',
              borderStyle: 'solid',
              borderWidth: 5,
              borderColor: '#ffffff',
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 50,
              background: 'linear-gradient(90deg, #CE8AEE 35%, #9458E2 100%)'
            }}
          >
            <img
              src="/assets/input-fieldiconscanner.png"
              alt="Scanner"
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          </div>
        </CustomTabBarButton>
      );
    }

    const active = isActive(tab.path);
    return (
      <div
        style={{
          width: 60,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
        <img
          src={active ? tab.iconActive : tab.iconInactive}
          alt={tab.name}
          style={{ width: 24, height: 24 }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 12,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
        paddingTop: 30,
        // paddingBottom: 30,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        height: '50px'

        
      }}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => navigate(tab.path)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 0,
            marginHorizontal: 30,
            outline: 'none'
          }}
        >
          <TabIcon tab={tab} />
          {/* Empty label as per mobile app - tabBarLabel: '' */}
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;