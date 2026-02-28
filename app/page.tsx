'use client';

export default function HomePage() {
  // Immediate redirect with no loading state
  if (typeof window !== 'undefined') {
    window.location.replace('/working-app');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '1.1em',
          margin: '0'
        }}>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
