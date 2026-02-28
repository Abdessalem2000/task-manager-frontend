'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Immediate redirect to working-app
    if (typeof window !== 'undefined') {
      window.location.href = '/working-app';
    }
  }, []);

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
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{ 
          color: '#6b7280', 
          fontSize: '1.1em',
          margin: '0'
        }}>
          Loading Professional Dashboard...
        </p>
      </div>
    </div>
  );
}
