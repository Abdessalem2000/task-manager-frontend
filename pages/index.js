import React, { useState, useEffect } from 'react';
import DashboardCharts from '../src/components/DashboardCharts';
import HabitTracker from '../src/components/HabitTracker';
import TaskList from '../src/components/TaskList';

export default function Home() {
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ name: 'yahia', email: 'yahia@example.com' });
  const [tasks, setTasks] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showHabits, setShowHabits] = useState(false);
  const [habits, setHabits] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [completedToday, setCompletedToday] = useState(3);
  const [weeklyGoal, setWeeklyGoal] = useState(20);
  const [weeklyProgress, setWeeklyProgress] = useState(12);
  const [showNotifications, setShowNotifications] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Task "Complete project" is due tomorrow', type: 'warning', time: '2 hours ago' },
    { id: 2, message: 'You completed 5 tasks today! Great job!', type: 'success', time: '1 hour ago' },
    { id: 3, message: 'New habit "Exercise" streak: 7 days', type: 'info', time: '30 minutes ago' }
  ]);

  // ALL useEffect hooks must be called unconditionally
  const fetchTasks = async () => {
    try {
      console.log('🔄 Fetching tasks from /api/tasks...');
      
      // For Vercel, always use relative paths
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      const tasks = data.tasks || data;
      const connected = data.dbConnected !== undefined ? data.dbConnected : true;
      
      setTasks(tasks || []);
      setDbConnected(connected);
      
      if (connected) {
        showToast('🟢 Connected to Database', 'success');
      } else {
        showToast('⚠️ Using Mock Data - Database unavailable', 'warning');
      }
      
      console.log('✅ Tasks fetched successfully:', tasks);
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      // Set fallback data to prevent white screen
      setTasks([
        { _id: '1', name: 'Welcome to Professional Dashboard', completed: false, priority: 'high', category: 'work' },
        { _id: '2', name: 'Explore premium features', completed: true, priority: 'medium', category: 'personal' },
        { _id: '3', name: 'Experience smooth animations', completed: false, priority: 'low', category: 'shopping' }
      ]);
      setDbConnected(false);
      showToast('🔴 Database Connection Failed - Using Offline Mode', 'error');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchTasks();
    
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme) {
        setDarkMode(JSON.parse(savedTheme));
      }
    } catch (e) {
      console.warn('Failed to load theme preference:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, [darkMode]);

  // Premium SaaS theme with professional styling
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
    glassBorder: 'rgba(255, 255, 255, 0.1)'
  } : {
    bg: '#FAFAFA',
    cardBg: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    hoverBg: '#F9FAFB',
    subtext: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
    chartGrid: '#E5E7EB',
    chartText: '#111827',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    accent: '#6366F1',
    glass: 'rgba(0, 0, 0, 0.02)',
    glassBorder: 'rgba(0, 0, 0, 0.05)'
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // NO EARLY RETURNS - ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
      position: 'relative'
    }}>
      {/* Premium Loading Screen with animations */}
      {!mounted ? (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          background: theme.gradient,
          fontSize: '24px',
          color: 'white',
          fontWeight: '600',
          zIndex: 9999,
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '24px',
              animation: 'pulse 2s infinite',
              background: 'linear-gradient(45deg, #fff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>⚡</div>
            <div style={{ 
              fontSize: '18px',
              fontWeight: '500',
              opacity: 0.9,
              letterSpacing: '0.5px'
            }}>Loading Professional Dashboard...</div>
            <div style={{
              marginTop: '16px',
              fontSize: '14px',
              opacity: 0.7
            }}>Preparing your workspace</div>
          </div>
        </div>
      ) : (
        <>
          {/* Premium Database Status Bar with smooth transitions */}
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            background: dbConnected 
              ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
            color: 'white',
            padding: '12px 20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '9999',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: dbConnected ? '#10F981' : '#FCA5A5',
                boxShadow: dbConnected ? '0 0 10px #10F981' : '0 0 10px #FCA5A5',
                animation: dbConnected ? 'pulse 2s infinite' : 'none'
              }}></span>
              {dbConnected ? '🟢 Connected to Database' : '🔴 Initializing Connection...'}
            </span>
          </div>

          {/* Main App Content */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '60px 20px 20px'
          }}>
          {/* Premium Header with Glass Morphism */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            padding: '32px',
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderRadius: '20px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.glassBorder}`,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: theme.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: '700',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                  animation: 'shimmer 3s infinite'
                }}></div>
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 style={{
                  margin: '0',
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: theme.text,
                  background: theme.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px'
                }}>
                  Welcome back, {user.name}!
                </h1>
                <p style={{
                  margin: '8px 0 0 0',
                  color: theme.subtext,
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '0.25px'
                }}>
                  {user.email} • Professional Dashboard
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setShowProfileSettings(true)}
                style={{
                  padding: '14px 24px',
                  background: theme.glass,
                  border: `1px solid ${theme.glassBorder}`,
                  borderRadius: '12px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = theme.hoverBg;
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = theme.glass;
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  padding: '14px 24px',
                  background: theme.gradient,
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)';
                }}
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                🔔
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {notifications.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setShowProfileSettings(true)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ⚙️ Settings
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
          </header>

          {/* Notifications Panel */}
          {showNotifications && (
            <div style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              width: '350px',
              maxHeight: '400px',
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              zIndex: '9998',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '15px',
                borderBottom: `1px solid ${theme.border}`,
                backgroundColor: theme.hoverBg
              }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                  Notifications ({notifications.length})
                </h3>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(notification => (
                  <div key={notification.id} style={{
                    padding: '15px',
                    borderBottom: `1px solid ${theme.border}`,
                    borderLeft: `4px solid ${
                      notification.type === 'success' ? theme.success :
                      notification.type === 'warning' ? theme.warning :
                      notification.type === 'error' ? theme.danger : '#667eea'
                    }`
                  }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                      {notification.message}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: theme.subtext }}>
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid theme.success',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(29, 185, 84, 0.1)'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: theme.subtext, fontWeight: '500' }}>
                  Total Tasks
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: theme.text, marginBottom: '10px' }}>
                  {tasks.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: theme.success }}>
                  +{completedToday} completed today
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid theme.warning',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 167, 38, 0.1)'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: theme.subtext, fontWeight: '500' }}>
                  Completed
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: theme.text, marginBottom: '10px' }}>
                  {tasks.filter(t => t.completed).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: theme.success }}>
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}% completion rate
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid theme.danger',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 107, 53, 0.1)'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: theme.subtext, fontWeight: '500' }}>
                  Pending
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: theme.text, marginBottom: '10px' }}>
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: theme.warning }}>
                  {tasks.filter(t => !t.completed && t.priority === 'high').length} high priority
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #667eea',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(102, 126, 234, 0.1)'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: theme.subtext, fontWeight: '500' }}>
                  Weekly Progress
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: theme.text, marginBottom: '10px' }}>
                  {weeklyProgress}/{weeklyGoal}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#667eea' }}>
                  {Math.round((weeklyProgress / weeklyGoal) * 100)}% complete
                </div>
              </div>
            </div>
          </div>

          {/* Charts Component */}
          <DashboardCharts 
            tasks={tasks}
            theme={theme}
            showCharts={showCharts}
            setShowCharts={setShowCharts}
          />

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '25px',
            borderBottom: `2px solid ${theme.border}`,
            paddingBottom: '10px'
          }}>
            {['tasks', 'habits', 'stats'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'tasks') { setShowHabits(false); setShowStats(false); }
                  if (tab === 'habits') { setShowHabits(true); setShowStats(false); }
                  if (tab === 'stats') { setShowHabits(false); setShowStats(true); }
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 
                    (tab === 'tasks' && !showHabits && !showStats) ||
                    (tab === 'habits' && showHabits) ||
                    (tab === 'stats' && showStats)
                      ? theme.gradient : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 
                    (tab === 'tasks' && !showHabits && !showStats) ||
                    (tab === 'habits' && showHabits) ||
                    (tab === 'stats' && showStats)
                      ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'tasks' && '📝 Tasks'}
                {tab === 'habits' && '🌟 Habits'}
                {tab === 'stats' && '📊 Stats'}
              </button>
            ))}
          </div>

          {/* Task List Component */}
          <TaskList 
            tasks={tasks}
            setTasks={setTasks}
            theme={theme}
            showHabits={showHabits}
            showStats={showStats}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            showToast={showToast}
            dbConnected={dbConnected}
            isAddingTask={isAddingTask}
            setIsAddingTask={setIsAddingTask}
          />

          {/* Habit Tracker Component */}
          <HabitTracker 
            habits={habits}
            setHabits={setHabits}
            theme={theme}
            showHabits={showHabits}
            setShowHabits={setShowHabits}
            showToast={showToast}
          />

          {/* Toast Notifications */}
          {toasts.map(toast => (
            <div
              key={toast.id}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 20px',
                backgroundColor: 
                  toast.type === 'success' ? theme.success :
                  toast.type === 'error' ? theme.danger :
                  toast.type === 'warning' ? theme.warning : theme.hoverBg,
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: '9999',
                fontSize: '14px',
                fontWeight: '500',
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              {toast.message}
            </div>
          ))}

          {/* Debug Info */}
          <div style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            padding: '5px 10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '10px',
            zIndex: '9999'
          }}>
            Tasks: {tasks.length} | DB: {dbConnected ? '🟢' : '🔴'}
          </div>
        </div>

        {/* Profile Settings Modal */}
        {showProfileSettings && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999'
          }}>
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text
              }}>
                Profile Settings
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.text
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: theme.bg,
                    color: theme.text
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.text
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: theme.bg,
                    color: theme.text
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowProfileSettings(false)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: theme.hoverBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    showToast('Profile updated successfully! ✅', 'success');
                    setShowProfileSettings(false);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: theme.success,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}
