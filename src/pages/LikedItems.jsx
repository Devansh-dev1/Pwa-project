import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LikedItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { company_name: 'Enrich Kid', type: 'Booth', logo: '/assets/profile-pic.png', global_id: '1' },
    { company_name: 'Ponchies for Kids', type: 'Booth', logo: '/assets/profile-pic.png', global_id: '2' },
    { company_name: 'Wonder Toys', type: 'Booth', logo: '/assets/profile-pic.png', global_id: '3' },
    { company_name: 'Happy Parents', type: 'Booth', logo: '/assets/profile-pic.png', global_id: '4' }
  ]);

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
      boxSizing: 'border-box',
      position: 'relative'
    },
    topNav: {
      paddingBottom: 25,
      justifyContent: 'space-between',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: -20
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
    headerWrap: { paddingLeft: 15, paddingRight: 15, marginBottom: 10 },
    headerTitle: {
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: -0.2,
      fontSize: 20,
      color: '#413c3a',
      textAlign: 'left'
    },
    list: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 10,
      marginBottom: 10
    },
    card: {
      width: '47%',
      padding: 15,
      border: '1.5px solid #cfecec',
      backgroundColor: '#f6fbfb',
      borderRadius: 24,
      boxSizing: 'border-box'
    },
    imageWrap: {
      width: 65,
      height: 65,
      borderRadius: 50,
      padding: 2,
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
      objectFit: 'cover'
    },
    title: {
      color: '#413C3A',
      marginTop: 7,
      paddingTop: 4,
      paddingBottom: 4,
      fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      textAlign: 'left'
    },
    subtitle: {
      marginTop: 3,
      color: '#7EC8C9',
      fontFamily: 'Nunito-Regular, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 12,
      textTransform: 'capitalize',
      textAlign: 'left'
    },
    removeBtn: {
      marginTop: 15,
      height: 40,
      borderRadius: 999,
      padding: '0 20px',
      border: '1.5px solid #2a46a8',
      background: 'transparent',
      color: '#2a46a8',
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      cursor: 'pointer',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    }
  };

  const onRemove = (global_id) => {
    setItems((prev) => prev.filter((x) => x.global_id !== global_id));
  };

  return (
    <div className="mobile-frame-container">
      <div className="screen-container">
        <div style={styles.screen}>
          <div style={styles.topNav}>
            <button onClick={() => navigate('/profile')} style={styles.backBtn}>
              <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
            </button>
          </div>

          <div style={styles.headerWrap}>
            <div style={styles.headerTitle}>Liked Items</div>
          </div>

          <div style={styles.list}>
            {items.map((item) => (
              <div key={item.global_id} style={styles.card}>
                <div style={styles.imageWrap}>
                  <img src={item.logo} alt={item.company_name} style={styles.image} />
                </div>
                <div style={styles.title}>{item.company_name}</div>
                <div style={styles.subtitle}>{item.type}</div>
                <button style={styles.removeBtn} onClick={() => onRemove(item.global_id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
