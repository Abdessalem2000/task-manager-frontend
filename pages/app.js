import React, { useState } from 'react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  const theme = darkMode ? {
    bg: '#0F0F0F',
    cardBg: '#1A1A1A',
    text: '#FFFFFF',
    primary: '#6366F1',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
  } : {
    bg: '#FAFAFA',
    cardBg: '#FFFFFF',
    text: '#111827',
    primary: '#6366F1',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
  };

  const tasks = [
    { _id: '1', name: 'Complete project documentation', completed: false, priority: 'high', progress: 75 },
    { _id: '2', name: 'Review pull requests', completed: true, priority: 'medium', progress: 100 },
    { _id: '3', name: 'Update dependencies', completed: false, priority: 'low', progress: 30 },
    { _id: '4', name: 'Grocery shopping', completed: false, priority: 'medium', progress: 0 },
    { _id: '5', name: 'Gym workout', completed: true, priority: 'high', progress: 100 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          borderRadius: '15px',
          background: theme.cardBg,
          boxShadow: theme.shadow,
        }}>
          <h1 style={{ fontSize: '2.5em', margin: 0, color: theme.primary }}>
            ✨ Professional Dashboard
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: theme.primary,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '40px',
        }}>
          {[
            { icon: '📊', value: tasks.length, label: 'Total Tasks' },
            { icon: '✅', value: tasks.filter(t => t.completed).length, label: 'Completed' },
            { icon: '🎯', value: '3', label: 'Completed Today' },
            { icon: '📈', value: '60%', label: 'Progress' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: theme.cardBg,
                padding: '25px',
                borderRadius: '15px',
                boxShadow: theme.shadow,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>{stat.icon}</div>
              <h3 style={{ margin: 0, fontSize: '1.5em', color: theme.text }}>{stat.value}</h3>
              <p style={{ margin: '5px 0 0', color: '#666' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div style={{
          background: theme.cardBg,
          padding: '25px',
          borderRadius: '15px',
          boxShadow: theme.shadow,
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: theme.text }}>📋 Tasks</h2>
          {tasks.map(task => (
            <div
              key={task._id}
              style={{
                padding: '15px',
                margin: '10px 0',
                background: darkMode ? '#2A2A2A' : '#F8F9FA',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{task.name}</strong>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Priority: {task.priority} | Progress: {task.progress}%
                </div>
              </div>
              <span style={{
                padding: '5px 10px',
                borderRadius: '5px',
                background: task.completed ? '#10B981' : '#F59E0B',
                color: 'white',
                fontSize: '0.8em',
              }}>
                {task.completed ? '✅ Done' : '⏳ Pending'}
              </span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '20px',
          background: theme.cardBg,
          borderRadius: '15px',
          boxShadow: theme.shadow,
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: theme.text }}>🚀 Features Available</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            textAlign: 'left',
          }}>
            <div>✅ Task Management</div>
            <div>✅ Progress Tracking</div>
            <div>✅ Dark/Light Mode</div>
            <div>✅ Professional UI</div>
            <div>✅ Responsive Design</div>
            <div>✅ Real-time Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}
