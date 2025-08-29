import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { sendOTP, syncUserData } from '../api/auth.js'
import { EVENT_ID } from '../api/index.js'
import { storeUserData } from '../utils/indexedDB.js'

export default function SignupPhone() {
  const navigate = useNavigate()
  const { mergeUserInfo, userInfo, setLoading: setGlobalLoading, setError: setStoreError } = useStore()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    nextBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif' },
    loadingBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)', cursor: 'not-allowed', fontFamily: 'Nunito-ExtraBold, sans-serif', opacity: 0.7 },
    skipBtn: { marginTop: 12, height: 48, width: '100%', borderRadius: 999, border: '1.5px solid #2a46a8', color: '#2a46a8', background: 'transparent', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 16 },
    error: { marginTop: 6, color: '#ff3333', fontSize: 12, textAlign: 'center' }
  }), [])

  const onNext = async () => {
    if (!phone || phone.replace(/\D/g,'').length < 10) return
    
    setIsLoading(true)
    setGlobalLoading(true)
    
    try {
      // Update local store first
      const updatedUserInfo = {
        ...(userInfo || {}),
        phone,
        version: userInfo?.version ? Number(userInfo?.version) + 1 : 1,
        event_id: EVENT_ID,
        auto_id: userInfo?.auto_id || userInfo?.visitor_id,
        sub: userInfo?.sub || userInfo?.cognito_id
      }
      
      console.log('Updated user info for phone storage:', updatedUserInfo)
      mergeUserInfo(updatedUserInfo)

      // Store in IndexedDB for local persistence
      try {
        await storeUserData(updatedUserInfo)
        console.log('User phone data stored locally in IndexedDB successfully')
      } catch (dbError) {
        console.warn('Failed to store phone in IndexedDB:', dbError)
      }

      // Prepare data for API sync
      const syncData = {
        "records": [
          { 
            ...updatedUserInfo,
            consent: { signUp: 'phone' }
          }
        ],
        "show_id": EVENT_ID
      }

      try {
        // Sync with API
        const updateData = await syncUserData(syncData)
        console.log("API sync response for phone:", updateData)
      } catch (syncError) {
        console.warn('API sync failed for phone, but proceeding with local data:', syncError)
      }

      // Send OTP for verification
      setLoading(true)
      const res = await sendOTP(phone)
      setLoading(false)
      
      if (res?.statusCode === 200) {
        navigate('/signup/verify', { state: { phone } })
      } else {
        setError('Failed to send OTP. Please try again.')
      }
      
    } catch (e) {
      console.error('Error processing phone data:', e)
      setError('Failed to save your phone number. Please try again.')
      setStoreError(e.message || 'Processing failed')
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  const onSkip = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    
    try {
      // Update local store with empty phone
      const updatedUserInfo = {
        ...(userInfo || {}),
        phone: '',
        version: userInfo?.version ? Number(userInfo?.version) + 1 : 1,
        event_id: EVENT_ID,
        auto_id: userInfo?.auto_id || userInfo?.visitor_id,
        sub: userInfo?.sub || userInfo?.cognito_id
      }
      
      console.log('Updated user info for skipped phone:', updatedUserInfo)
      mergeUserInfo(updatedUserInfo)

      // Prepare data for API sync
      const syncData = {
        "records": [
          { 
            ...updatedUserInfo,
            consent: { signUp: 'phone_skipped' }
          }
        ],
        "show_id": EVENT_ID
      }

      try {
        // Sync with API
        const updateData = await syncUserData(syncData)
        console.log("API sync response for skipped phone:", updateData)
      } catch (syncError) {
        console.warn('API sync failed for skipped phone, but proceeding with local data:', syncError)
      }
      
      // Navigate directly to review page
      navigate('/signup/review')
      
    } catch (e) {
      console.error('Error processing skipped phone:', e)
      setError('Failed to skip phone step. Please try again.')
      setStoreError(e.message || 'Processing failed')
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
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

          {error && <div style={styles.error}>{error}</div>}
          <button 
            style={isLoading ? styles.loadingBtn : styles.nextBtn} 
            onClick={onNext} 
            disabled={isLoading || !phone}
          >
            {isLoading ? 'Saving...' : (loading ? 'Sending…' : 'Verify Number')}
          </button>
          <button 
            style={styles.skipBtn} 
            onClick={onSkip} 
            disabled={isLoading}
          >
            Skip Phone Verification
          </button>
        </div>
      </div>
    </AppLayout>
  )
}


