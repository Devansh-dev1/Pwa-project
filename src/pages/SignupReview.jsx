import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'

import { getUserInfo } from '../utils/indexedDB.js'

export default function SignupReview() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)

  const  getUserInfos=async()=>{
    const userInfo = await getUserInfo()
    setUserInfo(userInfo)
  
        
  }
  useEffect(() => {
    getUserInfos()
  }, [])
   console.log('userInfouserInfouserInfouserInfouserInfo',userInfo)
  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    title: { marginTop: 24, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, color: '#2a2a2a', fontWeight: 800 },
    card: { marginTop: 16, background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 16 },
    row: { display: 'flex', justifyContent: 'space-between', fontSize: 14, margin: '6px 0', color: '#413c3a' },
    saveBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif' }
  }), [])

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.title}>Review your details</div>

          <div style={styles.card}>
            <div style={styles.row}><span>Name</span><span>{(userInfo?.firstName || '') + (userInfo?.middleName ? (' ' + userInfo.middleName) : '') + (userInfo?.lastName ? (' ' + userInfo.lastName) : '')}</span></div>
            <div style={styles.row}><span>DOB</span><span>{userInfo?.dob || '-'}</span></div>
            <div style={styles.row}><span>Gender</span><span>{userInfo?.gender || '-'}</span></div>
            <div style={styles.row}><span>Address</span><span>{userInfo?.address?.addressline1 || '-'}</span></div>
            <div style={styles.row}><span>City, State</span><span>{(userInfo?.address?.city || '-') + ', ' + (userInfo?.address?.state || '-')}</span></div>
            <div style={styles.row}><span>Postal</span><span>{userInfo?.address?.postalcode || '-'}</span></div>
            <div style={styles.row}><span>Phone</span><span>{userInfo?.phone || '-'}</span></div>
          </div>

          <button style={styles.saveBtn} onClick={()=>navigate('/home')}>Save & Close</button>
        </div>
      </div>
    </AppLayout>
  )
}


