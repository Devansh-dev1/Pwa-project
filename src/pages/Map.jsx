import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

const MapControls = ({ onSearch, onDirections, searchValue, setSearchValue }) => (
  <div style={{
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    zIndex: 10
  }}>
    {/* Search */}
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginBottom: 12
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search for booths, zones..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            width: '100%',
            height: 44,
            border: 'none',
            borderRadius: 12,
            padding: '0 16px 0 44px',
            fontSize: 16,
            outline: 'none'
          }}
        />
        <span style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 16,
          color: '#6B7280'
        }}>
          🔍
        </span>
        {searchValue && (
          <button
            onClick={() => setSearchValue('')}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: 16,
              color: '#6B7280',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>

    {/* Quick Actions */}
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => onDirections()}
        style={{
          background: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 500
        }}
      >
        <span>🧭</span>
        Directions
      </button>
      
      <button
        style={{
          background: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 500
        }}
      >
        <span>📍</span>
        My Location
      </button>
    </div>
  </div>
);

const MapLegend = ({ isOpen, onToggle }) => (
  <div style={{
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    zIndex: 10
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
          color: '#fff',
          border: 'none',
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>Map Legend</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: '#10b981'
            }} />
            <span style={{ fontSize: 14, color: '#1E1F24' }}>Available Booths</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: '#f59e0b'
            }} />
            <span style={{ fontSize: 14, color: '#1E1F24' }}>Busy Booths</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: '#ef4444'
            }} />
            <span style={{ fontSize: 14, color: '#1E1F24' }}>Closed Booths</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#3b82f6'
            }} />
            <span style={{ fontSize: 14, color: '#1E1F24' }}>Your Location</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

const MockMapView = ({ searchValue, onBoothClick }) => {
  const mockBooths = [
    { id: 1, name: 'Tech Hub', x: 100, y: 150, status: 'available', zone: 'A' },
    { id: 2, name: 'Health Center', x: 200, y: 200, status: 'busy', zone: 'B' },
    { id: 3, name: 'Fashion Zone', x: 300, y: 100, status: 'available', zone: 'C' },
    { id: 4, name: 'Food Court', x: 150, y: 300, status: 'closed', zone: 'D' },
    { id: 5, name: 'Auto Show', x: 250, y: 250, status: 'available', zone: 'A' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredBooths = searchValue 
    ? mockBooths.filter(booth => 
        booth.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        booth.zone.toLowerCase().includes(searchValue.toLowerCase())
      )
    : mockBooths;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)',
      overflow: 'hidden'
    }}>
      {/* Grid lines */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3
        }}
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cbd5e1" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Zone labels */}
      <div style={{
        position: 'absolute',
        top: 50,
        left: 50,
        background: 'rgba(42, 70, 168, 0.9)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600
      }}>
        Zone A
      </div>
      
      <div style={{
        position: 'absolute',
        top: 50,
        right: 50,
        background: 'rgba(42, 70, 168, 0.9)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600
      }}>
        Zone C
      </div>

      {/* Your location */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: 50,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#3b82f6',
        border: '3px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        animation: 'pulse 2s infinite'
      }} />

      {/* Booths */}
      {filteredBooths.map((booth) => (
        <div
          key={booth.id}
          onClick={() => onBoothClick(booth)}
          style={{
            position: 'absolute',
            top: booth.y,
            left: booth.x,
            width: 40,
            height: 40,
            borderRadius: 8,
            background: getStatusColor(booth.status),
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            ...(searchValue && booth.name.toLowerCase().includes(searchValue.toLowerCase()) && {
              transform: 'scale(1.2)',
              border: '3px solid #fbbf24',
              boxShadow: '0 4px 16px rgba(251, 191, 36, 0.5)'
            })
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = searchValue && booth.name.toLowerCase().includes(searchValue.toLowerCase()) 
              ? 'scale(1.2)' : 'scale(1)';
          }}
        >
          <span style={{ fontSize: 16, filter: 'brightness(0) invert(1)' }}>🏪</span>
        </div>
      ))}

      {/* Paths/Walkways */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <path
          d="M 80 200 Q 200 100 320 200"
          stroke="#94a3b8"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

export default function Map() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [legendOpen, setLegendOpen] = useState(false);

  useEffect(() => {
    // Simulate loading map data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleBoothClick = (booth) => {
    navigate(`/booths/${booth.id}`, { state: { booth } });
  };

  const handleDirections = () => {
    // TODO: Implement directions functionality
    alert('Directions feature coming soon!');
  };

  if (loading) {
    return <LoadingScreen message="Loading map..." />;
  }

  return (
    <AppLayout>
      <div style={{ position: 'relative', height: '100%' }}>
        {/* Map View */}
        <MockMapView 
          searchValue={searchValue}
          onBoothClick={handleBoothClick}
        />

        {/* Map Controls */}
        <MapControls
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onDirections={handleDirections}
        />

        {/* Map Legend */}
        <MapLegend
          isOpen={legendOpen}
          onToggle={() => setLegendOpen(!legendOpen)}
        />

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
              box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
              box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
