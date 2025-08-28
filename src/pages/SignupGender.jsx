import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'

export default function SignupGender() {
  const navigate = useNavigate()
  const { mergeUserInfo } = useStore()
  const [gender, setGender] = useState('')

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    progressWrap: { margin: '4px 0 12px', height: 10, borderRadius: 10, background: '#F2E9FF', position: 'relative' },
    progressBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '45%', borderRadius: 10, background: 'linear-gradient(90deg,#B682F7,#D0A7FF)' },
    title: { marginTop: 12, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, letterSpacing: '-0.4px', color: '#413C3A', fontWeight: 800 },
    subtitle: { marginTop: 8, color: '#807C7B', fontSize: 14 },
    option: (active) => ({ marginTop: 16, height: 60, borderRadius: 20, border: `1.5px solid ${active ? '#C7A8FF' : '#E5F1F1'}`, background: active ? 'linear-gradient(90deg,#B682F7,#D0A7FF)' : '#EAF6F6', display: 'flex', alignItems: 'center', padding: '0 16px', cursor: 'pointer', boxShadow: active ? '0 2px 0 #E5D8FF inset' : 'none' }),
    optionText: (active) => ({ color: active ? '#fff' : '#80B0B0', fontWeight: 700, fontSize: 18 }),
    nextBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, height: 56, borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 18 }
  }), [])

  const onNext = () => {
    if (!gender) return
    mergeUserInfo({ gender })
    navigate('/signup/address')
  }

  const Option = ({ label, value }) => {
    const active = gender === value
    return (
      <div onClick={() => setGender(value)} style={styles.option(active)}>
        <div style={styles.optionText(active)}>{label}</div>
      </div>
    )
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.progressWrap}><div style={styles.progressBar} /></div>
          <div style={styles.title}>Select your gender!</div>
          <div style={styles.subtitle}>Please Select your Gender below!</div>

          <Option label="Male" value="male" />
          <Option label="Female" value="female" />
          <Option label="Prefer not to answer" value="prefer not to answer" />

          <button style={styles.nextBtn} onClick={onNext} disabled={!gender}>Next</button>
        </div>
      </div>
    </AppLayout>
  )
}


