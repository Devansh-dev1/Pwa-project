import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'

import { getUserInfo } from '../utils/indexedDB.js'

export default function SignupReview() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const storeUserInfo = useStore((s) => s.userInfo)

  const  getUserInfos=async()=>{
    const userInfo = await getUserInfo()
    setUserInfo(userInfo)
  
        
  }
  useEffect(() => {
    getUserInfos()
  }, [])

  // Keep in sync with global store in case data changes while this screen stays mounted
  useEffect(() => {
    if (storeUserInfo) setUserInfo(storeUserInfo)
  }, [storeUserInfo])

  const formatDob = (dob) => {
    if (!dob) return '-'
    const d = new Date(dob)
    if (Number.isNaN(d.getTime())) return dob
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }
   console.log('userInfouserInfouserInfouserInfouserInfo',userInfo)
  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)', overflowY: 'auto' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    title: { marginTop: 24, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, color: '#2a2a2a', fontWeight: 800 },
    helperText: { marginTop: 12, color: '#1E1F24', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 18, lineHeight: '28px' },
    sectionHeading: { fontSize: 20, fontWeight: 700, color: '#000', margin: '12px 0 8px 0' },
    list: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 },
    listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#EFF7F7', borderRadius: 24, border: '1.5px solid #E5F1F1', cursor: 'pointer' },
    listLabel: { color: '#2A46A8', fontSize: 16, fontFamily: 'Nunito-ExtraBold, sans-serif',fontWeight: 700 },
    listValue: { color: '#1E1F24', fontSize: 16, fontFamily: 'Nunito, sans-serif', marginTop: 4 },
    listItemLeft: { display: 'flex', flexDirection: 'column', gap: 2 },
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
          <div style={styles.helperText}>Review your details, you can always edit them later!</div>
          <div style={styles.sectionHeading}>Personal Details</div>

          <div style={styles.list}>
            <div style={styles.listItem} onClick={() => navigate('/signup/name')}>
              <div style={styles.listItemLeft}>
                <div style={styles.listLabel}>Name</div>
                <div style={styles.listValue}>{
                  (userInfo?.first_name || userInfo?.last_name)
                    ? `${userInfo?.first_name ?? ''}${userInfo?.first_name && userInfo?.last_name ? ' ' : ''}${userInfo?.last_name ?? ''}`
                    : '-'
                }</div>
              </div>
              <img src="/assets/iconedit.png" alt="Edit" style={{ width: 24, height: 24 }} />
            </div>

            <div style={styles.listItem} onClick={() => navigate('/signup/gender')}>
              <div style={styles.listItemLeft}>
                <div style={styles.listLabel}>Gender</div>
                <div style={styles.listValue}>{userInfo?.gender || '-'}</div>
              </div>
              <img src="/assets/iconedit.png" alt="Edit" style={{ width: 24, height: 24 }} />
            </div>

            <div style={styles.listItem} onClick={() => navigate('/signup/dob')}>
              <div style={styles.listItemLeft}>
                <div style={styles.listLabel}>Date of Birth</div>
                <div style={styles.listValue}>{formatDob(userInfo?.dob)}</div>
              </div>
              <img src="/assets/iconedit.png" alt="Edit" style={{ width: 24, height: 24 }} />
            </div>

            <div style={styles.listItem} onClick={() => navigate('/signup/address')}>
  <div style={styles.listItemLeft}>
    <div style={styles.listLabel}>Address</div>
    <div style={styles.listValue}>
      {userInfo?.address?.addressline1
        ? [
            userInfo.address.addressline1,
            [userInfo.address.city, userInfo.address.state || userInfo.address.province].filter(Boolean).join(', '),
            userInfo.address.postalcode
          ]
          .filter(Boolean) // Remove falsy parts
          .join(', ') // Join all with comma
        : '-'
      }
    </div>
  </div>
  <img src="/assets/iconedit.png" alt="Edit" style={{ width: 24, height: 24 }} />
</div>

            <div style={styles.listItem} onClick={() => navigate('/signup/phone')}>
              <div style={styles.listItemLeft}>
                <div style={styles.listLabel}>Phone</div>
                <div style={styles.listValue}>{userInfo?.phone || '-'}</div>
              </div>
              <img src="/assets/iconedit.png" alt="Edit" style={{ width: 24, height: 24 }} />
            </div>
          </div>

          <button style={styles.saveBtn} onClick={()=>navigate('/home')}>Save & Close</button>
        </div>
      </div>
    </AppLayout>
  )
}


