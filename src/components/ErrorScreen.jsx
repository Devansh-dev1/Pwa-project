export default function ErrorScreen({ 
  title = 'Something went wrong', 
  message = 'Please try again later',
  onRetry,
  onGoBack
}) {
  return (
    <div style={{ 
      height: 'calc(var(--vh, 1vh) * 100)', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(180deg, #fff 80%, #eff7f7 100%)',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: 430, width: '100%' }}>
        {/* Error icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#fff5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '2px solid #fecaca'
        }}>
          <span style={{ fontSize: 32, color: '#dc3545' }}>⚠️</span>
        </div>
        
        <h2 style={{ 
          margin: '0 0 12px', 
          color: '#1E1F24',
          fontSize: 24,
          fontWeight: 600
        }}>
          {title}
        </h2>
        
        <p style={{ 
          margin: '0 0 32px', 
          color: '#6B7280', 
          fontSize: 16,
          lineHeight: 1.5
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {onRetry && (
            <button 
              onClick={onRetry}
              style={{ 
                height: 56, 
                padding: '0 24px', 
                borderRadius: 999, 
                color: '#fff', 
                background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Try Again
            </button>
          )}
          
          {onGoBack && (
            <button 
              onClick={onGoBack}
              style={{ 
                height: 56, 
                padding: '0 24px', 
                borderRadius: 999, 
                background: '#EFF7F7', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#556BB9',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
