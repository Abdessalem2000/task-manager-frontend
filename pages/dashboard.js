import React, { useState, useEffect } from 'react';
import DashboardCharts from '../src/components/DashboardCharts';
import HabitTracker from '../src/components/HabitTracker';
import TaskList from '../src/components/TaskList';

// WORKING DASHBOARD - SIMPLIFIED TO AVOID SSR ISSUES
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page to try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Dashboard() {
  console.log('🚀 WORKING DASHBOARD LOADING');
  
  // Use light theme by default for SSR, will update on client
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ name: 'Kentache Abdessalem', email: 'kentacheabdou1@gmail.com' });
  const [tasks, setTasks] = useState([
    { _id: '1', name: 'Complete project documentation', completed: false, priority: 'high', category: 'work', progress: 75 },
    { _id: '2', name: 'Review pull requests', completed: true, priority: 'medium', category: 'work', progress: 100 },
    { _id: '3', name: 'Update dependencies', completed: false, priority: 'low', category: 'work', progress: 30 },
    { _id: '4', name: 'Grocery shopping', completed: false, priority: 'medium', category: 'personal', progress: 0 },
    { _id: '5', name: 'Gym workout', completed: true, priority: 'high', category: 'personal', progress: 100 },
    { _id: '6', name: 'Read technical articles', completed: false, priority: 'medium', category: 'personal', progress: 45 },
    { _id: '7', name: 'Plan weekend trip', completed: false, priority: 'low', category: 'shopping', progress: 10 }
  ]);
  const [dbConnected, setDbConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showHabits, setShowHabits] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [completedToday, setCompletedToday] = useState(3);
  const [weeklyGoal, setWeeklyGoal] = useState(20);

  useEffect(() => {
    setMounted(true);
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme) {
          setDarkMode(JSON.parse(savedTheme));
        }
      } catch (e) {
        console.warn('Failed to load theme preference:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && mounted) {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (e) {
        console.warn('Failed to save theme preference:', e);
      }
    }
  }, [darkMode, mounted]);

  // Use light theme for SSR, will update after mount
  const theme = !mounted ? {
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
  } : (darkMode ? {
    bg: '#0F0F0F',
    cardBg: '#1A1A1A', 
    text: '#FFFFFF',
    border: '#2A2A2A',
    hoverBg: '#252525',
    subtext: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
    chartGrid: '#2A2A2A',
    chartText: '#FFFFFF',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    accent: '#6366F1',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    primary: '#6366F1',
    buttonBg: '#6366F1',
    buttonText: '#FFFFFF',
    inputBg: '#2A2A2A',
    inputText: '#FFFFFF',
    borderColor: '#3A3A3A',
    textSecondary: '#9CA3AF'
  } : {
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
  });

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  if (!mounted) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        background: theme.gradient,
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Loading Professional Dashboard...</h1>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>Preparing your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        padding: 0,
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            padding: '20px',
            borderRadius: '15px',
            background: theme.cardBg,
            boxShadow: theme.shadow,
          }}>
            <h1 style={{ fontSize: '2.5em', margin: 0, color: theme.primary }}>✨ Professional Dashboard</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: theme.buttonBg,
                  color: theme.buttonText,
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '15px',
                  boxShadow: theme.shadow,
                  transition: 'background 0.3s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <div
                onClick={() => setShowProfileSettings(true)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: theme.primary,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1.2em',
                  boxShadow: theme.shadow,
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px',
            width: '100%',
            marginBottom: '40px',
          }}>
            {[
              { icon: '📊', value: tasks.length, label: 'Total Tasks' },
              { icon: '✅', value: tasks.filter(t => t.completed).length, label: 'Completed' },
              { icon: '🎯', value: completedToday, label: 'Completed Today' },
              { icon: '📈', value: Math.round((completedToday / weeklyGoal) * 100) + '%', label: 'Progress' },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: theme.cardBg,
                  padding: '25px',
                  borderRadius: '15px',
                  boxShadow: theme.shadow,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ color: theme.primary, fontSize: '2em', marginBottom: '10px' }}>{stat.icon}</div>
                <h3 style={{ margin: 0, fontSize: '1.5em', color: theme.text }}>{stat.value}</h3>
                <p style={{ margin: '5px 0 0', color: theme.textSecondary }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
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
            <DashboardCharts 
              data={tasks.map(task => ({ name: task.name, value: task.progress || 0 }))} 
              theme={theme}
              showCharts={showCharts}
              setShowCharts={setShowCharts}
            />
          )}

          {/* Habit Tracker Section */}
          <HabitTracker 
            habits={habits}
            setHabits={setHabits}
            theme={theme}
            showHabits={showHabits}
            setShowHabits={setShowHabits}
            showToast={showToast}
            darkMode={darkMode}
          />

          {/* Task List Section */}
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            theme={theme}
            showToast={showToast}
            isAddingTask={isAddingTask}
            setIsAddingTask={setIsAddingTask}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            dbConnected={dbConnected}
          />
        </div>

        {/* Profile Settings Modal */}
        {showProfileSettings && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              background: theme.cardBg,
              padding: '30px',
              borderRadius: '15px',
              boxShadow: theme.shadow,
              width: '90%',
              maxWidth: '500px',
              animation: 'scaleIn 0.3s ease-out',
            }}>
              <h2 style={{ color: theme.text, marginBottom: '20px' }}>Profile Settings</h2>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="userName" style={{ display: 'block', color: theme.textSecondary, marginBottom: '5px' }}>Name:</label>
                <input
                  id="userName"
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.borderColor}`,
                    background: theme.inputBg,
                    color: theme.inputText,
                    fontSize: '1em',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="userEmail" style={{ display: 'block', color: theme.textSecondary, marginBottom: '5px' }}>Email:</label>
                <input
                  id="userEmail"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.borderColor}`,
                    background: theme.inputBg,
                    color: theme.inputText,
                    fontSize: '1em',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setShowProfileSettings(false)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    boxShadow: theme.shadow,
                    transition: 'background 0.3s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast('Profile updated successfully!', 'success');
                    setShowProfileSettings(false);
                  }}
                  style={{
                    background: theme.primary,
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    boxShadow: theme.shadow,
                    transition: 'background 0.3s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}>
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                background: toast.type === 'success' ? '#4CAF50' : toast.type === 'warning' ? '#FF9800' : '#f44336',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                marginBottom: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                animation: 'slideIn 0.3s ease-out',
              }}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
