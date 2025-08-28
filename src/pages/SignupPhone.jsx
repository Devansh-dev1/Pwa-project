import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { sendOTP } from '../api/auth.js'

export default function SignupPhone() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    title: { marginTop: 24, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, color: '#2a2a2a', fontWeight: 800 },
    subtitle: { marginTop: 7, color: '#6B7280', fontSize: 14 },
    label: { color: '#2A46A8', fontSize: 14, fontFamily: 'Nunito-SemiBold, sans-serif', marginTop: 24 },
    borderWrap: { marginTop: 5, borderRadius: 24, border: '4px solid #EFE6FB' },
    inputRow: { height: 52, borderRadius: 24, border: '1.5px solid #2A46A8', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' },
    input: { flex: 1, fontSize: 16, border: 'none', outline: 'none', background: 'transparent', color: '#413c3a', fontFamily: 'Nunito-Medium, sans-serif' },
    nextBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif' }
  }), [])

  const onNext = async () => {
    if (!phone || phone.replace(/\D/g,'').length < 10) return
    setLoading(true)
    const res = await sendOTP(phone)
    setLoading(false)
    if (res?.statusCode === 200) {
      navigate('/signup/verify', { state: { phone } })
    }
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.title}>Enter phone number!</div>
          <div style={styles.subtitle}>We’ll send you an OTP to verify</div>

          <div style={styles.label}>Phone Number</div>
          <div style={styles.borderWrap}>
            <div style={styles.inputRow}>
              <input style={styles.input} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Enter phone number" />
            </div>
          </div>

          <button style={styles.nextBtn} onClick={onNext} disabled={loading || !phone}>{loading ? 'Sending…' : 'Verify Number'}</button>
        </div>
      </div>
    </AppLayout>
  )
}


