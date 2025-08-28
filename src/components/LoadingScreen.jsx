export default function LoadingScreen({ message = 'Loading...' }) {
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
      <div style={{ textAlign: 'center', maxWidth: 430 }}>
        {/* Loading spinner */}
        <div 
          className="loading-spinner"
          style={{
            width: 48,
            height: 48,
            border: '4px solid #E6E9FA',
            borderTop: '4px solid #2a46a8',
            borderRadius: '50%',
            margin: '0 auto 20px'
          }} 
        />
        
        <p style={{ 
          margin: 0, 
          color: '#6B7280', 
          fontSize: 16,
          fontWeight: 500
        }}>
          {message}
        </p>
      </div>
    </div>
  );
}
