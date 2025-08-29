import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { syncUserData } from '../api/auth.js'
import { EVENT_ID } from '../api/index.js'
import { storeUserData } from '../utils/indexedDB.js'

export default function SignupName() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = (location.state && location.state.prefill) || {}
  const { mergeUserInfo, userInfo, setLoading, setError: setStoreError } = useStore()
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [focused, setFocused] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (prefill.firstName) setFirstName(prefill.firstName)
    if (prefill.middleName) setMiddleName(prefill.middleName)
    if (prefill.lastName) setLastName(prefill.lastName)
  }, [prefill])

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    topNav: { display: 'flex', alignItems: 'center' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    header: { marginTop: 24 },
    title: { fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, letterSpacing: '-0.3px', color: '#2a2a2a',fontWeight: 800 },
    subtitle: { marginTop: 7, color: '#6B7280', fontSize: 14},
    fields: { marginTop: 35 },
    label: (active) => ({ color: active ? '#2A46A8' : '#7EC8C9', fontSize: 14, fontFamily: 'Nunito-SemiBold, sans-serif',fontWeight: 600 }),
    borderWrap: (active) => ({ marginTop: 5, borderRadius: 24, border: '4px solid', borderColor: active ? '#EFE6FB' : '#eef7f7' }),
    inputRow: (active) => ({ height: 52, borderRadius: 20, border: '1.5px solid', borderColor: active ? '#2A46A8' : '#eef7f7', background: active ? '#fff' : '#eff7f7', display: 'flex', alignItems: 'center', padding: '0 12px' }),
    input: { flex: 1, fontSize: 16, border: 'none', outline: 'none', background: 'transparent', color: '#413c3a', fontFamily: 'Nunito-Medium, sans-serif' },
    orRow: { display: 'flex', alignItems: 'center', margin: '0 16px' },
    orLine: { flex: 1, height: 1, background: '#C4C3C2' },
    orText: { margin: '0 8px', color: '#807C7B', fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
    nextBtn: { height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif' },
    disabledBtn: { height: 56, width: '100%', borderRadius: 999, border: '1px solid #e5e7eb', background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' },
    loadingBtn: { height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)', cursor: 'not-allowed', fontFamily: 'Nunito-ExtraBold, sans-serif', opacity: 0.7 },
    error: { marginTop: 6, color: '#ff3333', fontSize: 12 },
    footer: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }
  }), [])

  const validateName = (value) => (/^[a-zA-Z\s]+$/.test((value || '').trim()) ? '' : 'Please use letters only')

  const canNext = () => {
    return firstName && lastName && !validateName(firstName) && !validateName(lastName) && firstName.trim() && lastName.trim()
  }

  const onNext = async () => {
    const fErr = validateName(firstName)
    const lErr = validateName(lastName)
    if (fErr) return setError(fErr)
    if (lErr) return setError(lErr)
    setError('')
    
    setIsLoading(true)
    setLoading(true)
    
    try {
      // Trim names before saving
      const trimmedFName = firstName.trim() + (middleName ? ` ${middleName.trim()}` : '')
      const trimmedLName = lastName.trim()
      
      // Update local store first
      const updatedUserInfo = {
        ...(userInfo || {}),
        email:'pushkar.webnexus@gmail.com',
        first_name: trimmedFName, 
        last_name: trimmedLName, 
        version: userInfo?.version ? Number(userInfo?.version) + 1 : 1,
        event_id: EVENT_ID, // Required for IndexedDB Users store
        auto_id:'4a9decc6-6436-402b-a36c-9e7e648f1369', //userInfo?.auto_id || userInfo?.visitor_id, // Ensure auto_id is present
        sub: userInfo?.sub || userInfo?.cognito_id // Ensure sub is present
      }
      
      console.log('Updated user info for storage:', updatedUserInfo)
      mergeUserInfo(updatedUserInfo)

 

      // Prepare data for API sync
      const syncData = {
        "records": [
          { 
            ...updatedUserInfo,
            
            consent: { signUp: 'name' }
          }
        ],
        "show_id": EVENT_ID
      }

      try {
        // Sync with API
        const updateData = await syncUserData(syncData)
        console.log("API sync response:", updateData)
      } catch (syncError) {
        console.warn('API sync failed, but proceeding with local data:', syncError)
        // Continue with local data even if API sync fails
      }
      
      // Navigate to next step regardless of API sync result
     navigate('/signup/dob')
      
    } catch (e) {
      console.error('Error processing user data:', e)
      setError('Failed to save your information. Please try again.')
      setStoreError(e.message || 'Processing failed')
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
      <div style={styles.frame}>
        <div style={styles.topNav}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
        </div>

        <div style={styles.header}>
          <div style={styles.title}>What should we call you?</div>
          <div style={styles.subtitle}>Enter your name below!</div>
        </div>

        <div style={styles.fields}>
          <div>
            <div style={styles.label(focused === 'first')}>First Name <span style={{ color: '#ff6e95', fontWeight: 800 }}>*</span></div>
            <div style={styles.borderWrap(focused === 'first')}>
              <div style={styles.inputRow(focused === 'first')}>
                <input style={styles.input} placeholder="Enter first name here" value={firstName} onChange={(e) => setFirstName(e.target.value)} onFocus={() => setFocused('first')} onBlur={() => setFocused(null)} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 25 }}>
            <div style={styles.label(focused === 'middle')}>Middle Name</div>
            <div style={styles.borderWrap(focused === 'middle')}>
              <div style={styles.inputRow(focused === 'middle')}>
                <input style={styles.input} placeholder="Enter middle name here" value={middleName} onChange={(e) => setMiddleName(e.target.value)} onFocus={() => setFocused('middle')} onBlur={() => setFocused(null)} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 25 }}>
            <div style={styles.label(focused === 'last')}>Last Name <span style={{ color: '#ff6e95' }}>*</span></div>
            <div style={styles.borderWrap(focused === 'last')}>
              <div style={styles.inputRow(focused === 'last')}>
                <input style={styles.input} placeholder="Enter last name here" value={lastName} onChange={(e) => setLastName(e.target.value)} onFocus={() => setFocused('last')} onBlur={() => setFocused(null)} />
              </div>
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}
        </div>

        <div style={styles.footer}>
          {canNext() ? (
            <button 
              style={isLoading ? styles.loadingBtn : styles.nextBtn} 
              onClick={onNext}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Next'}
            </button>
          ) : (
            <button style={styles.disabledBtn} disabled>Next</button>
          )}
        </div>
      </div>
    </div>
    </AppLayout>
  )
}


