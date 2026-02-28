import React, { useState } from 'react';
import DashboardCharts from '../src/components/DashboardCharts';

export default function TestCharts() {
  const [showCharts, setShowCharts] = useState(true);
  
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
    { _id: '1', name: 'Complete project documentation', priority: 'high', category: 'work', completed: false, progress: 75 },
    { _id: '2', name: 'Review pull requests', priority: 'medium', category: 'work', completed: true, progress: 100 },
    { _id: '3', name: 'Update dependencies', priority: 'low', category: 'work', completed: false, progress: 30 },
    { _id: '4', name: 'Grocery shopping', priority: 'medium', category: 'shopping', completed: false, progress: 0 },
    { _id: '5', name: 'Gym workout', priority: 'high', category: 'personal', completed: true, progress: 100 },
    { _id: '6', name: 'Read book chapter', priority: 'low', category: 'personal', completed: false, progress: 25 },
    { _id: '7', name: 'Buy birthday gift', priority: 'medium', category: 'shopping', completed: true, progress: 100 }
  ];

  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: theme.bg,
      minHeight: '100vh'
    }}>
      <h1>🧪 Charts Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCharts(!showCharts)}
          style={{
            padding: '10px 20px',
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      <DashboardCharts 
        tasks={sampleTasks}
        theme={theme}
        showCharts={showCharts}
        setShowCharts={setShowCharts}
      />
    </div>
  );
}
