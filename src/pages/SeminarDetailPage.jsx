import React, { useMemo, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import { imagesURL } from '../api/index.js';
import { useGetPearksData } from '../utils/index.js';
import useStore from '../store/useStore.js';
import moment from 'moment';

// Color/Font tokens copied from PlanVisit to keep visual parity
const Color = {
  solidsBlackWhite: '#FFFFFF',
  solidsBlackBlack50: '#f8f9fa',
  solidsBlackBlack100: '#E6E9FA',
  solidsBlackBlack200: '#a8a5a4',
  solidsBlackBlack300: '#6B7280',
  solidsBlackBlack400: '#807c7b',
  solidsBlackBlack500: '#1E1F24',
  solidsDenimDenim400: '#556bb9',
  solidsDenimDenim500: '#2A46A8',
};

const Border = { br_mid: 17, br_21xl: 24 };

export default function SeminarDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const stateItem = location.state?.item;
  const [likeIcon, setLikeIcon] = useState(false);
  const [shareIcon, setShareIcon] = useState(false);
  const parks = useGetPearksData();
  const { myDayData, addToMyDay, removeFromMyDay } = useStore();

  const seminar = useMemo(() => {
    if (stateItem) return stateItem;
    const list = parks?.seminars || [];
    return list.find(s => String(s?.seminar_id) === String(id));
  }, [stateItem, parks, id]);

  const booth = useMemo(() => {
    if (!seminar) return null;
    const list = parks?.Booth_N_Zone || [];
    return list.find(b => String(b?.id) === String(seminar?.booth_stage_id));
  }, [seminar, parks]);

  const zoneColor = booth?.zone_color || '#A6B3DA';
  const zoneName = booth?.zone || '';
  const boothName = booth?.booth_name || '';

  const img = Array.isArray(seminar?.seminar_img) && seminar.seminar_img[0]
    ? `${imagesURL}${seminar.seminar_img[0]}/public`
    : null;

  const dateText = useMemo(() => {
    const d = seminar?.seminar_date || seminar?.date || seminar?.start_time;
    const m = d ? moment(d) : null;
    return m && m.isValid() ? m.format('DD MMM YYYY') : 'TBA';
  }, [seminar]);

  const parseTime = (t) => {
    if (!t) return '';
    const iso = moment(t);
    if (iso.isValid()) return iso.format('HH:mm');
    const hm = moment(t, ['HH:mm', 'H:mm', 'hh:mm A'], true);
    if (hm.isValid()) return hm.format('HH:mm');
    return '';
  };
  const hoursText = useMemo(() => {
    const startH = parseTime(seminar?.start_time);
    const endH = parseTime(seminar?.end_time);
    return startH && endH ? `${startH} - ${endH}` : 'TBA';
  }, [seminar]);

  const inMyDay = useMemo(() => myDayData?.includes(seminar?.seminar_id), [myDayData, seminar]);

  const toggleMyDay = () => {
    if (!seminar?.seminar_id) return;
    if (inMyDay) removeFromMyDay(seminar.seminar_id);
    else addToMyDay(seminar.seminar_id);
  };

  // Speaker/Tags helpers copied to mirror mobile behavior
  const speakerSectionRef = useRef(null);
  const [expandedSpeakers, setExpandedSpeakers] = useState({});
  const colors = ['#FEEFB1', '#FFD2DE', '#F4EEFC', '#9458E2'];
  const colorstag = [
    { border: '#6B2E3F', background: '#FFF1F4' },
    { border: '#3E255F', background: '#F4EEFC' },
    { border: '#14402B', background: '#EAF5F0' },
  ];
  const handleLike = () => {
    setLikeIcon(!likeIcon);
    // TODO: Implement actual like functionality with localStorage/API
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: booth?.company?.[0]?.name || 'Booth Details',
          text: `Check out ${booth?.company?.[0]?.name || 'this booth'} at the show!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  const darkenHexColor = (hex, percent) => {
    try {
      const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      const darken = (c) => Math.max(0, Math.min(255, Math.floor(c * (1 - percent / 100))));
      return `#${[r, g, b].map((c) => darken(c).toString(16).padStart(2, '0')).join('')}`;
    } catch (e) { return '#000000'; }
  };
  const allSpeakers = parks?.speaker || [];
  const speakerInfo = useMemo(() => {
    const aff = seminar?.affiliate_speaker || [];
    if (!Array.isArray(aff) || aff.length === 0) return [];
    const wantedIds = aff.map(v => (typeof v === 'object' ? (v.value || v.speaker_id || v.id) : v));
    return allSpeakers.filter(sp => wantedIds.some(val => String(sp?.speaker_id) === String(val)));
  }, [seminar, allSpeakers]);
  const descriptionReturn = (name = 'Speaker') => {
    try {
      const globalTest = parks?.event?.[0]?.global_test || [];
      if (Array.isArray(globalTest)) {
        const found = globalTest.find(it => it?.Type === name);
        return found?.description || '';
      }
      return '';
    } catch (e) { return ''; }
  };
  const stripHtml = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };
  const toggleSpeakerExpand = (sid) => setExpandedSpeakers(prev => ({ ...prev, [sid]: !prev[sid] }));
  const scrollToSpeakers = () => {
    try { speakerSectionRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
  };

  if (!seminar) {
    return (
        <div style={{ padding: 16 }}>
          <h2 style={{ margin: '16px 0' }}>Seminar not found</h2>
          <button onClick={() => navigate(-1)} style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid #ddd', cursor: 'pointer' }}>Go Back</button>
        </div>

    );
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
              onClick={() => navigate(-1)}
              style={{
                width: 48,
                height: 48,
                border: '1.5px solid #e5e7eb',
                borderRadius: 18,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#2a46a8';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <img 
                src="/assets/iconchevron-left.png" 
                alt="Back" 
                style={{ width: 24, height: 24 }}
              />
            </button>
            <span style={{ fontWeight: 700, color: Color.solidsBlackBlack500 }}>Seminar Detail</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
          <button
              onClick={handleLike}
              style={{
                width: 48,
                height: 48,
                // border: likeIcon ? '1.5px solid #2a46a8' : '1.5px solid #e5e7eb',
                borderRadius: 18,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = likeIcon ? '#f0f4ff' : '#f8f9fa';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src={likeIcon ? "/assets/boothLikeActive.png" : "/assets/boothLike.png"} 
                alt="Like" 
                style={{ width: 40, height: 40 }}
              />
            </button>
            <button
              onClick={handleShare}
              style={{
                width: 48,
                height: 48,
                // border: '1.5px solid #e5e7eb',
                borderRadius: 18,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#2a46a8';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="/assets/boothShare.png" 
                alt="Share" 
                style={{ width: 40, height: 40 }}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 15 }}>
          {/* Banner */}
          <div style={{ border: '1px solid #dfdfdf', borderRadius: 17, background: '#F3F3F3', overflow: 'hidden' }}>
            {img ? (
              <img src={img} alt={seminar?.title} style={{ width: '100%', objectFit: 'cover', aspectRatio: '3 / 2' }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '3 / 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖼️</div>
            )}
          </div>

          {/* Title + Directions button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
            <h2 style={{ margin: 0, color: Color.solidsBlackBlack500, fontSize: 18 }}>{seminar?.title}</h2>
            <button style={{ height: 30, borderRadius: 18, border: `1.5px solid ${Color.solidsDenimDenim500}`, background: '#fff', padding: '0 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: Color.solidsDenimDenim500, fontWeight: 700, fontSize: 13 }}>Directions</span>
            </button>
          </div>

          {/* Date/Hours & Zone/Booth */}
          <div style={{ marginTop: 15, borderRadius: Border.br_21xl, border: `1.5px solid ${zoneColor}20`, background: `${zoneColor}20`, padding: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: Color.solidsBlackBlack300, fontSize: 12 }}>Date</div>
                <div style={{ color: Color.solidsBlackBlack500, fontWeight: 700 }}>{dateText}</div>
              </div>
              <div>
                <div style={{ color: Color.solidsBlackBlack300, fontSize: 12 }}>Hours</div>
                <div style={{ color: Color.solidsBlackBlack500, fontWeight: 700 }}>{hoursText}</div>
              </div>
            </div>
            {(boothName || zoneName) && (
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: Color.solidsBlackBlack300, fontSize: 12 }}>Zone & Booth No.</span>
                <div style={{ display: 'inline-block', padding: '4px 8px', background: Color.solidsBlackWhite, border: `1.5px solid ${zoneColor}`, color: zoneColor, borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                  {boothName} {zoneName && `• ${zoneName}`}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {seminar?.description && (
            <div style={{ marginTop: 25 }}>
              <h3 style={{ margin: 0, color: Color.solidsBlackBlack500, fontSize: 18 }}>Brief about the seminar</h3>
              <div style={{ width: 64, height: 1, background: Color.solidsBlackBlack100, margin: '15px 0' }} />
              <div style={{ color: Color.solidsBlackBlack400, fontSize: 12 }} dangerouslySetInnerHTML={{ __html: seminar.description }} />
            </div>
          )}

          {Array.isArray(seminar?.tags) && seminar.tags.length > 0 && (
            <div style={{ marginTop: 25 }}>
              <h3 style={{ margin: 0, color: Color.solidsBlackBlack500, fontSize: 18 }}>Tags</h3>
              <div style={{ width: 64, height: 1, background: Color.solidsBlackBlack100, margin: '15px 0' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
                {seminar.tags.map((tg, index) => {
                  const name = tg?.label || tg?.tag_name || tg?.name || (typeof tg === 'string' ? tg : '');
                  if (!name) return null;
                  const clr = colorstag[index % 3];
                  return (
                    <span key={`${name}-${index}`} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 10px',
                      borderRadius: 14,
                      marginRight: 8,
                      background: clr.background,
                      border: `1.5px solid ${clr.border}`,
                      color: clr.border,
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{name}</span>
                  );
                })}
              </div>
            </div>
          )}
          <div ref={speakerSectionRef} style={{ marginTop: 25 }} />
          {speakerInfo?.length > 0 && (
            <div style={{ marginTop: 0 }}>
              <h3 style={{ margin: 0, color: Color.solidsBlackBlack500, fontSize: 18 }}>Speaker</h3>
              {descriptionReturn('Speaker') && (
                <p style={{ margin: '8px 0 0', color: Color.solidsBlackBlack300, fontSize: 14 }}>{descriptionReturn('Speaker')}</p>
              )}
              <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {speakerInfo.map((sp, idx) => {
                  const sid = sp?.speaker_id || idx;
                  const longDesc = sp?.long_description || sp?.short_description || sp?.description || '';
                  const textDesc = stripHtml(longDesc);
                  const isExpanded = !!expandedSpeakers[sid];
                  const needsTruncation = textDesc.length > 215;
                  const shownText = isExpanded || !needsTruncation ? textDesc : `${textDesc.slice(0, 215)}...`;
                  return (
                    <div key={sid} style={{ border: `1.5px solid ${Color.solidsDenimDenim400}`, borderRadius: 20, padding: 15, background: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {sp?.image ? (
                          <img src={`${imagesURL}${sp.image}/public`} alt={sp?.name} style={{ width: 46, height: 46, borderRadius: 46, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 46, height: 46, borderRadius: 23, background: '#dfdfdf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: Color.solidsDenimDenim500, fontWeight: 700 }}>{(sp?.name || 'S')?.slice(0,1)}</span>
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: Color.solidsBlackBlack500 }}>{sp?.name}</div>
                          {sp?.company_name && (
                            <div style={{ fontSize: 12, color: Color.solidsBlackBlack200 }}>{sp?.company_name}</div>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: 15, color: Color.solidsBlackBlack400, fontSize: 12, lineHeight: '20px' }}>{shownText}</div>
                      {Array.isArray(sp?.tags) && sp.tags.length > 0 && (
                        <div style={{ marginTop: 15 }}>
                          <div style={{ fontWeight: 700, color: Color.solidsBlackBlack500, marginBottom: 8 }}>Tags</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {sp.tags.map((tg, tIdx) => {
                              const tname = tg?.tag_name || tg?.label || tg?.name || (typeof tg === 'string' ? tg : '');
                              if (!tname) return null;
                              const bg = colors[tIdx % 4];
                              const txt = bg === '#9458E2' ? '#fff' : darkenHexColor(bg, 70);
                              return (
                                <span key={`${tname}-${tIdx}`} style={{ background: bg, color: txt, fontWeight: 700, fontSize: 12, padding: '6px 10px', borderRadius: 8, marginRight: 8, marginBottom: 8 }}>{tname}</span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {(sp?.social_media_url && (sp.social_media_url.link || sp.social_media_url.facebook_url || sp.social_media_url.linkedin_url || sp.social_media_url.twitter_url)) && (
                        <div style={{ marginTop: 15 }}>
                          <div style={{ fontWeight: 700, color: Color.solidsBlackBlack500, marginBottom: 8 }}>Follow us on</div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            {sp.social_media_url?.link && (
                              <button onClick={() => window.open(sp.social_media_url.link, '_blank')} title="Website" style={{ width: 36, height: 36, borderRadius: 999, background: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer' }}>🔗</button>
                            )}
                            {sp.social_media_url?.facebook_url && (
                              <button onClick={() => window.open(sp.social_media_url.facebook_url, '_blank')} title="Facebook" style={{ width: 36, height: 36, borderRadius: 999, background: '#1877F2', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>f</button>
                            )}
                            {sp.social_media_url?.linkedin_url && (
                              <button onClick={() => window.open(sp.social_media_url.linkedin_url, '_blank')} title="LinkedIn" style={{ width: 36, height: 36, borderRadius: 999, background: '#0A66C2', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>in</button>
                            )}
                            {sp.social_media_url?.twitter_url && (
                              <button onClick={() => window.open(sp.social_media_url.twitter_url, '_blank')} title="Twitter" style={{ width: 36, height: 36, borderRadius: 999, background: '#1DA1F2', color: '#fff', border: 'none', cursor: 'pointer' }}>🐦</button>
                            )}
                          </div>
                        </div>
                      )}
                      {needsTruncation && (
                        <button onClick={() => toggleSpeakerExpand(sid)} style={{ marginTop: 15, width: '100%', borderRadius: 999, border: `1.5px solid ${Color.solidsDenimDenim400}`, background: '#fff', padding: '12px 16px', cursor: 'pointer', color: Color.solidsDenimDenim400, fontWeight: 700 }}>
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}


