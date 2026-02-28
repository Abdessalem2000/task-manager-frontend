import React, { useState } from 'react';
import DashboardCharts from '../src/components/DashboardCharts';

export default function TestAnalytics() {
  const [showCharts, setShowCharts] = useState(false);
  
  const theme = {
    bg: '#FAFAFA',
    cardBg: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    hoverBg: '#F3F4F6',
    subtext: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
    chartGrid: '#E5E7EB',
    chartText: '#374151',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    accent: '#6366F1',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    primary: '#6366F1',
    buttonBg: '#6366F1',
    buttonText: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputText: '#111827',
    borderColor: '#D1D5DB',
    textSecondary: '#6B7280'
  };

  const sampleTasks = [
    { _id: '1', name: 'Complete project documentation', completed: false, priority: 'high', category: 'work', progress: 75 },
    { _id: '2', name: 'Review pull requests', completed: true, priority: 'medium', category: 'work', progress: 100 },
    { _id: '3', name: 'Update dependencies', completed: false, priority: 'low', category: 'work', progress: 30 },
    { _id: '4', name: 'Grocery shopping', completed: false, priority: 'medium', category: 'personal', progress: 0 },
    { _id: '5', name: 'Gym workout', completed: true, priority: 'high', category: 'personal', progress: 100 }
  ];

  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: theme.bg,
      minHeight: '100vh'
    }}>
      <h1>🧪 Analytics Button Test</h1>
      <p>This page tests the exact same functionality as the main dashboard.</p>
      
      {!showCharts ? (
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setShowCharts(true)}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
            }}
          >
            📊 Show Professional Analytics
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: theme.text }}>
              📊 Analytics Dashboard
            </h2>
            <button
              onClick={() => setShowCharts(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: theme.hoverBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Hide Charts
            </button>
          </div>

          <DashboardCharts 
            tasks={sampleTasks}
            theme={theme}
            showCharts={showCharts}
            setShowCharts={setShowCharts}
          />
        </>
      )}
    </div>
  );
}
