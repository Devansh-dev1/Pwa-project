import { useMemo, useState, useEffect } from 'react'
import Picker from 'react-mobile-picker'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { syncUserData } from '../api/auth.js'
import { getUserInfo, replaceUserInfo } from '../utils/indexedDB.js'

export default function SignupDOB() {
  const navigate = useNavigate()
  const { mergeUserInfo } = useStore()
  const [month, setMonth] = useState('January')
  const [day, setDay] = useState(1)
  const [year, setYear] = useState(new Date().getFullYear() - 24)
  const [userInfo, setUserInfo] = useState(null)

  const  getUserInfos=async()=>{
    const userInfo = await getUserInfo()
    setUserInfo(userInfo)
  
        
  }
  useEffect(() => {
    getUserInfos()
  }, [])
  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    progressWrap: { margin: '4px 0 12px', height: 10, borderRadius: 10, background: '#F2E9FF', position: 'relative' },
    progressBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', borderRadius: 10, background: 'linear-gradient(90deg,#B682F7,#D0A7FF)' },
    title: { marginTop: 12, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 28, letterSpacing: '-0.4px', color: '#413C3A', fontWeight: 800 },
    subtitle: { marginTop: 8, color: '#807C7B', fontSize: 16 },
    pickerRow: { marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pickerCol: { width: '32%', textAlign: 'center' },
    select: { width: '100%', height: 140, fontSize: 20, border: 'none', outline: 'none', background: 'transparent', textAlign: 'center' },
    guideline: { height: 3, background: '#B682F7', borderRadius: 2, marginTop: 6 },
    consent: { position: 'absolute', bottom: 100, left: 16, right: 16, color: '#9AA0A6', textAlign: 'center', fontSize: 14 },
    nextBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, height: 56, borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 18 }
  }), [])

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const daysInMonth = (m, y) => new Date(y, months.indexOf(m) + 1, 0).getDate()
  const validDays = daysInMonth(month, year)
  useEffect(() => { if (day > validDays) setDay(validDays) }, [month, year])

  const onNext = async() => {
    try{
    const mm = String(months.indexOf(month) + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const yyyy = String(year)
    const iso = `${yyyy}-${mm}-${dd}`
    // mergeUserInfo({ dob: iso })
    const syncData = {
      "records": [
        { 
          ...userInfo,
          dob: iso,
          version: userInfo?.version ? Number(userInfo?.version) + 1 : 1,
          
          consent: { signUp: 'name' }
        }
      ],
     
    }
    const updateData = await syncUserData(syncData)
    await replaceUserInfo({...userInfo,dob: iso})
    navigate('/signup/gender')
  }catch(error){
    console.log('error',error)
  }
  }

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.screen}>
        <div style={styles.frame}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.progressWrap}><div style={styles.progressBar} /></div>
          <div style={styles.title}>Please select date of birth!</div>
          <div style={styles.subtitle}>Please Select your DOB below!</div>

          <div style={styles.pickerRow}>
            <div style={styles.pickerCol}>
              <Picker
                value={{ month }}
                onChange={(val)=> setMonth(val.month)}
                height={140}
                itemHeight={28}
              >
                <Picker.Column name="month">
                  {months.map(m => (
                    <Picker.Item key={m} value={m}>{m}</Picker.Item>
                  ))}
                </Picker.Column>
              </Picker>
              <div style={styles.guideline} />
            </div>
            <div style={styles.pickerCol}>
              <Picker
                value={{ day }}
                onChange={(val)=> setDay(val.day)}
                height={140}
                itemHeight={28}
              >
                <Picker.Column name="day">
                  {Array.from({length: validDays}, (_,i)=>i+1).map(d => (
                    <Picker.Item key={d} value={d}>{d}</Picker.Item>
                  ))}
                </Picker.Column>
              </Picker>
              <div style={styles.guideline} />
            </div>
            <div style={styles.pickerCol}>
              <Picker
                value={{ year }}
                onChange={(val)=> setYear(val.year)}
                height={140}
                itemHeight={28}
              >
                <Picker.Column name="year">
                  {Array.from({length: 100}, (_,i)=> new Date().getFullYear() - i).map(y => (
                    <Picker.Item key={y} value={y}>{y}</Picker.Item>
                  ))}
                </Picker.Column>
              </Picker>
              <div style={styles.guideline} />
            </div>
          </div>

          <div style={styles.consent}>We only collect the relevant details needed for your account setup. Your information is securely processed.</div>
          <button style={styles.nextBtn} onClick={onNext}>Next</button>
        </div>
      </div>
    </AppLayout>
  )
}


