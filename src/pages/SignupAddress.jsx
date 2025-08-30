import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import useStore from '../store/useStore.js'
import { syncUserData } from '../api/auth.js'
import { EVENT_ID } from '../api/index.js'
import { getUserInfo, replaceUserInfo } from '../utils/indexedDB.js'
import { getAddressSuggestions, getCanadaAddressSuggestions, validateCanadianPostalCode, formatCanadianPostalCode } from '../api/AddressValidation.js'

export default function SignupAddress() {
  const navigate = useNavigate()
  const { mergeUserInfo,  setLoading, setError: setStoreError } = useStore()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postal, setPostal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [citySuggestions, setCitySuggestions] = useState([])
  const [cityValidation, setCityValidation] = useState({
    isValid: null,
    error: null,
    isValidating: false
  })
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [postalCodeValidation, setPostalCodeValidation] = useState({
    isValid: null,
    error: null,
    isValidating: false
  })
  const [userInfo, setUserInfo] = useState(null)
  const  getUserInfos=async()=>{
    const userInfo = await getUserInfo()
    setUserInfo(userInfo)
    const savedAddress = userInfo?.address || {}
    if (savedAddress?.addressline1) setAddress(savedAddress.addressline1)
    const savedCity = savedAddress?.city || ''
    const savedState = savedAddress?.state || savedAddress?.province || ''
    if (savedCity || savedState) setCity([savedCity, savedState].filter(Boolean).join(', '))
    if (savedState) setState(savedState)
    if (savedAddress?.postalcode) setPostal(savedAddress.postalcode)
  }
  useEffect(() => {
    getUserInfos()
  }, [])

  const styles = useMemo(() => ({
    screen: { height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)' },
    frame: { width: '100%', maxWidth: 430, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box' },
    backBtn: { borderRadius: 18, width: 48, height: 48, border: '1.5px solid #c4c3c2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' },
    progressWrap: { margin: '4px 0 12px', height: 10, borderRadius: 10, background: '#F2E9FF', position: 'relative' },
    progressBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '70%', borderRadius: 10, background: 'linear-gradient(90deg,#B682F7,#D0A7FF)' },
    title: { marginTop: 12, fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 24, letterSpacing: '-0.4px', color: '#413C3A', fontWeight: 800 },
    subtitle: { marginTop: 8, color: '#807C7B', fontSize: 14 },
    label: { color: '#7EC8C9', fontSize: 14, fontFamily: 'Nunito-SemiBold, sans-serif', fontWeight: 600, marginTop: 16 },
    inputRow: { height: 52, borderRadius: 40, background: '#EFF7F7', display: 'flex', alignItems: 'center', padding: '0 16px' },
    input: { flex: 1, fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: '#80B0B0', fontFamily: 'Nunito-Medium, sans-serif' },
    fieldPill: { marginTop: 8, borderRadius: 40, border: '1.5px solid #E5F1F1' },
    consent: { marginTop: '50%', color: '#A8A5A4', textAlign: 'center', fontSize: 12 },
    nextBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 18 },
    loadingBtn: { marginTop: 'auto', height: 56, width: '100%', borderRadius: 999, border: 'none', color: '#fff', background: 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)', cursor: 'not-allowed', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 18, opacity: 0.7 },
    skipBtn: { marginTop: 12, height: 48, width: '100%', borderRadius: 999, border: '1.5px solid #2a46a8', color: '#2a46a8', background: 'transparent', cursor: 'pointer', fontFamily: 'Nunito-ExtraBold, sans-serif', fontSize: 16 },
    error: { marginTop: 6, color: '#ff3333', fontSize: 12, textAlign: 'center' }
  }), [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowAddressSuggestions(false)
      setShowCitySuggestions(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Address input change handler with autocomplete
  const handleAddressChange = async (value) => {
    setAddress(value)
    console.log('Address input changed to:', value)
    
    if (value && value.length > 1) {
      console.log('Fetching address suggestions for:', value)
      try {
        const response = await getAddressSuggestions(value, 'CAN')
        console.log('API response:', response)
        const suggestions = response?.body || []
        console.log('Suggestions found:', suggestions.length)
        
        if (suggestions.length > 0) {
          setAddressSuggestions(suggestions)
          setShowAddressSuggestions(true)
          console.log('Showing suggestions:', suggestions)
        } else {
          setAddressSuggestions([])
          setShowAddressSuggestions(false)
          console.log('No suggestions, hiding dropdown')
        }
      } catch (error) {
        console.error('Failed to fetch address suggestions:', error)
        setAddressSuggestions([])
        setShowAddressSuggestions(false)
      }
    } else {
      setAddressSuggestions([])
      setShowAddressSuggestions(false)
      console.log('Input too short, hiding suggestions')
    }
  }

  // Select address suggestion (mirror mobile logic)
  const selectAddressSuggestion = (suggestion) => {
    const addressText = suggestion?.Text || ''
    const description = suggestion?.Description || ''
    const parts = String(description)
      .split(',')
      .map((p) => (p || '').trim())
      .filter(Boolean)
    
    // Value before last comma → City, Province (e.g., "Toronto, ON")
    const valueBeforeLastComma = parts.slice(0, -1).join(', ')
    // Last part → Postal code
    const valueAfterLastComma = parts[parts.length - 1] || ''

    // Set Address Line 1
    setAddress(addressText)

    // Auto-fill City & Province
    if (valueBeforeLastComma) {
      handleCityChange(valueBeforeLastComma)
    }

    // Auto-fill Postal Code (formatted)
    const formattedPostal = formatCanadianPostalCode(valueAfterLastComma)
    if (formattedPostal) {
      setPostal(formattedPostal)
    }
    
    // Set postal validation state
    const isValidPc = formattedPostal && validateCanadianPostalCode(formattedPostal)
    setPostalCodeValidation({ isValid: !!isValidPc, error: isValidPc ? null : postalCodeValidation.error, isValidating: false })

    setShowAddressSuggestions(false)
  }

  // Test function to manually trigger address search
  const testAddressSearch = async () => {
    console.log('Testing address search...')
    try {
      const response = await getAddressSuggestions('123 Main', 'CAN')
      console.log('Test API response:', response)
      if (response?.body && response.body.length > 0) {
        setAddressSuggestions(response.body)
        setShowAddressSuggestions(true)
        console.log('Test successful, showing suggestions')
      } else {
        console.log('No suggestions in test response')
      }
    } catch (error) {
      console.error('Test failed:', error)
    }
  }

  // Common Canadian cities and provinces for suggestions
  const commonCities = [
    'Toronto, ON',
    'Vancouver, BC',
    'Montreal, QC',
    'Calgary, AB',
    'Edmonton, AB',
    'Ottawa, ON',
    'Winnipeg, MB',
    'Quebec City, QC',
    'Hamilton, ON',
    'Kitchener, ON',
    'London, ON',
    'Victoria, BC',
    'Halifax, NS',
    'Saskatoon, SK',
    'Regina, SK',
    'St. John\'s, NL',
    'Fredericton, NB',
    'Charlottetown, PE',
    'Whitehorse, YT',
    'Yellowknife, NT',
    'Iqaluit, NU'
  ]

  // Filter cities based on input
  const getFilteredCities = (input) => {
    if (!input || input.length < 2) return []
    return commonCities.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    )
  }

  // Enhanced city change handler with suggestions
  const handleCityChange = (value) => {
    setCity(value)
    
    if (value) {
      const cityParts = value.split(',').map(part => part.trim())
      
      if (cityParts.length >= 2) {
        setCityValidation({
          isValid: true,
          error: null,
          isValidating: false
        })
        setState(cityParts[1])
        setShowCitySuggestions(false)
      } else {
        setCityValidation({
          isValid: false,
          error: 'Please enter city and state (e.g., Toronto, ON)',
          isValidating: false
        })
        
        // Show city suggestions
        const filteredCities = getFilteredCities(value)
        if (filteredCities.length > 0) {
          setCitySuggestions(filteredCities)
          setShowCitySuggestions(true)
        } else {
          setShowCitySuggestions(false)
        }
      }
    } else {
      setCityValidation({
        isValid: null,
        error: null,
        isValidating: false
      })
      setShowCitySuggestions(false)
    }
  }

  // Postal code validation and autofill
  const handlePostalChange = async (value) => {
    const cleanedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    let formattedValue = cleanedValue
    
    // Format as user types (A1A 1A1)
    if (cleanedValue.length > 3) {
      formattedValue = `${cleanedValue.slice(0, 3)} ${cleanedValue.slice(3, 6)}`
    }
    
    setPostal(formattedValue)
    
    if (cleanedValue.length === 6) {
      setPostalCodeValidation({
        isValid: null,
        error: null,
        isValidating: true
      })
      
      try {
        const isValidFormat = validateCanadianPostalCode(formattedValue)
        
        if (!isValidFormat) {
          setPostalCodeValidation({
            isValid: false,
            error: 'Invalid Canadian postal code format',
            isValidating: false
          })
          return
        }

        // Try to get address suggestions based on postal code
        try {
          const response = await getCanadaAddressSuggestions({
            searchTerm: '',
            postalcode: formattedValue,
            maxResults: 5
          })
          
          if (response?.body && response.body.length > 0) {
            const firstSuggestion = response.body[0]
            console.log('Postal code suggestion:', firstSuggestion)
            
            // Auto-populate city and state from the first suggestion
            if (firstSuggestion.Description) {
              const parts = firstSuggestion.Description.split(',').map(part => part.trim())
              if (parts.length >= 2) {
                const cityName = parts[0]
                const provinceName = parts[parts.length - 1]
                const cityStateValue = `${cityName}, ${provinceName}`
                
                setCity(cityStateValue)
                setState(provinceName)
                setCityValidation({
                  isValid: true,
                  error: null,
                  isValidating: false
                })
                setShowCitySuggestions(false)
              }
            }
          }
        } catch (apiError) {
          console.warn('API call failed, but postal code format is valid:', apiError)
        }

        setPostalCodeValidation({
          isValid: true,
          error: null,
          isValidating: false
        })
        
      } catch (error) {
        setPostalCodeValidation({
          isValid: false,
          error: 'Validation failed',
          isValidating: false
        })
      }
    } else {
      setPostalCodeValidation({
        isValid: null,
        error: null,
        isValidating: false
      })
    }
  }

  const onSkip = async () => {
    setIsLoading(true)
    setLoading(true)
    
    try {
      // Update local store with empty address
      const updatedUserInfo = {
        ...(userInfo || {}),
        address: { addressline1: '', city: '', state: '', postalcode: '' },
        version: userInfo?.version ? Number(userInfo?.version) + 1 : 1,
        event_id: EVENT_ID,
        auto_id: userInfo?.auto_id || userInfo?.visitor_id,
        sub: userInfo?.sub || userInfo?.cognito_id
      }
      
      console.log('Updated user info for skipped address:', updatedUserInfo)
      
      // Update local store
      mergeUserInfo(updatedUserInfo)
      
      // Store in IndexedDB
      await replaceUserInfo(updatedUserInfo)

      // Sync with API
      try {
        const syncData = {
          ...updatedUserInfo,
          consent: { signUp: 'address_skipped' }
        }
        await syncUserData(syncData)
        console.log("API sync response for skipped address:", syncData)
      } catch (syncError) {
        console.warn('API sync failed for skipped address, but proceeding with local data:', syncError)
      }
      
      // Navigate to next step
      navigate('/signup/phone')
      
    } catch (e) {
      console.error('Error processing skipped address:', e)
      setError('Failed to skip address step. Please try again.')
      setStoreError(e.message || 'Processing failed')
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  const onNext = async () => {
    // if (!address || !city || !state || !postal) return
    
    setIsLoading(true)
    setLoading(true)
    
    try {
      // Create updated user info
      const updatedUserInfo = {
        ...(userInfo || {}),
        address: { addressline1: address, city, state, postalcode: postal },
        version: userInfo?.version ? Number(userInfo?.version) + 1 : 1,
        event_id: EVENT_ID,
        auto_id: userInfo?.auto_id || userInfo?.visitor_id,
        sub: userInfo?.sub || userInfo?.cognito_id
      }
      
      console.log('Updated user info for address storage:', updatedUserInfo)
      
      // Update local store
      mergeUserInfo(updatedUserInfo)
      
      // Store in IndexedDB
      await replaceUserInfo(updatedUserInfo)

      // Sync with API
      try {
        const syncData = {
          ...updatedUserInfo,
          consent: { signUp: 'address' }
        }
        await syncUserData(syncData)
        console.log("API sync response for address:", syncData)
      } catch (syncError) {
        console.warn('API sync failed for address, but proceeding with local data:', syncError)
      }
      
      // Navigate to next step regardless of API sync result
      navigate('/signup/phone')
      
    } catch (e) {
      console.error('Error processing address data:', e)
      setError('Failed to save your address. Please try again.')
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
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <img src="/assets/iconchevron-left.png" alt="Back" style={{ width: 24, height: 24 }} />
          </button>
          <div style={styles.progressWrap}><div style={styles.progressBar} /></div>
          <div style={styles.title}>Enter your address!</div>
          <div style={styles.subtitle}>Please Enter your Address below!</div>

          <div style={styles.label}>Address <span style={{ color: '#ff6e95' }}>*</span></div>
          <div style={{ position: 'relative' }}>
            <div style={styles.fieldPill}>
              <div style={styles.inputRow}>
                <input 
                  style={styles.input} 
                  value={address} 
                  onChange={(e)=>handleAddressChange(e.target.value)} 
                  placeholder="Enter House No, Building, Area"
                />
              </div>
            </div>
            {showAddressSuggestions && addressSuggestions.length > 0 && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                right: 0, 
                background: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                maxHeight: 200, 
                overflowY: 'auto', 
                zIndex: 1000, 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                marginTop: 4
              }}>
                {addressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{ 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f3f4f6', 
                      cursor: 'pointer', 
                      fontSize: 14, 
                      color: '#374151',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                    onClick={() => selectAddressSuggestion(suggestion)}
                  >
                    {suggestion.Text || suggestion.Description || suggestion}
                  </div>
                ))}
              </div>
            )}
            {/* Debug info */}
          </div>

          <div style={styles.label}>Select City & State <span style={{ color: '#ff6e95' }}>*</span></div>
          <div style={styles.fieldPill}><div style={styles.inputRow}><input style={styles.input} value={city} onChange={(e)=>handleCityChange(e.target.value)} placeholder="Enter City, State (e.g., Toronto, ON)"/></div></div>

          {showCitySuggestions && citySuggestions.length > 0 && (
            <div style={{ marginTop: 8, padding: '0 16px', background: '#EFF7F7', borderRadius: 40, border: '1.5px solid #E5F1F1' }}>
              {citySuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 14, color: '#80B0B0' }}
                  onClick={() => {
                    setCity(suggestion);
                    setCityValidation({ isValid: true, error: null, isValidating: false });
                    setShowCitySuggestions(false);
                    setState(suggestion.split(',')[1].trim());
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {cityValidation.error && (
            <div style={{ color: '#ff3333', fontSize: 12, marginTop: 4, marginLeft: 16 }}>
              {cityValidation.error}
            </div>
          )}

          <div style={styles.label}>Postal Code <span style={{ color: '#ff6e95' }}>*</span></div>
          <div style={styles.fieldPill}><div style={styles.inputRow}><input style={styles.input} value={postal} onChange={(e)=>handlePostalChange(e.target.value)} placeholder="Enter Postal code (e.g., M5H 2M9)"/></div></div>
          
          {postalCodeValidation.error && (
            <div style={{ color: '#ff3333', fontSize: 12, marginTop: 4, marginLeft: 16 }}>
              {postalCodeValidation.error}
            </div>
          )}
          
          {postalCodeValidation.isValidating && (
            <div style={{ color: '#2a46a8', fontSize: 12, marginTop: 4, marginLeft: 16 }}>
              Validating postal code...
            </div>
          )}

          <div style={styles.consent}>We use your address to personalize your experience and, in some cases, to confirm your eligibility for specific offers. We never share this information without your explicit permission, and always follow our Privacy Policy, Terms of Service, and local laws.</div>
          <button style={isLoading ? styles.loadingBtn : styles.nextBtn} onClick={onNext} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Next'}
          </button>
          {/* <button style={styles.skipBtn} onClick={onSkip} disabled={isLoading}>
            Skip Address
          </button> */}
          {error && <div style={styles.error}>{error}</div>}
        </div>
      </div>
    </AppLayout>
  )
}


