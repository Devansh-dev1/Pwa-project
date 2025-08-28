import { useNavigate } from 'react-router-dom';

export default function BackButton({ onBack, style = {}, show = true }) {
  const navigate = useNavigate();

  if (!show) return null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        width: 48,
        height: 48,
        borderRadius: 12,
        background: '#fff',
        border: '1.5px solid #E6E9FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ...style
      }}
    >
      <span style={{ 
        fontSize: 18, 
        color: '#6B7280',
        transform: 'rotate(180deg)',
        lineHeight: 1
      }}>
        →
      </span>
    </button>
  );
}
