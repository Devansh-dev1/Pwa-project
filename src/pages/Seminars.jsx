import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imagesURL } from '../api/index.js';
import { handleAllData } from '../api/home.js';
import GlobalLoader from '../components/GlobalLoader.jsx';
import moment from 'moment';

export default function Seminars() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [seminars, setSeminars] = useState([]);
  const [expandedSeminars, setExpandedSeminars] = useState(new Set());

  useEffect(() => {
    const loadSeminars = async () => {
      try {
        // Try to get stored data from IndexedDB first
        const storedData = await getStoredHomeData();
        
        if (storedData && storedData.seminars && storedData.seminars.length > 0) {
          setSeminars(storedData.seminars);
          console.log('✅ Loaded seminars from IndexedDB:', storedData.seminars);
        } else {
          // Fetch fresh data if not available in IndexedDB
          console.log('🔄 No stored data found, fetching fresh data...');
          const freshData = await handleAllData();
          
          if (freshData && freshData.seminars && freshData.seminars.length > 0) {
            setSeminars(freshData.seminars);
            console.log('✅ Fresh seminars data fetched:', freshData.seminars);
          }
        }
      } catch (error) {
        console.error('Error loading seminars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSeminars();
  }, []);

  const toggleSeminarExpansion = (seminarId) => {
    const newExpanded = new Set(expandedSeminars);
    if (newExpanded.has(seminarId)) {
      newExpanded.delete(seminarId);
    } else {
      newExpanded.add(seminarId);
    }
    setExpandedSeminars(newExpanded);
  };

  const handleAddToSchedule = (seminar) => {
    // You can implement schedule functionality here
    console.log('Add to schedule:', seminar);
    alert(`Added "${seminar.title}" to your schedule!`);
  };

  const handleViewDetails = (seminar) => {
    // You can implement detailed view functionality here
    console.log('View details:', seminar);
    // Could navigate to a detailed seminar page or show a modal
  };

  if (loading) {
    return <GlobalLoader visible={true} />;
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#374151',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '700',
          color: '#1E1F24',
          flex: 1,
          textAlign: 'center'
        }}>
          Upcoming Seminars
        </h1>
        <div style={{ width: '40px' }}></div> {/* Spacer for centering */}
      </div>

      {/* Seminars List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        background: '#f8f9fa'
      }}>
        {seminars.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {seminars.map((seminar, index) => {
              const isExpanded = expandedSeminars.has(seminar.auto_id || index);
              const seminarId = seminar.auto_id || index;
              
              return (
                <div key={seminarId} style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {/* Seminar Image */}
                  <div style={{ position: 'relative' }}>
                    {seminar.seminar_img?.[0] ? (
                      <img 
                        src={`${imagesURL}${seminar.seminar_img[0]}/public`} 
                        alt="Seminar"
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '48px', color: '#fff' }}>🎓</span>
                      </div>
                    )}
                    
                    {/* Date Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {seminar.seminar_date ? 
                          moment(seminar.seminar_date).format('D MMM, YYYY') : 
                          'Date TBD'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Seminar Content */}
                  <div style={{ padding: '20px' }}>
                    {/* Title */}
                    <h2 style={{
                      margin: '0 0 12px',
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#1E1F24',
                      lineHeight: '1.3'
                    }}>
                      {seminar.title || 'Seminar Title'}
                    </h2>

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        margin: 0,
                        fontSize: '16px',
                        color: '#4B5563',
                        lineHeight: '1.6',
                        display: isExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: isExpanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: isExpanded ? 'visible' : 'hidden'
                      }}>
                        {seminar.description ? 
                          seminar.description.replace(/<[^>]*>/g, '') : 
                          'Seminar description coming soon. This seminar will provide valuable insights and knowledge in the field.'
                        }
                      </p>
                    </div>

                    {/* Additional Details */}
                    {seminar.speaker && (
                      <div style={{ 
                        background: '#f8f9fa', 
                        borderRadius: '12px', 
                        padding: '16px',
                        marginBottom: '20px'
                      }}>
                        <h4 style={{ 
                          margin: '0 0 8px', 
                          fontSize: '16px', 
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Speaker
                        </h4>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '14px', 
                          color: '#6B7280' 
                        }}>
                          {seminar.speaker}
                        </p>
                      </div>
                    )}

                    {/* Time and Location */}
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: '16px', 
                      marginBottom: '20px',
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>
                      {seminar.seminar_time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>🕒</span>
                          <span>{seminar.seminar_time}</span>
                        </div>
                      )}
                      {seminar.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📍</span>
                          <span>{seminar.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => toggleSeminarExpansion(seminarId)}
                        style={{
                          padding: '12px 24px',
                          background: 'transparent',
                          color: '#3B82F6',
                          border: '2px solid #3B82F6',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: 1,
                          minWidth: '120px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#3B82F6';
                          e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#3B82F6';
                        }}
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                      
                      <button
                        onClick={() => handleAddToSchedule(seminar)}
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: 1,
                          minWidth: '120px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(42, 70, 168, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        Add to Schedule
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6B7280'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎓</div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', color: '#374151' }}>
              No Seminars Available
            </h3>
            <p style={{ margin: 0, fontSize: '16px' }}>
              Check back later for upcoming seminar announcements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
