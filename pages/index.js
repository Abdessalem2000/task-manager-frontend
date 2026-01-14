import React, { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme) {
        setDarkMode(JSON.parse(savedTheme) === 'dark');
      }
    } catch (e) {
      console.warn('Failed to load theme preference:', e);
    }
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontSize: '24px',
        color: 'white',
        fontWeight: '600'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
          <div>Loading TaskFlow Pro...</div>
        </div>
      </div>
    );
  }

  const theme = darkMode ? {
    bg: '#1a1a1a',
    cardBg: '#2d2d2d',
    text: '#ffffff',
    border: '#404040',
    hoverBg: '#3d3d3d'
  } : {
    bg: '#f8f9fa',
    cardBg: '#ffffff',
    text: '#202124',
    border: '#e0e0e0',
    hoverBg: '#f1f3f4'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: theme.cardBg,
        borderBottom: `1px solid ${theme.border}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          TaskFlow Pro
        </h1>
        
        <button
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);
            try {
              localStorage.setItem('darkMode', JSON.stringify(newMode ? 'dark' : 'light'));
            } catch (e) {
              console.warn('Failed to save theme preference:', e);
            }
          }}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: '#667eea',
            transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            margin: '0 0 16px 0',
            fontSize: '1.8rem',
            fontWeight: '600'
          }}>
            Welcome to TaskFlow Pro
          </h2>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: darkMode ? '#b0b0b0' : '#5f6368'
          }}>
            Your professional task management dashboard. Organize, track, and complete your tasks with style.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #667eea'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '600' }}>Total Tasks</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>0</p>
          </div>
          
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #1DB954'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '600' }}>Completed</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1DB954' }}>0</p>
          </div>
          
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #FF6B35'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '600' }}>In Progress</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#FF6B35' }}>0</p>
          </div>
        </div>

        {/* Database Status */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#FF6B35'
          }}></div>
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>🔴 Offline Mode - Tasks may not sync</span>
        </div>

        {/* API Test Section */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '12px',
          padding: '24px',
          marginTop: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4rem', fontWeight: '600' }}>API Status</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => fetch('/api/ping').then(r => r.json()).then(console.log)}
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Test Ping API
            </button>
            <button
              onClick={() => fetch('/api/tasks').then(r => r.json()).then(console.log)}
              style={{
                backgroundColor: '#1DB954',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Test Tasks API
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
