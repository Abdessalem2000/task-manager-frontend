import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to working app
    window.location.href = '/working-app';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Loading Professional Dashboard...</h1>
        <p style={{ fontSize: '16px', opacity: 0.8 }}>Please wait while we load your workspace</p>
      </div>
    </div>
  );
}
