import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { getUserInfo, replaceUserInfo } from '../utils/indexedDB.js'
import { syncUserData } from '../api/auth.js'
import { EVENT_ID } from '../api/index.js'

export default function SignupGender() {
  const navigate = useNavigate()
  const {  mergeUserInfo, setLoading, setError } = useStore()
  const [gender, setGender] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setLocalError] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const  getUserInfos=async()=>{
    const userInfo = await getUserInfo()
    setUserInfo(userInfo)
    if(userInfo?.gender){
      setGender(userInfo?.gender)
    }
  
        
  }
  useEffect(() => {
    getUserInfos()
  }, [])

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    progressWrap: { margin: '4px 0 12px', height: 10, borderRadius: 10, background: '#F2E9FF', position: 'relative' },
    progressBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '45%', borderRadius: 10, background: 'linear-gradient(90deg,#B682F7,#D0A7FF)' },
    title: { marginTop: 12, fontSize: 24, letterSpacing: '-0.4px', color: '#413C3A', fontWeight: 800 },
    subtitle: { marginTop: 8, color: '#807C7B', fontSize: 14 },
    option: (active) => ({ marginTop: 16, height: 60, borderRadius: 24, border: `${active ? '4px' : '1.5px'} solid ${active ? '#EFE6FB' : '#E5F1F1'}`, background: active ? 'linear-gradient(90deg,#CE8AEE,#9458E2)' : '#EAF6F6', display: 'flex', alignItems: 'center', padding: '0 16px', cursor: 'pointer' }),
    optionText: (active) => ({ color: active ? '#fff' : '#80B0B0', fontWeight: 700, fontSize: 18 }),
    nextBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, height: 56, borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontSize: 18, fontWeight: 800 },
    loadingBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, height: 56, borderRadius: 999, border: 'none', color: '#fff', background: '#ccc', cursor: 'not-allowed', fontSize: 18, fontWeight: 800 },
    skipBtn: { position: 'absolute', bottom: 88, left: 16, right: 16, height: 48, borderRadius: 999, border: '1.5px solid #2a46a8', color: '#2a46a8', background: 'transparent', cursor: 'pointer', fontSize: 16, fontWeight: 800 },
    error: { marginTop: 16, padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, color: '#DC2626', fontSize: 14, textAlign: 'center' }
  }), [])

  const onNext = async () => {
    if (!gender) return
    
    try {
      setIsLoading(true)
      setLocalError(null)
      
      // Create updated user info
      const updatedUserInfo = {
        ...(userInfo || {}),
        gender,
        version: ((userInfo?.version || 0) + 1),
        event_id: EVENT_ID,
        auto_id: userInfo?.auto_id || userInfo?.visitor_id,
        sub: userInfo?.sub || userInfo?.visitor_id
      }
      
      // Update local store
      mergeUserInfo(updatedUserInfo)
      
      // Store in IndexedDB
      await replaceUserInfo(updatedUserInfo)
      
      // Sync with API
      try {
        const syncData = {
          ...updatedUserInfo,
          consent: { signUp: 'gender' }
        }
        await syncUserData(syncData)
      } catch (syncError) {
        console.warn('API sync failed, but proceeding with local data:', syncError)
      }
      
      // Navigate to next step
      navigate('/signup/address')
      
    } catch (error) {
      console.error('Error saving gender:', error)
      setLocalError('Failed to save gender. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSkip = async () => {
    try {
      setIsLoading(true)
      setLocalError(null)
      
      // Create updated user info without gender
      const updatedUserInfo = {
        ...(userInfo || {}),
        gender: null,
        version: ((userInfo?.version || 0) + 1),
       
        auto_id: userInfo?.auto_id || userInfo?.visitor_id,
        sub: userInfo?.sub || userInfo?.visitor_id
      }
      
      // Update local store
      mergeUserInfo(updatedUserInfo)
      
      // Store in IndexedDB
      await replaceUserInfo(updatedUserInfo)
      
      // Sync with API
      try {
        const syncData = {
          ...updatedUserInfo,
          consent: { signUp: 'gender_skipped' }
        }
        await syncUserData(syncData)
      } catch (syncError) {
        console.warn('API sync failed, but proceeding with local data:', syncError)
      }
      
      // Navigate to next step
      navigate('/signup/address')
      
    } catch (error) {
      console.error('Error skipping gender:', error)
      setLocalError('Failed to skip gender. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const Option = ({ label, value }) => {
    const active = gender === value
    
    // Get the correct icon based on the option value
    const getIcon = () => {
      switch (value) {
        case 'male':
          return '/assets/MaleIcon.svg'
        case 'female':
          return '/assets/femaleIcon.svg'
        case 'prefer not to answer':
          return '/assets/otherIcon.png'
        default:
          return '/assets/otherIcon.png'
      }
    }
    
    return (
      <div className='genderOption' onClick={() => setGender(value)} style={styles.option(active)}>
        <div className='genderOptionInr'>
          <img src={getIcon()} alt="" title="" style={{ width: 48, height: 48 }} />
          <div style={styles.optionText(active)}>{label}</div>
        </div>
        <img 
          src={active ? '/assets/activeRadio.svg' : '/assets/deActiveRadio.svg'} 
          alt="" 
          title="" 
          style={{ width: 24, height: 24 }} 
        />
      </div>
    )
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>

        <div className='topProgressBarUpr'>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div className='progressBarCstm' style={styles.progressWrap}><div style={styles.progressBar} /></div>
        </div>

          <div style={styles.title}>Select your gender!</div>
          <div style={styles.subtitle}>Please Select your Gender below!</div>

          <Option label="I am Male" value="male" />
          <Option label="I am Female" value="female" />
          <Option label="Non-binary / Other" value="prefer not to answer" />

          {error && <div style={styles.error}>{error}</div>}

          <button 
            style={isLoading ? styles.loadingBtn : styles.nextBtn} 
            onClick={onNext} 
            disabled={!gender || isLoading}
          >
            {isLoading ? 'Saving...' : 'Next'}
          </button>

          <img src="/assets/cameraAI.svg" alt="" title="" className='cameraAi' />

        </div>
      </div>
    </AppLayout>
  )
}


