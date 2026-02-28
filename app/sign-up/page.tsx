'use client';

import { useEffect } from 'react';

export default function SignUpPage() {
  useEffect(() => {
    // Redirect to working-app
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
        <p style={{ color: '#6b7280', fontSize: '1.1em' }}>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
