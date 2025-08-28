import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'

export default function SignupAddress() {
  const navigate = useNavigate()
  const { mergeUserInfo } = useStore()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postal, setPostal] = useState('')

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    progressWrap: { margin: '4px 0 12px', height: 10, borderRadius: 10, background: '#F2E9FF', position: 'relative' },
    progressBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '70%', borderRadius: 10, background: 'linear-gradient(90deg,#B682F7,#D0A7FF)' },
    title: { marginTop: 12, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, letterSpacing: '-0.4px', color: '#413C3A', fontWeight: 800 },
    subtitle: { marginTop: 8, color: '#807C7B', fontSize: 14 },
    label: { color: '#7EC8C9', fontSize: 14, fontFamily: 'Nunito-SemiBold, sans-serif', fontWeight: 600, marginTop: 16 },
    inputRow: { height: 52, borderRadius: 40, background: '#EFF7F7', display: 'flex', alignItems: 'center', padding: '0 16px' },
    input: { flex: 1, fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: '#80B0B0', fontFamily: 'Nunito-Medium, sans-serif' },
    consent: { marginTop: '50%', color: '#A8A5A4', textAlign: 'center', fontSize: 12 },
    nextBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 18 }
  }), [])

  const onNext = () => {
    if (!address || !city || !state || !postal) return
    mergeUserInfo({ address: { addressline1: address, city, state, postalcode: postal } })
    navigate('/signup/phone')
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.progressWrap}><div style={styles.progressBar} /></div>
          <div style={styles.title}>Enter your address!</div>
          <div style={styles.subtitle}>Please Enter your Address below!</div>

          <div style={styles.label}>Address <span style={{ color: '#ff6e95' }}>*</span></div>
          <div style={styles.fieldPill}><div style={styles.inputRow}><input style={styles.input} value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Enter House No, Building, Area"/></div></div>

          <div style={styles.label}>Select City & State <span style={{ color: '#ff6e95' }}>*</span></div>
          <div style={styles.fieldPill}><div style={styles.inputRow}><input style={styles.input} value={city} onChange={(e)=>setCity(e.target.value)} placeholder="Enter City, State (e.g., Toronto, ON)"/></div></div>

          <div style={styles.label}>Postal Code <span style={{ color: '#ff6e95' }}>*</span></div>
          <div style={styles.fieldPill}><div style={styles.inputRow}><input style={styles.input} value={postal} onChange={(e)=>setPostal(e.target.value)} placeholder="Enter Postal code (e.g., M5H 2M9)"/></div></div>

          <div style={styles.consent}>We use your address to personalize your experience and, in some cases, to confirm your eligibility for specific offers. We never share this information without your explicit permission, and always follow our Privacy Policy, Terms of Service, and local laws.</div>
          <button style={styles.nextBtn} onClick={onNext} disabled={!address || !city || !state || !postal}>Next</button>
        </div>
      </div>
    </AppLayout>
  )
}


