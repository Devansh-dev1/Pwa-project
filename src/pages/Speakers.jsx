import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imagesURL } from '../api/index.js';
import { handleAllData } from '../api/home.js';
import AppLayout from '../components/AppLayout.jsx';
import GlobalLoader from '../components/GlobalLoader.jsx';

export default function Speakers() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [speakers, setSpeakers] = useState([]);
  const [expandedSpeakers, setExpandedSpeakers] = useState(new Set());

  useEffect(() => {
    const loadSpeakers = async () => {
      try {
        // Try to get existing data from localStorage
        const existingData = localStorage.getItem('homeData');
        if (existingData) {
          const parsedData = JSON.parse(existingData);
          if (parsedData.speaker && parsedData.speaker.length > 0) {
            setSpeakers(parsedData.speaker);
          }
        } else {
          // Fetch fresh data if not available
          const freshData = await handleAllData();
          if (freshData.speaker && freshData.speaker.length > 0) {
            setSpeakers(freshData.speaker);
            localStorage.setItem('homeData', JSON.stringify(freshData));
          }
        }
      } catch (error) {
        console.error('Error loading speakers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpeakers();
  }, []);

  const toggleSpeakerExpansion = (speakerId) => {
    const newExpanded = new Set(expandedSpeakers);
    if (newExpanded.has(speakerId)) {
      newExpanded.delete(speakerId);
    } else {
      newExpanded.add(speakerId);
    }
    setExpandedSpeakers(newExpanded);
  };

  const handleSocialMediaClick = (platform, url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.log(`${platform} link not available`);
    }
  };

  if (loading) {
    return <GlobalLoader visible={true} />;
  }

  return (
    <AppLayout>
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
          Speaker List
        </h1>
        <div style={{ width: '40px' }}></div> {/* Spacer for centering */}
      </div>

      {/* Speakers List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        background: '#f8f9fa'
      }}>
        {speakers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {speakers.map((speaker, index) => {
              const isExpanded = expandedSpeakers.has(speaker.auto_id || index);
              const speakerId = speaker.auto_id || index;
              
              return (
                <div key={speakerId} style={{
                  background: '#fff',
                  border: '1px solid #3B82F6',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {/* Speaker Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    {/* Profile Picture */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '3px solid #e5e7eb'
                    }}>
                      {speaker.image ? (
                        <img
                          src={`${imagesURL}${speaker.image}/public`}
                          alt={speaker.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px'
                        }}>
                          👤
                        </div>
                      )}
                    </div>

                    {/* Name and Title */}
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        margin: 0,
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#1E1F24',
                        marginBottom: '4px'
                      }}>
                        {speaker.name || 'Speaker Name'}
                      </h2>
                      {speaker.short_description && (
                        <p style={{
                          margin: 0,
                          fontSize: '16px',
                          color: '#6B7280',
                          fontWeight: '500'
                        }}>
                          {speaker.short_description}
                        </p>
                      )}
                    </div>
                  </div>

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
                      {speaker.long_description ? 
                        speaker.long_description.replace(/<[^>]*>/g, '') : 
                        speaker.short_description || 
                        speaker.description || 
                        speaker.bio || 
                        speaker.about || 
                        'Speaker description coming soon. This speaker will provide valuable insights and expertise in their field.'}
                    </p>
                  </div>

                  {/* Tags */}
                  {speaker.tags && speaker.tags.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{
                        margin: '0 0 12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Tags
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {speaker.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            {typeof tag === 'object' && tag.tag_name ? tag.tag_name : 
                             typeof tag === 'string' ? tag : 'Tag'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {(speaker.social_media_url?.link || speaker.social_media_url?.facebook_url || speaker.social_media_url?.linkedin_url || speaker.social_media_url?.twitter_url) && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{
                        margin: '0 0 12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Follow us on
                      </h4>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Website */}
                        {speaker.social_media_url?.link && (
                          <button
                            onClick={() => handleSocialMediaClick('website', speaker.social_media_url.link)}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: '#3B82F6',
                              border: 'none',
                              color: '#fff',
                              fontSize: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Website"
                          >
                            🔗
                          </button>
                        )}

                        {/* Facebook */}
                        {speaker.social_media_url?.facebook_url && (
                          <button
                            onClick={() => handleSocialMediaClick('facebook', speaker.social_media_url.facebook_url)}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: '#1877F2',
                              border: 'none',
                              color: '#fff',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Facebook"
                          >
                            f
                          </button>
                        )}

                        {/* LinkedIn */}
                        {speaker.social_media_url?.linkedin_url && (
                          <button
                            onClick={() => handleSocialMediaClick('linkedin', speaker.social_media_url.linkedin_url)}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: '#0A66C2',
                              border: 'none',
                              color: '#fff',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="LinkedIn"
                          >
                            in
                          </button>
                        )}

                        {/* Twitter */}
                        {speaker.social_media_url?.twitter_url && (
                          <button
                            onClick={() => handleSocialMediaClick('twitter', speaker.social_media_url.twitter_url)}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: '#1DA1F2',
                              border: 'none',
                              color: '#fff',
                              fontSize: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Twitter"
                          >
                            🐦
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleSpeakerExpansion(speakerId)}
                      style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        color: '#3B82F6',
                        border: '2px solid #3B82F6',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
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
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎤</div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', color: '#374151' }}>
              No Speakers Available
            </h3>
            <p style={{ margin: 0, fontSize: '16px' }}>
              Check back later for speaker announcements.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
