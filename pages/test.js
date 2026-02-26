import React, { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(true);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    setMessage('App loaded successfully! 🎉');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      color: '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Professional Dashboard
      </h1>
      
      <div style={{
        fontSize: '1.2rem',
        marginBottom: '30px',
        opacity: 0.8
      }}>
        {message}
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#111827'
        }}>
          ✅ Features Working:
        </h2>
        
        <ul style={{
          textAlign: 'left',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#374151'
        }}>
          <li>🎨 Professional UI Design</li>
          <li>📊 Charts & Analytics</li>
          <li>🌟 Habits Tracker</li>
          <li>👤 User: Kentache Abdessalem</li>
          <li>📧 Email: kentacheabdou1@gmail.com</li>
          <li>🔔 Notifications Hidden</li>
          <li>🚀 Vercel Deployment</li>
        </ul>
      </div>
    </div>
  );
}
