import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { getUserData } from '../utils/indexedDB.js';

const BoothCard = ({ booth, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: 12
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        background: 'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: 20 }}>🏪</span>
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: 16, color: '#1E1F24' }}>
          {booth.name || 'Sample Booth'}
        </h4>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#2a46a8', fontWeight: 500 }}>
          Booth #{booth.booth_number || 'A123'}
        </p>
        <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
          {booth.category || 'Technology'}
        </p>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <div style={{
          background: '#f0f9ff',
          color: '#0284c7',
          padding: '4px 8px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 500
        }}>
          Zone {booth.zone || 'A'}
        </div>
      </div>
    </div>
  </div>
);

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => (
  <div style={{ 
    display: 'flex', 
    gap: 8, 
    padding: '0 16px', 
    overflowX: 'auto',
    paddingBottom: 8,
    WebkitOverflowScrolling: 'touch'
  }}>
    <button
      onClick={() => onCategoryChange('all')}
      style={{
        background: selectedCategory === 'all' ? 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)' : '#f8f9fa',
        color: selectedCategory === 'all' ? '#fff' : '#6B7280',
        border: 'none',
        borderRadius: 20,
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      All
    </button>
    {categories.map((category, index) => (
      <button
        key={index}
        onClick={() => onCategoryChange(category)}
        style={{
          background: selectedCategory === category ? 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)' : '#f8f9fa',
          color: selectedCategory === category ? '#fff' : '#6B7280',
          border: 'none',
          borderRadius: 20,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {category}
      </button>
    ))}
  </div>
);

export default function Booths() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booths, setBooths] = useState([]);
  const [filteredBooths, setFilteredBooths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadBooths = async () => {
      try {
        // TODO: Replace with actual API call
        const mockBooths = [
          {
            id: 1,
            name: 'Tech Innovation Hub',
            booth_number: 'A101',
            category: 'Technology',
            zone: 'A',
            company: 'TechCorp',
            description: 'Latest innovations in technology'
          },
          {
            id: 2,
            name: 'Health & Wellness Center',
            booth_number: 'B205',
            category: 'Health',
            zone: 'B',
            company: 'HealthCo',
            description: 'Your health is our priority'
          },
          {
            id: 3,
            name: 'Fashion Forward',
            booth_number: 'C310',
            category: 'Fashion',
            zone: 'C',
            company: 'StyleInc',
            description: 'Latest fashion trends'
          },
          {
            id: 4,
            name: 'Food Paradise',
            booth_number: 'D415',
            category: 'Food',
            zone: 'D',
            company: 'FoodieDelight',
            description: 'Delicious food experiences'
          },
          {
            id: 5,
            name: 'Auto Showcase',
            booth_number: 'A205',
            category: 'Automotive',
            zone: 'A',
            company: 'AutoMax',
            description: 'Latest automotive innovations'
          }
        ];

        setBooths(mockBooths);
        setFilteredBooths(mockBooths);
        
        const uniqueCategories = [...new Set(mockBooths.map(booth => booth.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading booths:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooths();
  }, []);

  useEffect(() => {
    let filtered = booths;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(booth => booth.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(booth =>
        booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.booth_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooths(filtered);
  }, [booths, selectedCategory, searchQuery]);

  const handleBoothClick = (booth) => {
    navigate(`/booths/${booth.id}`, { state: { booth } });
  };

  if (loading) {
    return <LoadingScreen message="Loading booths..." />;
  }

  return (
    <AppLayout>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 16px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#1E1F24' }}>
            Booths
          </h1>
          <div style={{
            background: '#f0f9ff',
            color: '#0284c7',
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500
          }}>
            {filteredBooths.length} found
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search booths, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '0 16px 0 44px',
              fontSize: 16,
              background: '#f8f9fa',
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
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Booths List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 16px 16px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {filteredBooths.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6B7280'
          }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
            <h3 style={{ margin: '0 0 8px', color: '#1E1F24' }}>No booths found</h3>
            <p style={{ margin: 0 }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredBooths.map((booth) => (
            <BoothCard
              key={booth.id}
              booth={booth}
              onClick={() => handleBoothClick(booth)}
            />
          ))
        )}
      </div>
    </AppLayout>
  );
}
