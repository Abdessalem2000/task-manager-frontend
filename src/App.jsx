import React, { useState, useEffect } from 'react';
import Auth from './Auth.jsx';
import ProfileSettings from './ProfileSettings.jsx';
import Toast from './Toast.jsx';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';

// Theme Toggle Component
const ThemeToggle = ({ darkMode, setDarkMode, theme, position = 'header' }) => {
  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    
    try {
      localStorage.setItem('darkMode', JSON.stringify(newTheme ? 'dark' : 'light'));
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  };

  return (
    <button
      onClick={handleThemeToggle}
      style={{
        backgroundColor: position === 'next-to-name' ? '#FF6B35' : 'transparent',
        border: position === 'next-to-name' ? '2px solid #FF6B35' : `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: position === 'next-to-name' ? '6px 10px' : '8px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: position === 'next-to-name' ? '16px' : '14px',
        color: position === 'next-to-name' ? 'white' : '#FF6B35',
        transition: 'all 0.2s ease',
        fontWeight: '600',
        zIndex: 9999,
        position: 'relative',
        boxShadow: position === 'next-to-name' ? '0 2px 8px rgba(255, 107, 53, 0.4)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (position === 'next-to-name') {
          e.target.style.backgroundColor = '#FF5722';
          e.target.style.transform = 'scale(1.1)';
        } else {
          e.target.style.backgroundColor = theme.hoverBg;
          e.target.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (position === 'next-to-name') {
          e.target.style.backgroundColor = '#FF6B35';
          e.target.style.transform = 'scale(1)';
        } else {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.transform = 'scale(1)';
        }
      }}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? '☀️' : '🌙'}
      {position !== 'next-to-name' && (
        <span style={{ fontSize: '12px' }}>
          {darkMode ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

// Sortable Task Card Component
const SortableTaskCard = ({ task, theme, darkMode, toggleTaskComplete, deleteTask, alarms, setShowAlarmPopup, priorityColors, categoryColors, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'grab',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      }}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 8px 0',
            color: theme.text,
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.6 : 1
          }}>
            {task.name}
          </h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              backgroundColor: priorityColors[task.priority] || '#667eea',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              {task.priority}
            </span>
            <span style={{
              backgroundColor: categoryColors[task.category] || '#667eea',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              {task.category}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => toggleTaskComplete(task._id)}
            style={{
              backgroundColor: task.completed ? '#34a853' : '#ea4335',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {task.completed ? '✓' : '○'}
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            style={{
              backgroundColor: '#ea4335',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error, errorInfo) => {
    console.error('🚨 ERROR BOUNDARY CAUGHT:', error, errorInfo);
    setHasError(true);
    setError(error);
  };

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>🚨 Something went wrong</h2>
        <p>UI has been protected from crashing.</p>
        <p>Check console for details.</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  
  // State hooks
  const [user, setUser] = useState({ name: 'yahia', email: 'yahia@example.com' });
  const [tasks, setTasks] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [toast, setToast] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskCategory, setTaskCategory] = useState('work');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [alarms, setAlarms] = useState({});
  const [showAlarmPopup, setShowAlarmPopup] = useState(null);
  const [showAlarmModal, setShowAlarmModal] = useState(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [badges, setBadges] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [habits, setHabits] = useState([]);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Effects
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode ? 'dark' : 'light'));
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen || true));
  }, [sidebarOpen]);

  useEffect(() => {
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
  }, []);

  useEffect(() => {
    const savedLevel = localStorage.getItem('userLevel');
    const savedXP = localStorage.getItem('userXP');
    const savedBadges = localStorage.getItem('badges');
    
    if (savedLevel) setUserLevel(parseInt(savedLevel) || 1);
    if (savedXP) setUserXP(parseInt(savedXP) || 0);
    if (savedBadges) setBadges(JSON.parse(savedBadges) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem('userXP', (userXP || 0).toString());
  }, [userXP]);

  useEffect(() => {
    localStorage.setItem('userLevel', (userLevel || 1).toString());
  }, [userLevel]);

  useEffect(() => {
    localStorage.setItem('dailyStreak', (dailyStreak || 1).toString());
  }, [dailyStreak]);

  useEffect(() => {
    if (lastActiveDate) {
      localStorage.setItem('lastActiveDate', lastActiveDate);
    }
  }, [lastActiveDate]);

  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges || []));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits || []));
  }, [habits]);

  useEffect(() => {
    const savedAlarms = localStorage.getItem('alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      Object.entries(alarms).forEach(([taskId, alarmTime]) => {
        const alarm = new Date(alarmTime);
        if (Math.abs(now - alarm) < 1000) {
          setShowAlarmPopup({ taskId, time: alarmTime });
          const newAlarms = { ...alarms };
          delete newAlarms[taskId];
          setAlarms(newAlarms);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  // API functions
  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      const tasks = data.tasks || data;
      const connected = data.dbConnected !== undefined ? data.dbConnected : true;
      
      setTasks(tasks || []);
      setDbConnected(connected);
      
      if (connected && !dbConnected) {
        showToast('🟢 Database connected successfully!', 'success');
      }
    } catch (error) {
      console.error('🔥 Error fetching tasks from API:', error);
      setTasks([]);
      setDbConnected(false);
      
      if (!dbConnected) {
        showToast('⚠️ Using offline mode. Tasks may not sync.', 'warning');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Utility functions
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    showToast('Welcome back!', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    showToast('Logged out successfully', 'success');
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        localStorage.setItem('profilePicture', e.target.result);
        showToast('📸 Profile picture updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTaskComplete = async (taskId) => {
    const task = (tasks || []).find(t => t._id === taskId);
    if (!task) return;

    try {
      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks?taskId=${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? { ...t, completed: data.task.completed } : t
        ));
        
        if (!task.completed) {
          setUserXP(prev => prev + 10);
          showToast(' Great job! Task completed!', 'success');
        } else {
          showToast('Task marked as incomplete', 'info');
        }
      }
    } catch (error) {
      console.error('🔥 Error toggling task:', error);
      showToast('❌ Failed to update task. Please try again.', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks?taskId=${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setTasks(prev => prev.filter(task => task._id !== taskId));
      showToast('Task deleted successfully! 🗑️', 'success');
    } catch (error) {
      console.error('🔥 Error deleting task:', error);
      showToast('❌ Failed to delete task. Please try again.', 'error');
    }
  };

  const addTask = async () => {
    if (!newTaskName.trim()) {
      console.log('🔥 Empty task name, returning');
      return;
    }

    try {
      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTaskName.trim(),
          priority: taskPriority,
          category: taskCategory
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setTasks(prev => [data, ...prev]);
      setNewTaskName('');
      showToast('🎯 Task added successfully!', 'success');
    } catch (error) {
      console.error('🔥 API Error:', error);
      showToast('❌ Failed to add task. Please try again.', 'error');
    }
  };

  // Conditional rendering flags (computed after all hooks)
  const shouldShowProfileSettings = showProfileSettings && user;
  const shouldShowAuth = !user;

  // Theme object
  const theme = darkMode ? {
    bg: '#121212',
    cardBg: '#181818',
    text: '#FFFFFF',
    textSecondary: '#A7A7A7',
    border: '#282828',
    inputBg: '#282828',
    sidebarBg: '#181818',
    hoverBg: 'rgba(255,255,255,0.1)'
  } : {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#202124',
    textSecondary: '#5f6368',
    border: 'rgba(255,255,255,0.2)',
    inputBg: 'white',
    sidebarBg: 'rgba(255,255,255,0.95)',
    hoverBg: 'rgba(0,0,0,0.05)'
  };

  // Priority and category colors
  const priorityColors = {
    low: '#34a853',
    medium: '#fbbc04',
    high: '#ea4335'
  };

  const categoryColors = {
    work: '#1a73e8',
    personal: '#34a853',
    shopping: '#fbbc04'
  };

  // Filter tasks
  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Early returns after all hooks are called
  if (shouldShowProfileSettings) {
    return (
      <ProfileSettings
        user={user}
        onBack={() => setShowProfileSettings(false)}
        darkMode={darkMode}
        showToast={showToast}
        userLevel={userLevel}
        userXP={userXP}
        badges={badges}
      />
    );
  }

  if (shouldShowAuth) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Main render
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg,
      padding: '0',
      margin: '0',
      display: 'flex',
      width: '100%',
      maxWidth: 'none',
      position: 'relative',
      left: '0',
      right: '0',
      color: theme.text
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        backgroundColor: theme.cardBg,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '16px 24px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, color: theme.text, fontSize: '24px' }}>
            Task Manager
          </h1>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: theme.textSecondary, fontSize: '14px' }}>
            Level {userLevel} • {userXP} XP
          </span>
          <button
            onClick={() => setShowProfileSettings(true)}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: theme.text
            }}
          >
            ⚙️ Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ea4335',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        width: '100%',
        marginTop: '80px',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? '280px' : '0',
          backgroundColor: theme.sidebarBg,
          backdropFilter: 'blur(10px)',
          borderRight: `1px solid ${theme.border}`,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          position: 'fixed',
          height: 'calc(100vh - 80px)',
          left: 0,
          top: '80px'
        }}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ color: theme.text, marginBottom: '16px' }}>Categories</h3>
            {['all', 'work', 'personal', 'shopping'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  margin: '4px 0',
                  backgroundColor: selectedCategory === category ? theme.hoverBg : 'transparent',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: theme.text,
                  textAlign: 'left'
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          marginLeft: sidebarOpen ? '280px' : '0',
          padding: '24px',
          transition: 'margin-left 0.3s ease'
        }}>
          {/* Add Task Section */}
          <div style={{
            backgroundColor: theme.cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ color: theme.text, marginBottom: '16px' }}>Add New Task</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name..."
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.inputBg,
                  color: theme.text
                }}
              />
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                style={{
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.inputBg,
                  color: theme.text
                }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                style={{
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.inputBg,
                  color: theme.text
                }}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
              </select>
              <button
                onClick={addTask}
                disabled={!newTaskName.trim() || isAddingTask}
                style={{
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  opacity: (!newTaskName.trim() || isAddingTask) ? 0.6 : 1
                }}
              >
                {isAddingTask ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div style={{
            backgroundColor: theme.cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 style={{ color: theme.text, marginBottom: '16px' }}>
              Tasks ({filteredTasks.length})
            </h2>
            
            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
                No tasks found. Add your first task above!
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={filteredTasks} strategy={verticalListSortingStrategy}>
                  {filteredTasks.map((task, index) => (
                    <SortableTaskCard
                      key={task._id}
                      task={task}
                      theme={theme}
                      darkMode={darkMode}
                      toggleTaskComplete={toggleTaskComplete}
                      deleteTask={deleteTask}
                      alarms={alarms}
                      setShowAlarmPopup={setShowAlarmPopup}
                      priorityColors={priorityColors}
                      categoryColors={categoryColors}
                      index={index}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <SortableTaskCard
                      task={filteredTasks.find(t => t._id === activeId)}
                      theme={theme}
                      darkMode={darkMode}
                      toggleTaskComplete={toggleTaskComplete}
                      deleteTask={deleteTask}
                      alarms={alarms}
                      setShowAlarmPopup={setShowAlarmPopup}
                      priorityColors={priorityColors}
                      categoryColors={categoryColors}
                      index={0}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        button:hover {
          opacity: 0.8;
        }
        
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        }
      `}</style>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
