import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function MyFamily() {
  const navigate = useNavigate();

  // Expecting section flow
  const [showExpectingFlow, setShowExpectingFlow] = useState(false);
  const [expectingStep, setExpectingStep] = useState(1);
  const [expectingName, setExpectingName] = useState('');
  const [expectingGender, setExpectingGender] = useState('');
  const [expectingDate, setExpectingDate] = useState('');
  const [expectingDir, setExpectingDir] = useState('forward'); // 'forward' | 'back'

  // Existing section flow
  const [showExistingFlow, setShowExistingFlow] = useState(false);
  const [existingStep, setExistingStep] = useState(1);
  const [existingName, setExistingName] = useState('');
  const [existingGender, setExistingGender] = useState('');
  const [existingDate, setExistingDate] = useState('');
  const [existingDir, setExistingDir] = useState('forward'); // 'forward' | 'back'

  // Refs for auto-scroll to opened sections (mimics mobile)
  const expectingRef = useRef(null);
  const existingRef = useRef(null);

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
  }, []);

  const styles = {
    // Top-level screen
    screen: {
      width: '100%',
      paddingTop: 35,
      paddingBottom: 35,
      backgroundColor: '#ffffff',
      minHeight: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    },

    // Header
    topRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingLeft: 15,
      paddingRight: 15
    },
    backBtn: {
      borderRadius: 18,
      width: 48,
      height: 48,
      border: '1.5px solid #c4c3c2',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      cursor: 'pointer',
      outline: 'none',
      transition: 'transform 120ms ease'
    },
    headerTitle: {
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: -0.2,
      fontSize: 20,
      color: '#413c3a',
      textAlign: 'left'
    },

    // Section frame
    section: (borderColor) => ({
      marginTop: 35,
      marginLeft: 15,
      marginRight: 15,
      padding: 15,
      borderRadius: 24,
      border: `1.5px solid ${borderColor}`,
      backgroundColor: '#FFFFFF',
      boxSizing: 'border-box',
      boxShadow: '0 0 0 0 rgba(0,0,0,0)' // keep crisp like mobile
    }),
    sectionHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    sectionTitle: {
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 18,
      color: '#413C3A'
    },
    addPill: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      width: 86,
      height: 40,
      backgroundColor: '#EFF7F7',
      borderRadius: 1000,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      transition: 'transform 120ms ease'
    },
    addText: {
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      color: '#556BB9'
    },

    // Inline flow card
    flowCard: (bg = '#F9F9F9') => ({
      marginTop: 20,
      backgroundColor: bg,
      borderRadius: 20,
      padding: 15,
      boxShadow:
        '0 8px 24px rgba(9, 75, 135, 0.06), 0 2px 6px rgba(9, 75, 135, 0.05)' // soft elevation like mobile
    }),
    flowHeaderRow: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minHeight: 24
    },
    flowBackTap: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 24,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    flowTitle: {
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 18,
      color: '#413C3A',
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      textAlign: 'center'
    },
    stepPillWrap: { alignSelf: 'center', paddingTop: 10, display: 'flex', justifyContent: 'center' },
    stepPill: {
      display: 'inline-flex',
      padding: '10px 18px',
      borderRadius: 1000,
      backgroundColor: '#3CC0BE'
    },
    stepText: {
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      color: '#ffffff'
    },

    // Field label + input
    label: {
      marginTop: 16,
      marginBottom: 8,
      color: '#A8A5A4',
      fontFamily: 'Nunito-SemiBold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14
    },
    input: (accent = '#E1D6F5') => ({
      width: '90%',
      height: 56,
      borderRadius: 28,
      border: `1.5px solid ${accent}`,
      backgroundColor: '#ffffff',
      outline: 'none',
      padding: '0 18px',
      color: '#1E1F24',
      fontFamily: 'Nunito-Medium, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 16,
      boxShadow: '0 2px 10px rgba(9,75,135,0.08)',
      transition: 'box-shadow 150ms ease, transform 120ms ease'
    }),

    // Gender pills
    chipsRow: { display: 'flex', gap: 8, marginTop: 8 },
    chip: (active) => ({
      padding: '10px 14px',
      borderRadius: 999,
      border: active ? 'none' : '1.5px solid #c4c3c2',
      background: active ? '#2A46A8' : '#ffffff',
      color: active ? '#ffffff' : '#A8A5A4',
      fontFamily: 'Nunito-Bold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      cursor: 'pointer',
      outline: 'none',
      transition: 'transform 120ms ease'
    }),

    // Continue button
    ctaRow: { marginTop: 24, display: 'flex', justifyContent: 'center' },
    ctaBtn: {
      width: '100%',
      height: 56,
      borderRadius: 999,
      border: 'none',
      background: 'linear-gradient(90deg, #2a46a8 25%, #17275c 100%)',
      color: '#fff',
      fontFamily: 'Nunito-ExtraBold, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 20,
      letterSpacing: -0.1,
      cursor: 'pointer',
      outline: 'none',
      boxShadow: '0 6px 18px rgba(23,39,92,0.28)',
      transition: 'transform 120ms ease, box-shadow 150ms ease'
    },

    // Step content animation container
    stepAnim: (dir) => ({
      animation:
        dir === 'forward'
          ? 'slideInRight 220ms ease both'
          : 'slideInLeft 220ms ease both'
    })
  };

  // Keyframes to mimic subtle native slide transitions
  const keyframes = `
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;

  const Flow = ({
    type,                 // 'expecting' | 'existing'
    visible,
    setVisible,
    step,
    setStep,
    name,
    setName,
    gender,
    setGender,
    date,
    setDate,
    colors,               // { frame, innerBg, accent }
    dir                   // 'forward' | 'back'
  }) => {
    const headings = ['Enter child name', 'Select child’s gender', 'Select child’s due date'];

    const onBack = () => {
      if (step > 1) {
        setStep(step - 1);
      } else {
        setVisible(false);
      }
    };

    const onContinue = () => {
      if (step < 3) {
        setStep(step + 1);
        return;
      }
      // Done at step 3 — close and reset (UI parity with mobile)
      setVisible(false);
      setTimeout(() => {
        setStep(1);
        setName('');
        setGender('');
        setDate('');
      }, 0);
    };

    if (!visible) return null;

    return (
      <div style={styles.flowCard(colors.innerBg)}>
        <div style={styles.flowHeaderRow}>
          <div
            style={styles.flowBackTap}
            onClick={() => {
              onBack();
            }}
          >
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </div>
          <div style={styles.flowTitle}>{headings[step - 1]}</div>
        </div>

        <div style={styles.stepPillWrap}>
          <div style={styles.stepPill}>
            <span style={styles.stepText}>Step {step}/3</span>
          </div>
        </div>

        <div style={styles.stepAnim(dir)}>
          {step === 1 && (
            <>
              <div style={styles.label}>Name</div>
              <input
                style={styles.input(colors.accent)}
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(42,70,168,0.18)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(9,75,135,0.08)')}
              />
            </>
          )}

          {step === 2 && (
            <>
              <div style={styles.label}>Select Gender</div>
              <div style={styles.chipsRow}>
                <button style={styles.chip(gender === 'male')} onClick={() => setGender('male')}>Male</button>
                <button style={styles.chip(gender === 'female')} onClick={() => setGender('female')}>Female</button>
                <button style={styles.chip(gender === 'non-binary')} onClick={() => setGender('non-binary')}>Non-binary</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={styles.label}>{type === 'expecting' ? 'Due Date' : 'Date of Birth'}</div>
              <input
                type="date"
                style={styles.input(colors.accent)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(42,70,168,0.18)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(9,75,135,0.08)')}
              />
            </>
          )}
        </div>

        <div style={styles.ctaRow}>
          <button
            style={styles.ctaBtn}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={() => {
              onContinue();
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  };

  const openExpecting = () => {
    setShowExpectingFlow(true);
    setExpectingDir('forward');
    setExpectingStep(1);
    setTimeout(() => expectingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };
  const openExisting = () => {
    setShowExistingFlow(true);
    setExistingDir('forward');
    setExistingStep(1);
    setTimeout(() => existingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <div className="mobile-frame-container">
      <div className="screen-container">
        {/* keyframes for slide animations */}
        <style dangerouslySetInnerHTML={{ __html: keyframes }} />
        <div style={styles.screen}>
          {/* Header */}
          <div style={styles.topRow}>
            <button
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => navigate('/profile')}
              style={styles.backBtn}
            >
              <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
            </button>
            <div style={styles.headerTitle}>Add Your Child</div>
          </div>

          {/* Expecting Child */}
          <div ref={expectingRef} style={styles.section('#A979E8')}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Expecting Child</div>
              {!showExpectingFlow && (
                <button
                  style={styles.addPill}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onClick={openExpecting}
                >
                  <span style={styles.addText}>Add</span>
                  <img src="/assets/Plus1.png" alt="Add" style={{ width: 20, height: 20 }} />
                </button>
              )}
            </div>

            <Flow
              type="expecting"
              visible={showExpectingFlow}
              setVisible={setShowExpectingFlow}
              step={expectingStep}
              setStep={(n) => {
                setExpectingDir(n > expectingStep ? 'forward' : 'back');
                setExpectingStep(n);
              }}
              name={expectingName}
              setName={setExpectingName}
              gender={expectingGender}
              setGender={setExpectingGender}
              date={expectingDate}
              setDate={setExpectingDate}
              colors={{ frame: '#A979E8', innerBg: '#F4EEFC', accent: '#E1D6F5' }}
              dir={expectingDir}
            />
          </div>

          {/* Existing Child */}
          <div ref={existingRef} style={styles.section('#81BBBC')}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Existing Child</div>
              {!showExistingFlow && (
                <button
                  style={{ ...styles.addPill, backgroundColor: '#EFF7F7' }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onClick={openExisting}
                >
                  <span style={styles.addText}>Add</span>
                  <img src="/assets/Plus1.png" alt="Add" style={{ width: 20, height: 20 }} />
                </button>
              )}
            </div>

            <Flow
              type="existing"
              visible={showExistingFlow}
              setVisible={setShowExistingFlow}
              step={existingStep}
              setStep={(n) => {
                setExistingDir(n > existingStep ? 'forward' : 'back');
                setExistingStep(n);
              }}
              name={existingName}
              setName={setExistingName}
              gender={existingGender}
              setGender={setExistingGender}
              date={existingDate}
              setDate={setExistingDate}
              colors={{ frame: '#81BBBC', innerBg: '#EFF7F7', accent: '#CDE5E5' }}
              dir={existingDir}
            />
          </div>
        </div>
      </div>
    </div>
  );
}