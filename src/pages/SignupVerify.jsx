import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { verifyOTP } from '../api/auth.js'

export default function SignupVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mergeUserInfo } = useStore()
  const phone = (location.state && location.state.phone) || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    title: { marginTop: 24, fontSize: 24, color: '#2a2a2a', fontWeight: 800 },
    subtitle: { marginTop: 7, color: '#6B7280', fontSize: 14 },
    label: { color: '#2A46A8', fontSize: 14, marginTop: 24 },
    borderWrap: { marginTop: 5, borderRadius: 24, border: '4px solid #EFE6FB' },
    inputRow: { height: 52, borderRadius: 24, border: '1.5px solid #2A46A8', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' },
    input: { flex: 1, fontSize: 16, border: 'none', outline: 'none', background: 'transparent', color: '#413c3a', letterSpacing: 4, textAlign: 'center' },
    nextBtn: { height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontWeight:800 }
  }), [])

  const onVerify = async () => {
    if (!otp) return
    setLoading(true)
    const res = await verifyOTP(phone, otp)
    setLoading(false)
    if (res?.success !== false) {
      mergeUserInfo({ phone })
      navigate('/signup/review')
    }
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.title}>Enter OTP send to verify</div>
          <div style={styles.subtitle}>Enter the 6-digit code sent to {phone || 'your phone'}</div>

          {/* <div style={styles.label}>Code</div>
          <div style={styles.borderWrap}>
            <div style={styles.inputRow}>
              <input style={styles.input} value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="••••••" />
            </div>
          </div> */}

          <div className='phoneEdit'>
            <input type='text' value="821-578-9031" />
            <img src="/assets/EditPhone.svg" alt="" title="" />
          </div>

          <div className='verifyCodePh'>
            <div>
              <input type='text'  />
              <input type='text'  />
              <input type='text'  />
            </div>
            <div className='verifyCodePhDash'>-</div>
            <div>
              <input type='text'  />
              <input type='text'  />
              <input type='text'  />
            </div>
          </div>

          <div className='phoneEditTime'>
            <p>01:20</p>
          </div>
          
          <div className='verifyBtnUpr'>
          <button className='resendOtp'><label>Re-Send OTP</label><img src="/assets/Rotate.svg" alt="" title="" /></button>
          <button style={styles.nextBtn} onClick={onVerify} disabled={loading || !otp}>{loading ? 'Verifying…' : 'Verify'}</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}


