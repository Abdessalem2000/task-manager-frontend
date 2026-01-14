import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading Task Manager...
      </div>
    );
  }

  return (
    <div>
      <h1>Task Manager - Next.js Version</h1>
      <p>Application is loading...</p>
    </div>
  );
}
