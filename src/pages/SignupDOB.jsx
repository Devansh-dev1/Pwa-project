import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { syncUserData } from '../api/auth.js'
import { getUserInfo, replaceUserInfo } from '../utils/indexedDB.js'

export default function SignupDOB() {
  const navigate = useNavigate()
  const { mergeUserInfo } = useStore()
  const [month, setMonth] = useState('November')
  const [day, setDay] = useState(11)
  const [year, setYear] = useState(2023)

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
    progressWrap: { height: 10, borderRadius: 10, background: '#F2E9FF', position: 'relative' },
    progressBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', borderRadius: 10, background: 'linear-gradient(90deg,#B682F7,#D0A7FF)' },
    title: { marginTop: 12, fontSize: 28, letterSpacing: '-0.4px', color: '#413C3A', fontWeight: 800 },
    subtitle: { marginTop: 8, color: '#807C7B', fontSize: 16 },
    selectedDateContainer: { 
      marginTop: 36, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #B682F7 0%, #4A90E2 100%)',
      borderRadius: 50,
      marginBottom: 32
    },
    selectedDateText: { 
      color: '#fff', 
      fontSize: 20, 
      fontWeight: 700,
      textAlign: 'center'
    },
    pickerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' },
    pickerCol: { 
      flex: 1, 
      textAlign: 'center',
      position: 'relative',
      maxWidth: '30%'
    },
    pickerColumn: {
      height: 140,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    pickerItem: {
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color: '#666',
      transition: 'all 0.2s ease',
      width: '100%'
    },
    pickerItemSelected: {
      fontSize: 18,
      fontWeight: 700,
      color: '#333'
    },
    pickerItemHidden: {
      opacity: 0.3,
      transform: 'scale(0.9)'
    },
    caret: {
      width: 0,
      height: 0,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      margin: '4px auto',
      flexShrink: 0,
      transition: 'all 0.2s ease',
      userSelect: 'none'
    },
    caretUp: {
      borderBottom: '8px solid #B682F7'
    },
    caretDown: {
      borderTop: '8px solid #B682F7'
    },
    caretHover: {
      transform: 'scale(1.1)',
      filter: 'brightness(1.2)'
    },
    guideline: { height: 3, background: '#B682F7', borderRadius: 2, marginTop: 6 },
    consent: { position: 'absolute', bottom: 100, left: 16, right: 16, color: '#9AA0A6', textAlign: 'center', fontSize: 14, fontWeight: 500 },
    nextBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, height: 56, borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontSize: 18, fontWeight: 800 },
    pickerItemsContainer: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    }
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

  const renderPickerColumn = (items, selectedValue, onSelect, type) => {
    const selectedIndex = items.findIndex(item => 
      type === 'month' ? item === selectedValue : 
      type === 'day' ? item === selectedValue : 
      item === selectedValue
    )

    const handleUpClick = () => {
      // Loop to the end when going up from first item
      if (selectedIndex === 0) {
        onSelect(items[items.length - 1])
      } else {
        onSelect(items[selectedIndex - 1])
      }
    }

    const handleDownClick = () => {
      // Loop to the beginning when going down from last item
      if (selectedIndex === items.length - 1) {
        onSelect(items[0])
      } else {
        onSelect(items[selectedIndex + 1])
      }
    }

    return (
      <div style={styles.pickerColumn}>
        <div 
          style={{
            ...styles.caret, 
            ...styles.caretUp,
            cursor: 'pointer',
            opacity: 1
          }}
          onClick={handleUpClick}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)'
            e.target.style.filter = 'brightness(1.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.filter = 'brightness(1)'
          }}
        />
        <div style={styles.pickerItemsContainer}>
          <div style={{ transform: `translateY(-${selectedIndex * 28}px)` }}>
            {items.map((item, index) => (
              <div
                key={item}
                style={{
                  ...styles.pickerItem,
                  ...(index === selectedIndex ? styles.pickerItemSelected : {}),
                  ...(Math.abs(index - selectedIndex) > 2 ? styles.pickerItemHidden : {})
                }}
                onClick={() => onSelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div 
          style={{
            ...styles.caret, 
            ...styles.caretDown,
            cursor: 'pointer',
            opacity: 1
          }}
          onClick={handleDownClick}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)'
            e.target.style.filter = 'brightness(1.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.filter = 'brightness(1)'
          }}
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


          <div style={styles.title}>Please select date of birth!</div>
          <div style={styles.subtitle}>Please Select your DOB below!</div>

          <div style={styles.selectedDateContainer}>
            <div style={styles.selectedDateText}>
              {day} {month} {year}
            </div>
          </div>

          <div style={styles.pickerRow}>
            <div style={styles.pickerCol}>
              {renderPickerColumn(months, month, setMonth, 'month')}
              <div style={styles.guideline} />
            </div>
            <div style={styles.pickerCol}>
              {renderPickerColumn(Array.from({length: validDays}, (_,i)=>i+1), day, setDay, 'day')}
              <div style={styles.guideline} />
            </div>
            <div style={styles.pickerCol}>
              {renderPickerColumn(Array.from({length: 100}, (_,i)=> new Date().getFullYear() - i), year, setYear, 'year')}
              <div style={styles.guideline} />
            </div>
          </div>

          <div style={styles.consent}>We only collect the relevant details needed for your account setup. Your information is <strong>securely processed.</strong></div>
          <button style={styles.nextBtn} onClick={onNext}>Next</button>
        </div>
      </div>
    </AppLayout>
  )
}


