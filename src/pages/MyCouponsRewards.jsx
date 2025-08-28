import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function MyCouponsRewards() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('coupons'); // 'coupons' | 'rewards'
  const [chip, setChip] = useState('all');   // 'all' | 'locked' | 'expired'

  useEffect(() => {
    const setVhVar = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVhVar();
    window.addEventListener('resize', setVhVar);
    window.addEventListener('orientationchange', setVhVar);
    return () => {
      window.removeEventListener('resize', setVhVar);
      window.removeEventListener('orientationchange', setVhVar);
    };
  }, []);

  const styles = {
    screen: {
      width: '100%',
      paddingTop: 35,
      paddingBottom: 35,
      backgroundColor: '#ffffff',
      minHeight: '100%',
      boxSizing: 'border-box'
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingLeft: 15,
      paddingRight: 15
    },
    backBtn: {
      borderRadius: 18,
      width: 48,
      height: 48,
      border: '1.5px solid #c4c3c2',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      cursor: 'pointer',
      outline: 'none'
    },
    title: {
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: -0.2,
      fontSize: 20,
      color: '#413c3a',
      textAlign: 'left'
    },

    // Tabs segment
    segWrap: { paddingLeft: 15, paddingRight: 15, marginTop: 25 },
    segContainer: {
      width: '100%',
      background: '#E9EEFD',
      borderRadius: 28,
      padding: 6,
      display: 'flex',
      gap: 6,
      boxSizing: 'border-box'
    },
    segBtn: (active) => ({
      flex: 1,
      height: 48,
      borderRadius: 24,
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 16,
      color: active ? '#ffffff' : '#556BB9',
      background: active
        ? 'linear-gradient(90deg, #2746B7 25%, #163374 100%)'
        : 'transparent'
    }),

    // Filter chips row
    chipsRow: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 14
    },
    chip: (active) => ({
      height: 48,
      borderRadius: 1000,
      padding: '0 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      border: active ? 'none' : '1.5px solid #EDEDED',
      background: active ? '#DFF3F3' : '#F5F6F7',
      color: active ? '#37B8B7' : '#BEBDBC',
      cursor: 'pointer',
      outline: 'none',
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14
    }),
    chipCount: (active) => ({
      minWidth: 40,
      height: 40,
      borderRadius: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? '#FFFFFF' : '#FFFFFF',
      border: active ? '1.5px solid #37B8B7' : '1.5px solid #EDEDED',
      color: active ? '#37B8B7' : '#BEBDBC',
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14
    }),

    // Empty state
    emptyWrap: {
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 45,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    graphic: {
      width: '100%',
      maxWidth: 315,
      height: 248,
      objectFit: 'contain',
      borderRadius: 24
    },
    emptyTitle: {
      marginTop: 15,
      fontSize: 24,
      lineHeight: '32px',
      letterSpacing: -0.2,
      color: '#413C3A',
      textAlign: 'center',
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    emptySub: {
      marginTop: 7,
      fontSize: 16,
      lineHeight: '22px',
      letterSpacing: -0.1,
      color: '#A8A5A4',
      textAlign: 'center',
      fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif'
    }
  };

  const Chips = () => (
    <div style={styles.chipsRow}>
      <button style={styles.chip(chip === 'all')} onClick={() => setChip('all')}>
        All
        <span style={styles.chipCount(chip === 'all')}>0</span>
      </button>
      <button style={styles.chip(chip === 'locked')} onClick={() => setChip('locked')}>
        Locked
        <span style={styles.chipCount(chip === 'locked')}>-5</span>
      </button>
      <button style={styles.chip(chip === 'expired')} onClick={() => setChip('expired')}>
        Expired
        <span style={styles.chipCount(chip === 'expired')}>0</span>
      </button>
    </div>
  );

  return (
    <div className="mobile-frame-container">
      <div className="screen-container">
        <div style={styles.screen}>
          <div style={styles.headerRow}>
            <button onClick={() => navigate('/profile')} style={styles.backBtn}>
              <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
            </button>
            <div style={styles.title}>My Coupons & Rewards</div>
          </div>

          <div style={styles.segWrap}>
            <div style={styles.segContainer}>
              <button style={styles.segBtn(tab === 'coupons')} onClick={() => setTab('coupons')}>
                Coupons
              </button>
              <button style={styles.segBtn(tab === 'rewards')} onClick={() => setTab('rewards')}>
                Rewards
              </button>
            </div>
          </div>

          <Chips />

          <div style={styles.emptyWrap}>
            <img src="/assets/Graphic.svg" alt="Empty" style={styles.graphic} />
            <div style={styles.emptyTitle}>Whoops, Nothing Found!</div>
            <div style={styles.emptySub}>
              Scope hill horse t-shaped optimize existing follow individual.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
