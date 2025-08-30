import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'

export default function DriversLicenseSignup() {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const setVhVar = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVhVar();
    window.addEventListener('resize', setVhVar);
    window.addEventListener('orientationchange', setVhVar);
    return () => {
      window.removeEventListener('resize', setVhVar);
      window.removeEventListener('orientationchange', setVhVar);
    };
  }, [])

  useEffect(() => {
    if (!isScanning) return
    let stream
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setError(null)
        scanLoop()
      } catch (e) {
        console.log('Camera error', e)
        setError('Camera access denied or not available')
      }
    }

    const stop = () => {
      try {
        const tracks = stream?.getTracks?.() || []
        tracks.forEach(t => t.stop())
      } catch {}
    }

    const scanLoop = async () => {
      if (!('BarcodeDetector' in window)) return
      try {
        const detector = new window.BarcodeDetector({ formats: ['pdf417'] })
        const tick = async () => {
          if (!videoRef.current) return
          try {
            const bitmapsource = videoRef.current
            const codes = await detector.detect(bitmapsource)
            const pdf417 = codes.find(c => (c.format || '').toLowerCase() === 'pdf417' || c.format === 'pdf417')
            if (pdf417 && pdf417.rawValue) {
              onBarcode(pdf417.rawValue)
              return
            }
          } catch {}
          requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      } catch (e) {
        console.log('BarcodeDetector not available', e)
      }
    }

    start()
    return () => stop()
  }, [isScanning])

  const onBarcode = (raw) => {
    try {
      const parsed = parseAAMVA(raw)
      navigate('/profile/information', { state: { prefill: parsed } })
    } catch (e) {
      setError('Could not read barcode. Enter details manually.')
    } finally {
      setIsScanning(false)
    }
  }

  const styles = useMemo(() => ({
    container: {
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #ffffff 80%, #eff7f7 100%)'
    },
    frame: {
      width: '100%',
      maxWidth: 430,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      padding: '16px 16px',
      boxSizing: 'border-box'
    },
    heroWrap: {
      width: '100%'
    },
    heroImg: {
      width: '100%',
      height: 230,
      borderRadius: 24,
      objectFit: 'cover',
      background: '#f0eaff'
    },
    title: { margin: '8px 0 0', textAlign: 'center', color: '#413C3A', fontSize: 24 },
    body: { marginTop: 10, textAlign: 'center', color: '#807C7B', fontSize: 16, lineHeight: '20px', fontWeight: 500 },
    bold: { color: '#413C3A' },
    footerWrap: { width: '95%', position: 'fixed', bottom: 8, left: '50%', transform: 'translateX(-50%)', maxWidth: 430, padding: '0 4px' },
    animatedContainer: { position: 'relative', height: 50, padding: '10px 0' },
    animatedBtn: { position: 'relative', height: 56, borderRadius: 999, border: '1.5px solid #2a46a8', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden' },
    animatedInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#2a46a8', letterSpacing: '-0.1px' },
    startSpark: { position: 'absolute', right: 0, top: -24, width: 30, height: 30 },
    cameraIcon: { width: 24, height: 24, marginLeft: 7 },
    orRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '14px 16px', fontWeight: 'bold' },
    orLine: { flex: 1, height: 1, background: '#C4C3C2' },
    orText: { margin: '0 12px', color: '#413C3A' },
    primary: { height: 56, borderRadius: 999, width: '100%', border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontWeight: 'bold' },
    videoWrap: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    video: { width: '100%', maxWidth: 480, borderRadius: 12 },
    scanFrame: { position: 'absolute', width: 260, height: 160, border: '3px solid #2a46a8', borderRadius: 12 },
    closeBtn: { position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, width: 40, height: 40, cursor: 'pointer' },
  }), [])

  return (
    <AppLayout hideBottomNav={true}>
      <div style={styles.container}>
      <div style={styles.frame}>
        <div style={styles.heroWrap}>
          <img src="/assets/driverLicense.png" alt="Driver License" style={styles.heroImg} />
        </div>

        <h2 style={styles.title}>Want to speed things up?</h2>
        <div style={styles.body}>
          <span style={styles.bold}>Scan the barcode on the back of your driver’s license</span> to fill in your info.
        </div>
        <div style={styles.body}>It’s safe, fast, and private.</div>
        <div style={styles.body}>{`We don’t store the barcode or your license. We only use the info shown on this screen to set up your account.`}</div>

        <div style={styles.footerWrap}>
          {/* Animated Button */}
          <div style={styles.animatedContainer}>
            <AnimatedButtonWeb onClick={() => setIsScanning(true)} />
          </div>
          {/* OR Divider */}
          <div style={styles.orRow}>
            <div style={styles.orLine} />
            <div style={styles.orText}>OR</div>
            <div style={styles.orLine} />
          </div>
          {/* Enter Manually */}
          <div style={{ padding: '0 16px' }}>
          <button style={styles.primary} onClick={() => navigate('/signup/name')}>
            Enter Manually
          </button>
          </div>
        </div>
      </div>

      {isScanning && (
        <div style={styles.videoWrap}>
          <button style={styles.closeBtn} onClick={() => setIsScanning(false)}>←</button>
          <video ref={videoRef} playsInline muted style={styles.video} />
          <div style={styles.scanFrame} />
          {error && (
            <div style={{ position: 'absolute', bottom: 24, color: '#fff' }}>{error}</div>
          )}
        </div>
      )}
      </div>
    </AppLayout>
  )
}

function AnimatedButtonWeb({ onClick }) {
  const outerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    // reset
    setProgress(0)
    const id = requestAnimationFrame(function step() {
      setProgress(p => {
        const np = Math.min(1, p + 0.05)
        if (np < 1) requestAnimationFrame(step)
        return np
      })
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const style = {
    width: `calc(${100 - progress * 100}% - ${progress * 0}px)`,
  }

  return (
    <div className='extractDlUpr' ref={outerRef}>
      <div className='extractDlInr'>
        <button className='extractDlBtn' onClick={onClick}>
          <div className='extractDlBtnDiv'>
            Extract from Driver’s License
            <img src="/assets/iconcamera.png" alt="camera" />
          </div>
          <img className='extractDlBtnSprk' src="/assets/start.png" alt="spark" />
        </button>
      </div>
    </div>
  )
}

// Minimal AAMVA PDF417 parser (common fields)
function parseAAMVA(raw) {
  const lines = raw.split(/\r?\n/)
  const out = {}
  const get = (prefix) => {
    const line = lines.find(l => l.startsWith(prefix))
    return line ? line.slice(prefix.length).trim() : ''
  }
  out.lastName = get('DCS') || get('DAB')
  out.firstName = get('DAC')
  out.middleName = get('DAD')
  out.address1 = get('DAG')
  out.city = get('DAI')
  out.state = get('DAJ')
  out.postal = (get('DAK') || '').replace(/\s/g,'').slice(0,10)
  const dob = get('DBB') || get('DBB')
  if (dob && dob.length >= 8) {
    out.dob = `${dob.slice(4,6)}-${dob.slice(6,8)}-${dob.slice(0,4)}`
  }
  const gender = get('DBC')
  if (gender === '1') out.gender = 'Male'
  else if (gender === '2') out.gender = 'Female'
  else out.gender = ''
  return out
}


