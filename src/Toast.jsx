import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose, darkMode }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '16px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(20px)',
      border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
      minWidth: '300px',
      maxWidth: '400px',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out',
      transition: 'all 0.3s ease'
    };

    const typeStyles = {
      success: {
        backgroundColor: darkMode ? '#181818' : '#ffffff',
        color: darkMode ? '#FFFFFF' : '#202124',
        borderLeft: '4px solid #1DB954'
      },
      error: {
        backgroundColor: darkMode ? '#181818' : '#ffffff',
        color: darkMode ? '#FFFFFF' : '#202124',
        borderLeft: '4px solid #E3242B'
      },
      info: {
        backgroundColor: darkMode ? '#181818' : '#ffffff',
        color: darkMode ? '#FFFFFF' : '#202124',
        borderLeft: '4px solid #1A73E8'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  const getIconColor = () => {
    const colors = {
      success: '#1DB954',
      error: '#E3242B',
      info: '#1A73E8'
    };
    return colors[type] || colors.info;
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={getToastStyles()}>
        <div style={{
          fontSize: '18px',
          color: getIconColor(),
          flexShrink: 0
        }}>
          {getIcon()}
        </div>
        <div style={{
          flex: 1,
          color: darkMode ? '#FFFFFF' : '#202124'
        }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: darkMode ? '#A7A7A7' : '#5f6368',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
            opacity: '0.7',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Toast;
