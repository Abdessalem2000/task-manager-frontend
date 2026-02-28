import React, { useState, useEffect } from 'react';
import DashboardCharts from '../src/components/DashboardCharts';
import HabitTracker from '../src/components/HabitTracker';
import TaskList from '../src/components/TaskList';
import AuthWrapper from '../src/components/AuthWrapper';

// WORKING APP WITH GUARANTEED DATA DISPLAY
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

export default function WorkingApp() {
  console.log('🚀 WORKING APP LOADING');
  
  // State management with guaranteed initial data
  const [mounted, setMounted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState({ 
    name: 'Demo User', 
    email: 'demo@example.com' 
  });
  const [tasks, setTasks] = useState([
    { _id: '1', name: 'Complete project documentation', priority: 'high', category: 'work', completed: false, progress: 75 },
    { _id: '2', name: 'Review pull requests', priority: 'medium', category: 'work', completed: true, progress: 100 },
    { _id: '3', name: 'Update dependencies', priority: 'low', category: 'work', completed: false, progress: 30 },
    { _id: '4', name: 'Grocery shopping', priority: 'medium', category: 'shopping', completed: false, progress: 0 },
    { _id: '5', name: 'Gym workout', priority: 'high', category: 'personal', completed: true, progress: 100 },
    { _id: '6', name: 'Read book chapter', priority: 'low', category: 'personal', completed: false, progress: 25 },
    { _id: '7', name: 'Buy birthday gift', priority: 'medium', category: 'shopping', completed: true, progress: 100 }
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
  const [habits, setHabits] = useState([
    { _id: '1', name: 'Morning Exercise', completed: true, streak: 7, icon: '🏃‍♂️', color: '#10B981' },
    { _id: '2', name: 'Read for 30 mins', completed: true, streak: 5, icon: '📚', color: '#6366F1' },
    { _id: '3', name: 'Meditation', completed: false, streak: 3, icon: '🧘‍♂️', color: '#8B5CF6' }
  ]);
  const [showHabits, setShowHabits] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [completedToday, setCompletedToday] = useState(1);
  const [weeklyGoal, setWeeklyGoal] = useState(20);

  // Theme management
  useEffect(() => {
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
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (e) {
        console.warn('Failed to save theme preference:', e);
      }
    }
  }, [darkMode]);

  // REAL DATABASE FETCHING (with fallback to current data)
  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks from API...');
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        console.log('Tasks fetched:', data);
        
        // Handle both direct array and wrapped response
        const tasksData = Array.isArray(data) ? data : (data.tasks || []);
        const isConnected = data.dbConnected !== undefined ? data.dbConnected : true;
        
        console.log('Parsed tasks:', tasksData.length, 'Connected:', isConnected);
        
        if (tasksData.length > 0) {
          setTasks(tasksData);
          setDbConnected(isConnected);
          
          // Calculate completed today
          const today = new Date().toDateString();
          const todayTasks = tasksData.filter(task => 
            task.completed && new Date(task.updatedAt).toDateString() === today
          );
          setCompletedToday(todayTasks.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // Keep current data as fallback
    }
  };

  const fetchHabits = async () => {
    try {
      console.log('Fetching habits from API...');
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        console.log('Habits fetched:', data);
        
        // Handle both direct array and wrapped response
        const habitsData = Array.isArray(data) ? data : (data.habits || []);
        
        if (habitsData.length > 0) {
          setHabits(habitsData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      // Keep current data as fallback
    }
  };

  // Initial data fetch and mobile detection
  useEffect(() => {
    console.log('Working app mounted, fetching data...');
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    // Fetch real data with delay to ensure UI loads first
    const timer1 = setTimeout(() => {
      fetchTasks();
    }, 500);
    
    const timer2 = setTimeout(() => {
      fetchHabits();
    }, 800);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Theme object
  const theme = darkMode ? {
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
  };

  // Toast notification
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Real-time stats calculation
  const stats = [
    { icon: '📊', value: tasks.length, label: 'Total Tasks' },
    { icon: '✅', value: tasks.filter(t => t.completed).length, label: 'Completed' },
    { icon: '🎯', value: completedToday, label: 'Completed Today' },
    { icon: '📈', value: weeklyGoal > 0 ? Math.round((completedToday / weeklyGoal) * 100) + '%' : '0%', label: 'Progress' },
  ];

  console.log('Rendering working app with', tasks.length, 'tasks and', habits.length, 'habits');

  return (
    <AuthWrapper>
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
        {/* Professional Layout Container */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
          gap: '30px',
          minHeight: '100vh',
        }}>
          
          {/* Sidebar - Only show on desktop */}
          {!isMobile && (
            <div style={{
              background: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.glassBorder}`,
              backdropFilter: 'blur(10px)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px',
            }}>
              {/* User Profile Section */}
              <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: theme.primary,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5em',
                  margin: '0 auto 15px',
                  boxShadow: theme.shadow,
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 style={{ margin: '10px 0 5px 0', color: theme.text, fontSize: '1.1em' }}>
                  {user.name}
                </h3>
                <p style={{ margin: '0', color: theme.textSecondary, fontSize: '0.9em' }}>
                  {user.email}
                </p>
              </div>

              {/* Quick Stats */}
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: theme.text, fontSize: '1em' }}>
                  📊 Quick Stats
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    background: theme.hoverBg,
                    borderRadius: '8px',
                    fontSize: '0.9em',
                  }}>
                    <span style={{ color: theme.textSecondary }}>Total Tasks</span>
                    <span style={{ fontWeight: 'bold', color: theme.primary }}>{tasks.length}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    background: theme.hoverBg,
                    borderRadius: '8px',
                    fontSize: '0.9em',
                  }}>
                    <span style={{ color: theme.textSecondary }}>Completed</span>
                    <span style={{ fontWeight: 'bold', color: theme.success }}>{tasks.filter(t => t.completed).length}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    background: theme.hoverBg,
                    borderRadius: '8px',
                    fontSize: '0.9em',
                  }}>
                    <span style={{ color: theme.textSecondary }}>Progress</span>
                    <span style={{ fontWeight: 'bold', color: theme.primary }}>
                      {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: theme.text, fontSize: '1em' }}>
                  ⚡ Quick Actions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.buttonBg,
                      color: theme.buttonText,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: theme.shadow,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = theme.shadow;
                    }}
                  >
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                  </button>
                  <button
                    onClick={() => setShowProfileSettings(true)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.hoverBg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.buttonBg;
                      e.currentTarget.style.color = theme.buttonText;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.hoverBg;
                      e.currentTarget.style.color = theme.text;
                    }}
                  >
                    ⚙️ Profile Settings
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div style={{
                padding: '12px',
                background: dbConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${dbConnected ? theme.success : theme.warning}`,
                borderRadius: '8px',
                fontSize: '0.85em',
                textAlign: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: dbConnected ? theme.success : theme.warning,
                  fontWeight: '500',
                }}>
                  {dbConnected ? '🟢 Database Connected' : '🟡 Sample Data'}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}>
            {/* Header */}
            <div style={{
              background: theme.cardBg,
              borderRadius: '16px',
              padding: '30px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.glassBorder}`,
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}>
                <div>
                  <h1 style={{ fontSize: '2.2em', margin: '0', color: theme.primary, marginBottom: '5px' }}>
                    ✨ Professional Dashboard
                  </h1>
                  <p style={{ margin: '0', color: theme.textSecondary, fontSize: '1em' }}>
                    Welcome back, {user.name}! Here's your productivity overview.
                  </p>
                </div>
              </div>
            </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  background: theme.cardBg,
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: theme.shadow,
                  border: `1px solid ${theme.glassBorder}`,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  fontSize: '2em',
                  marginBottom: '8px',
                  color: theme.primary,
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '1.8em',
                  fontWeight: 'bold',
                  color: theme.text,
                  marginBottom: '4px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.9em',
                  color: theme.textSecondary,
                  fontWeight: '500',
                }}>
                  {stat.label}
                </div>
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
              tasks={tasks}
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
    </AuthWrapper>
  );
}
