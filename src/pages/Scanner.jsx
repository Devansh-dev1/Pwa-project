import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

const QRScannerSimulator = ({ onScan, isScanning }) => {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied or not available');
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const simulateQRScan = () => {
    // Simulate scanning a QR code
    const mockQRData = {
      type: 'booth',
      id: 'booth_123',
      name: 'Tech Innovation Hub',
      data: 'https://showtrail.com/booth/123'
    };
    onScan(mockQRData);
  };

  if (error) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        textAlign: 'center'
      }}>
        <span style={{ fontSize: 64, marginBottom: 20 }}>📷</span>
        <h3 style={{ margin: '0 0 12px', color: '#1E1F24' }}>Camera Not Available</h3>
        <p style={{ margin: '0 0 20px', color: '#6B7280' }}>
          {error}
        </p>
        <button
          onClick={() => setError(null)}
          style={{
            background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      {/* Camera View */}
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: '#000'
        }}
        playsInline
        muted
      />

      {/* Scanning Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Scanning Frame */}
        <div style={{
          width: 250,
          height: 250,
          border: '3px solid #fff',
          borderRadius: 12,
          position: 'relative',
          background: 'transparent'
        }}>
          {/* Corner indicators */}
          <div style={{
            position: 'absolute',
            top: -3,
            left: -3,
            width: 30,
            height: 30,
            border: '6px solid #10b981',
            borderRight: 'transparent',
            borderBottom: 'transparent',
            borderRadius: '12px 0 0 0'
          }} />
          <div style={{
            position: 'absolute',
            top: -3,
            right: -3,
            width: 30,
            height: 30,
            border: '6px solid #10b981',
            borderLeft: 'transparent',
            borderBottom: 'transparent',
            borderRadius: '0 12px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -3,
            left: -3,
            width: 30,
            height: 30,
            border: '6px solid #10b981',
            borderRight: 'transparent',
            borderTop: 'transparent',
            borderRadius: '0 0 0 12px'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: 30,
            height: 30,
            border: '6px solid #10b981',
            borderLeft: 'transparent',
            borderTop: 'transparent',
            borderRadius: '0 0 12px 0'
          }} />

          {/* Scanning line animation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
            animation: 'scan 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      {/* Demo button (for testing) */}
      <button
        onClick={simulateQRScan}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(16, 185, 129, 0.9)',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        Simulate QR Scan (Demo)
      </button>

      {/* Styles */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; opacity: 1; }
          50% { top: 50%; opacity: 0.5; }
          100% { top: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const ScanResult = ({ result, onClose, onAction }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      margin: 20,
      maxWidth: 320,
      width: '100%'
    }}>
      {/* Success Icon */}
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: '#dcfce7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <span style={{ fontSize: 32, color: '#16a34a' }}>✓</span>
      </div>

      <h3 style={{ margin: '0 0 8px', textAlign: 'center', color: '#1E1F24' }}>
        QR Code Scanned!
      </h3>
      
      <p style={{ margin: '0 0 16px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
        Found: {result.name}
      </p>

      <div style={{
        background: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 12,
        color: '#6B7280',
        wordBreak: 'break-all'
      }}>
        {result.data}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            background: '#f8f9fa',
            color: '#6B7280',
            border: 'none',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Close
        </button>
        <button
          onClick={() => onAction(result)}
          style={{
            flex: 1,
            background: 'linear-gradient(90deg, #2a46a8 0%, #17275c 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

export default function Scanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    // Start scanning when component mounts
    setIsScanning(true);
    
    return () => {
      // Stop scanning when component unmounts
      setIsScanning(false);
    };
  }, []);

  const handleScan = (result) => {
    setScanResult(result);
    setIsScanning(false);
  };

  const handleScanResultAction = (result) => {
    // Navigate based on QR code type
    switch (result.type) {
      case 'booth':
        navigate(`/booths/${result.id}`);
        break;
      case 'event':
        navigate(`/events/${result.id}`);
        break;
      case 'giveaway':
        navigate(`/giveaways/${result.id}`);
        break;
      default:
        // Handle generic URL
        if (result.data.startsWith('http')) {
          window.open(result.data, '_blank');
        }
        break;
    }
    setScanResult(null);
  };

  const handleCloseScanResult = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <AppLayout hideBottomNav={true}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: 'rgba(0,0,0,0.5)',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 12,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff'
          }}
        >
          ←
        </button>

        <h2 style={{ 
          margin: 0, 
          color: '#fff', 
          fontSize: 18, 
          fontWeight: 600 
        }}>
          Scan QR Code
        </h2>

        <div style={{ width: 40 }} /> {/* Spacer */}
      </div>

      {/* Scanner */}
      <QRScannerSimulator 
        onScan={handleScan}
        isScanning={isScanning}
      />

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        textAlign: 'center',
        color: '#fff',
        zIndex: 10
      }}>
        <p style={{ 
          margin: '0 0 8px', 
          fontSize: 16, 
          fontWeight: 500,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          Point your camera at a QR code
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: 14, 
          opacity: 0.8,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          Scan booth codes, event tickets, and more
        </p>
      </div>

      {/* Scan Result Modal */}
      {scanResult && (
        <ScanResult
          result={scanResult}
          onClose={handleCloseScanResult}
          onAction={handleScanResultAction}
        />
      )}
    </AppLayout>
  );
}
