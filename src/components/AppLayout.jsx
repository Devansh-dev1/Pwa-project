import BottomNavigation from './BottomNavigation.jsx';

const AppLayout = ({ children, hideBottomNav = false }) => {
  return (
    <div 
    style={{ overflowY: 'auto' }}
    className="mobile-frame-container">
      <div className="111 screen-container" style={{
        position: 'relative'
      }}>
        {/* Main content area */}
        <div style={{
          height: '100%',
          paddingBottom: hideBottomNav ? 0 : 110, // Space for bottom nav
          overflow: 'hidden',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          {children}
        </div>
        
        {/* Bottom Navigation */}
        {!hideBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
};

export default AppLayout;
