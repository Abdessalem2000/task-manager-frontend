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

// Note: dnd-kit CSS styles are handled inline

// Theme Toggle Component
const ThemeToggle = ({ darkMode, setDarkMode, theme, position = 'header' }) => {
  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    
    // Save with safety check as 'light' or 'dark'
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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          backgroundColor: task.completed 
            ? (darkMode ? '#0a0a0a' : '#f8f9fa')
            : (darkMode ? '#181818' : 'rgba(255, 255, 255, 0.9)'),
          backdropFilter: 'blur(20px)',
          border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          transition: 'all 0.3s ease',
          animation: `slideIn 0.3s ease ${index * 0.1}s both`,
          cursor: isDragging ? 'grabbing' : 'grab',
          minHeight: '120px',
          position: 'relative',
          boxShadow: isDragging ? '0 20px 60px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
          }
        }}
      >
        {/* Priority Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: priorityColors[task.priority] || priorityColors.medium
        }}></div>

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: '500',
          backgroundColor: categoryColors[task.category] || categoryColors.work,
          color: 'white'
        }}>
          {task.category || 'work'}
        </div>

        {/* Alarm Bell Icon */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowAlarmPopup(task._id);
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '45px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: alarms[task._id] ? '#1DB954' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            border: alarms[task._id] ? 'none' : '1px solid #A7A7A7'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = alarms[task._id] ? '#1ed760' : '#282828';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = alarms[task._id] ? '#1DB954' : 'transparent';
          }}
        >
          {alarms[task._id] ? '🔔' : '🔕'}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '25px' }}>
          <div
            onClick={() => toggleTaskComplete(task._id)}
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid #1a73e8',
              borderRadius: '6px',
              marginRight: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: task.completed ? '#1a73e8' : 'transparent',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {task.completed && (
              <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
            )}
          </div>
          
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ 
              fontWeight: '500', 
              color: task.completed ? theme.textSecondary : theme.text,
              textDecoration: task.completed ? 'line-through' : 'none',
              fontSize: '16px',
              marginBottom: '5px',
              lineHeight: '1.4'
            }}>
              {task.name}
            </div>
            <div style={{ fontSize: '12px', color: theme.textSecondary }}>
              {new Date(task.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task._id);
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            alignSelf: 'flex-end',
            marginTop: '10px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#c82333';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#dc3545';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

function App() {
  console.log('🔥 App is mounting...');
  try {
  const [user, setUser] = useState({ name: 'yahia', email: 'yahia@example.com' });
  const [tasks, setTasks] = useState([]);
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

  // Setup drag and drop sensors
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

  // Check for existing authentication on mount
  useEffect(() => {
    console.log('🔥 useEffect is running...');
    
    // Safety check: Clear corrupted localStorage
    try {
      const testKeys = ['user', 'token', 'darkMode', 'sidebarOpen', 'userLevel', 'userXP', 'badges', 'dailyStreak', 'lastActiveDate', 'habits', 'alarms'];
      testKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value && (value.includes('undefined') || value.includes('[object Object]'))) {
          console.warn(`Clearing corrupted localStorage key: ${key}`);
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('localStorage safety check failed:', e);
    }
    
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing savedUser:', e);
        localStorage.removeItem('user');
      }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        // Handle both boolean and string formats for compatibility
        if (typeof parsed === 'string') {
          setDarkMode(parsed === 'dark');
        } else {
          setDarkMode(parsed || false);
        }
      } catch (e) {
        console.error('Error parsing savedTheme:', e);
        setDarkMode(false);
      }
    }

    // Check for saved sidebar preference
    const savedSidebar = localStorage.getItem('sidebarOpen');
    if (savedSidebar) {
      try {
        setSidebarOpen(JSON.parse(savedSidebar));
      } catch (e) {
        console.error('Error parsing savedSidebar:', e);
      }
    }
  }, []);

  // Save theme preference with safety check
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode ? 'dark' : 'light'));
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, [darkMode]);

  // Save sidebar preference
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen || true));
  }, [sidebarOpen]);

  // Enhanced toast notification function with queue support
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  // Remove toast from queue
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Handle successful authentication
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    showToast('Welcome back!', 'success');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    showToast('Logged out successfully', 'success');
  };

  // Handle clear session (fix 401 errors)
  const handleClearSession = () => {
    localStorage.clear();
    setUser(null);
    setTasks([]);
    setDarkMode(false);
    showToast('Session cleared! Please refresh and re-login.', 'info');
  };

  // Fetch tasks (only when user is authenticated)
  const fetchTasks = () => {
    if (!user) return;
    // ... (rest of the code remains the same)
    
    const token = localStorage.getItem('token');
    const API_URL = 'https://task-manager-api-git-master-abdessalem-kentaches-projects.vercel.app'; // CORRECTED API URL
    
    // Only fetch if we have a valid API URL
    if (!API_URL || API_URL === 'http://localhost:3000') {
      console.log('Using demo mode - no API calls');
      return;
    }
    
    fetch(`${API_URL}/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        // Don't crash the app if API fails
        setTasks([]);
      });
  };

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);

  // Handle profile picture upload
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

  // Load profile picture from localStorage on mount
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
  }, []);

  // Load gamification data from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem('userLevel');
    const savedXP = localStorage.getItem('userXP');
    const savedBadges = localStorage.getItem('badges');
    const savedStreak = localStorage.getItem('dailyStreak');
    const savedLastActiveDate = localStorage.getItem('lastActiveDate');
    const savedHabits = localStorage.getItem('habits');
    
    console.log('🔥 Loading from localStorage:', {
      savedLevel,
      savedXP,
      savedBadges,
      savedStreak,
      savedLastActiveDate,
      savedHabits
    });
    
    if (savedLevel) setUserLevel(parseInt(savedLevel) || 1);
    if (savedXP) setUserXP(parseInt(savedXP) || 0);
    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges) || []);
      } catch (e) {
        setBadges([]);
      }
    }
    if (savedStreak) setDailyStreak(parseInt(savedStreak) || 1);
    if (savedLastActiveDate) setLastActiveDate(savedLastActiveDate);
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits) || []);
      } catch (e) {
        setHabits([]);
      }
    }
    
    // Initialize streak if not exists
    if (!savedStreak) {
      console.log('🔥 Initializing streak to 1');
      setDailyStreak(1);
      localStorage.setItem('dailyStreak', '1');
    }
    
    // Initialize last active date if not exists
    if (!savedLastActiveDate) {
      const today = new Date().toDateString();
      console.log('🔥 Initializing last active date to:', today);
      setLastActiveDate(today);
      localStorage.setItem('lastActiveDate', today);
    }
    
    // Initialize XP if not exists
    if (!savedXP) {
      console.log('🔥 Initializing XP to 10');
      setUserXP(10);
      localStorage.setItem('userXP', '10');
    }
    
    // Initialize level if not exists
    if (!savedLevel) {
      console.log('🔥 Initializing level to 1');
      setUserLevel(1);
      localStorage.setItem('userLevel', '1');
    }
    
    // Initialize badges if not exists
    if (!savedBadges) {
      console.log('🔥 Initializing badges to empty array');
      setBadges([]);
      localStorage.setItem('badges', JSON.stringify([]));
    }
    
    // Initialize habits if not exists
    if (!savedHabits) {
      console.log('🔥 Initializing habits to empty array');
      setHabits([]);
      localStorage.setItem('habits', JSON.stringify([]));
    }
  }, []);

  // Auto-save XP whenever it changes
  useEffect(() => {
    localStorage.setItem('userXP', (userXP || 0).toString());
  }, [userXP]);

  // Auto-save level whenever it changes
  useEffect(() => {
    localStorage.setItem('userLevel', (userLevel || 1).toString());
  }, [userLevel]);

  // Auto-save streak whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyStreak', (dailyStreak || 1).toString());
  }, [dailyStreak]);

  // Auto-save last active date whenever it changes
  useEffect(() => {
    if (lastActiveDate) {
      localStorage.setItem('lastActiveDate', lastActiveDate);
    }
  }, [lastActiveDate]);

  // Auto-save badges whenever they change
  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges || []));
  }, [badges]);

  // Auto-save habits whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits || []));
  }, [habits]);

  // Check and update daily streak
  useEffect(() => {
    const checkDailyStreak = () => {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastActiveDate === today) {
        // Already active today
        return;
      } else if (lastActiveDate === yesterday) {
        // Continue streak
        const newStreak = dailyStreak + 1;
        setDailyStreak(newStreak);
        localStorage.setItem('dailyStreak', (newStreak || 1).toString());
        localStorage.setItem('lastActiveDate', today);
        
        // Award streak XP
        if (newStreak >= 3) {
          const streakXP = Math.floor(newStreak / 3) * 20; // +20 XP for every 3-day streak
          awardXP(streakXP, `Streak Master: ${newStreak} days!`);
        }
        
        // Show streak animation
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 2000);
      } else if (lastActiveDate !== today) {
        // Reset streak (missed a day)
        setDailyStreak(1);
        localStorage.setItem('dailyStreak', '1');
        localStorage.setItem('lastActiveDate', today);
      }
    };

    checkDailyStreak();
  }, [lastActiveDate, dailyStreak]);

  // Habit Management Functions
  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now(),
        name: newHabitName.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedDates: []
      };
      
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      setNewHabitName('');
      setShowHabitModal(false);
      showToast('🎯 Habit created successfully!', 'success');
    }
  };

  const toggleHabitComplete = (habitId) => {
    const today = new Date().toDateString();
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completedDates.includes(today);
        const newCompletedDates = isCompletedToday
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        
        return {
          ...habit,
          completed: !isCompletedToday,
          completedDates: newCompletedDates
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    
    // Award XP for habit completion
    const habit = updatedHabits.find(h => h.id === habitId);
    if (habit && habit.completed) {
      awardXP(5, 'Habit Completed!');
    }
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    showToast('🎯 Habit deleted', 'info');
  };

  // Calculate XP required for next level
  const getXPForNextLevel = (level) => {
    return level * 100; // 100 XP per level
  };

  // Calculate current level progress
  const getCurrentLevelXP = () => {
    return getXPForNextLevel(userLevel - 1);
  };

  const getNextLevelXP = () => {
    return getXPForNextLevel(userLevel);
  };

  const getProgressPercentage = () => {
    const currentLevelXP = getCurrentLevelXP();
    const nextLevelXP = getNextLevelXP();
    const progressXP = userXP - currentLevelXP;
    const totalXPNeeded = nextLevelXP - currentLevelXP;
    return (progressXP / totalXPNeeded) * 100;
  };

  // Award XP and check for level up
  const awardXP = (xpAmount, achievement = null) => {
    const newXP = userXP + xpAmount;
    setUserXP(newXP);
    
    // Update daily activity for streak
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      setLastActiveDate(today);
    }
    
    // Check for level up
    const newLevel = Math.floor(newXP / 100) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      setShowLevelUp(true);
      showToast(`🎉 Level Up! You're now level ${newLevel}!`, 'success');
      
      // Play level up sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play();
      
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    
    // Award badge if achievement provided
    if (achievement && !badges.includes(achievement)) {
      const newBadges = [...badges, achievement];
      setBadges(newBadges);
      showToast(`🏆 Badge earned: ${achievement}!`, 'success');
    }
    
    // Debug logging
    console.log('🔥 XP Updated:', { newXP, newLevel, dailyStreak, lastActiveDate });
  };

  // Load alarms from localStorage and check for triggered alarms
  useEffect(() => {
    const savedAlarms = localStorage.getItem('alarms');
    if (savedAlarms) {
      try {
        setAlarms(JSON.parse(savedAlarms));
      } catch (e) {
        console.error('Error parsing savedAlarms:', e);
        setAlarms({});
      }
    }
  }, []);

  // Check for alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      Object.entries(alarms).forEach(([taskId, alarmTime]) => {
        if (alarmTime && new Date(alarmTime) <= now) {
          const task = (tasks || []).find(t => t._id === taskId);
          if (task) {
            setShowAlarmModal(task);
            // Play ding sound
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.play();
            // Remove the alarm after triggering
            setAlarms(prev => {
              const newAlarms = { ...prev };
              delete newAlarms[taskId];
              localStorage.setItem('alarms', JSON.stringify(newAlarms));
              return newAlarms;
            });
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, tasks]);

  // Filter tasks based on search and category
  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((task) => task._id === active.id);
    }
    
    setActiveId(null);
  };

  // Handle drag start event
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Voice Recognition Functions
  const startVoiceRecognition = () => {
    // Request microphone permission first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('🎤 Microphone permission granted!');
        proceedWithVoiceRecognition();
      })
      .catch((error) => {
        console.error('🎤 Microphone permission denied:', error);
        showToast('🎤 Microphone permission denied. Please allow microphone access.', 'error');
      });
  };

  const proceedWithVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('🎤 Voice recognition not supported in this browser');
      showToast('🎤 Voice recognition not supported in this browser', 'error');
      return;
    }

    console.log('🎤 Starting voice recognition...');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      setIsListening(true);
      showToast('🎤 Listening...', 'info');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice heard:', transcript);
      setVoiceCommand(transcript);
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('🎤 Voice recognition error:', event.error);
      setIsListening(false);
      showToast('🎤 Voice recognition error: ' + event.error, 'error');
    };

    recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command) => {
    console.log('🎤 Processing command:', command);
    // Play success sound
    const successSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    successSound.play();

    // Process different voice commands
    if (command.startsWith('add task')) {
      const taskName = command.replace('add task', '').trim();
      if (taskName) {
        console.log('🎤 Adding task:', taskName);
        setNewTaskName(taskName);
        setTaskPriority('medium');
        setTaskCategory('work');
        setTimeout(() => addTask(), 100);
        showToast(`🎤 Task added: "${taskName}"`, 'success');
      } else {
        console.log('🎤 No task name provided');
        showToast('🎤 Please specify a task name', 'error');
      }
    } else if (command === 'clear all') {
      console.log('🎤 Clearing search');
      setSearchQuery('');
      showToast('🎤 Search cleared', 'success');
    } else if (command === 'open profile') {
      console.log('🎤 Opening profile');
      setShowProfileSettings(true);
      showToast('🎤 Opening profile settings', 'success');
    } else if (command.startsWith('search for')) {
      const searchTerm = command.replace('search for', '').trim();
      if (searchTerm) {
        console.log('🎤 Searching for:', searchTerm);
        setSearchQuery(searchTerm);
        showToast(`🎤 Searching for: "${searchTerm}"`, 'success');
      } else {
        console.log('🎤 No search term provided');
        showToast('🎤 Please specify a search term', 'error');
      }
    } else if (command === 'complete task') {
      console.log('🎤 Completing first incomplete task');
      // Complete the first incomplete task
      const incompleteTask = filteredTasks.find(t => !t.completed);
      if (incompleteTask) {
        toggleTaskComplete(incompleteTask._id);
        showToast(`🎤 Task completed: "${incompleteTask.name}"`, 'success');
      } else {
        console.log('🎤 No incomplete tasks found');
        showToast('🎤 No incomplete tasks found', 'error');
      }
    } else if (command.startsWith('set priority')) {
      const priority = command.includes('high') ? 'high' : command.includes('low') ? 'low' : 'medium';
      console.log('🎤 Setting priority to:', priority);
      setTaskPriority(priority);
      showToast(`🎤 Priority set to: ${priority}`, 'success');
    } else if (command.startsWith('set category')) {
      const category = command.includes('personal') ? 'personal' : command.includes('shopping') ? 'shopping' : 'work';
      console.log('🎤 Setting category to:', category);
      setTaskCategory(category);
      showToast(`🎤 Category set to: ${category}`, 'success');
    } else {
      console.log('🎤 Unrecognized command:', command);
      showToast(`🎤 Command not recognized: "${command}"`, 'error');
    }
  };

  // Test Button Component
  const TestVoiceButton = () => (
    <button
      onClick={startVoiceRecognition}
      style={{
        backgroundColor: '#1DB954',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        margin: '10px 0',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#1ed760';
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#1DB954';
        e.target.style.transform = 'scale(1)';
      }}
    >
      🎤 Start Voice Recognition
    </button>
  );

  // Voice Button Component
  const VoiceButton = () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={startVoiceRecognition}
        disabled={isListening}
        style={{
          backgroundColor: isListening ? '#1ed760' : '#1DB954',
          border: 'none',
          borderRadius: '12px',
          padding: '15px 20px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          cursor: isListening ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: isListening 
            ? '0 0 20px rgba(30, 215, 0, 0.6)' 
            : '0 4px 15px rgba(29, 185, 84, 0.3)',
          animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
          transform: isListening ? 'scale(1.05)' : 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (!isListening) {
            e.target.style.backgroundColor = '#1ed760';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(30, 215, 0, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isListening) {
            e.target.style.backgroundColor = '#1DB954';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(29, 185, 84, 0.3)';
          }
        }}
      >
        🎤
        {isListening && (
          <span style={{
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Listening...
          </span>
        )}
      </button>
      {isListening && (
        <div style={{
          position: 'absolute',
          top: '-35px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1DB954',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)',
          animation: 'fadeIn 0.3s ease'
        }}>
          🎤 Listening...
        </div>
      )}
    </div>
  );

  // Get theme colors
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

  // Priority colors
  const priorityColors = {
    low: '#34a853',
    medium: '#fbbc04',
    high: '#ea4335'
  };

  // Category colors
  const categoryColors = {
    work: '#1a73e8',
    personal: '#34a853',
    shopping: '#fbbc04'
  };

  const toggleTaskComplete = (taskId) => {
    const task = (tasks || []).find(t => t._id === taskId);
    if (!task) return;

    const token = localStorage.getItem('token');
    const API_URL = 'https://task-manager-api-git-master-abdessalem-kentaches-projects.vercel.app'; // CORRECTED API URL
    
    fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: task.name,
        completed: !task.completed
      })
    })
    .then(res => res.json())
    .then(data => {
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t._id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
      
      // Award XP for completing tasks
      if (!task.completed) {
        awardXP(10, 'First Task Completed');
        
        // Check for weekly warrior badge (7 tasks completed in a week)
        const completedThisWeek = (tasks || []).filter(t => 
          t.completed && 
          new Date(t.updatedAt || t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;
        
        if (completedThisWeek >= 7) {
          awardXP(0, 'Weekly Warrior');
        }
      }
      
      showToast(task.completed ? 'Task marked as incomplete' : '🎉 Great job! Task completed!', task.completed ? 'info' : 'success');
    })
    .catch(err => {
      console.error("Error updating task:", err);
      showToast('Failed to update task', 'error');
    });
  };

  const deleteTask = (taskId) => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://task-manager-api-git-master-abdessalem-kentaches-projects.vercel.app'; // CORRECTED API URL
    
    fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      showToast('Task removed', 'info');
    })
    .catch(err => {
      console.error("Error deleting task:", err);
      showToast('Failed to delete task', 'error');
    });
  };

  const addTask = () => {
    if (!newTaskName.trim()) {
      return; // Don't add empty tasks
    }

    setIsAddingTask(true);
    const token = localStorage.getItem('token');
    const API_URL = 'https://task-manager-api-git-master-abdessalem-kentaches-projects.vercel.app'; // CORRECTED API URL
    const taskData = {
      name: newTaskName,
      completed: false,
      priority: taskPriority,
      category: taskCategory
    };
    
    fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    })
    .then(res => res.json())
    .then(data => {
      setNewTaskName(''); // Clear input
      if (data.task) {
        setTasks(prevTasks => [...prevTasks, data.task]);
        showToast('✅ Task added successfully!', 'success');
      } else {
        showToast('✅ Task added successfully!', 'success');
      }
    })
    .catch(err => {
      console.error("Error adding task:", err);
      showToast('Failed to add task', 'error');
    })
    .finally(() => {
      setIsAddingTask(false);
    });
  };

  // Show Profile Settings if requested
  if (showProfileSettings && user) {
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

  // Show Auth component if user is not logged in
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Calculate completion percentage for chart
  const completedCount = filteredTasks.filter(t => t.completed).length;
  const pendingCount = filteredTasks.filter(t => !t.completed).length;
  const completionPercentage = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  // Quick add task function
  const quickAddTask = () => {
    const taskName = prompt('Quick add task:');
    if (taskName && taskName.trim()) {
      setNewTaskName(taskName.trim());
      setTaskPriority('medium');
      setTaskCategory('work');
      setTimeout(() => addTask(), 100);
    }
  };

  // Handle alarm setting
  const handleSetAlarm = (taskId, dateTime) => {
    const newAlarms = { ...alarms, [taskId]: dateTime };
    setAlarms(newAlarms);
    localStorage.setItem('alarms', JSON.stringify(newAlarms));
    setShowAlarmPopup(null);
    showToast('⏰ Alarm set successfully!', 'success');
  };

  // Handle alarm removal
  const handleRemoveAlarm = (taskId) => {
    const newAlarms = { ...alarms };
    delete newAlarms[taskId];
    setAlarms(newAlarms);
    localStorage.setItem('alarms', JSON.stringify(newAlarms));
    setShowAlarmPopup(null);
    showToast('🔕 Alarm removed', 'info');
  };

  // Mock data for charts
  const weeklyActivityData = [
    { day: 'Mon', completed: 4, created: 6 },
    { day: 'Tue', completed: 7, created: 5 },
    { day: 'Wed', completed: 3, created: 8 },
    { day: 'Thu', completed: 9, created: 4 },
    { day: 'Fri', completed: 6, created: 7 },
    { day: 'Sat', completed: 8, created: 3 },
    { day: 'Sun', completed: 5, created: 5 }
  ];

  const categoryDistribution = [
    { name: 'Work', value: 45, color: '#1a73e8' },
    { name: 'Personal', value: 30, color: '#34a853' },
    { name: 'Shopping', value: 25, color: '#fbbc04' }
  ];

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
      {/* DEBUG TEXT - TEST VERSION 2.0 */}
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        backgroundColor: '#FF0000',
        color: '#FFFFFF',
        padding: '10px',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 99999,
        boxShadow: '0 2px 10px rgba(255,0,0,0.5)'
      }}>
        🚀 TEST VERSION 2.0 - Theme Toggle Should Be Visible Now! 🚀
      </div>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        backgroundColor: theme.sidebarBg,
        backdropFilter: 'blur(10px)',
        borderRight: `1px solid ${theme.border}`,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ padding: '30px 20px' }}>
          {/* User Profile */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#1a73e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px auto',
              fontSize: '32px',
              color: 'white',
              fontWeight: 'bold',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(26, 115, 232, 0.3)',
              border: `3px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'}`,
              transition: 'all 0.3s ease'
            }}
            onClick={() => setShowProfileSettings(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(26, 115, 232, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(26, 115, 232, 0.3)';
            }}>
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
              <input
                id="profile-upload-app"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureUpload}
              />
              <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '24px',
              height: '24px',
              backgroundColor: '#34a853',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              border: `2px solid ${darkMode ? '#2d2d44' : 'white'}`,
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('profile-upload').click();
            }}>
              📷
            </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <h3 style={{ 
                color: theme.text, 
                margin: '0', 
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setShowProfileSettings(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1a73e8';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.text;
                e.currentTarget.style.textDecoration = 'none';
              }}>
                <span>{user && user.name ? user.name : 'yahia'} 🔥</span>
              </h3>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} position="next-to-name" />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
              }}>
                Lv. {userLevel}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#FFD700',
                fontWeight: '600'
              }}>
                {userXP} XP
              </div>
              <span style={{
                fontSize: '1rem',
                color: '#FF6B35',
                filter: showStreakAnimation ? 'hue-rotate(0deg)' : 'none',
                animation: showStreakAnimation ? 'flameFlicker 0.5s ease-in-out infinite' : 'none'
              }}>
                🔥
              </span>
            </div>
            
            {/* XP Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: darkMode ? '#282828' : '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '10px',
              position: 'relative'
            }}>
              <div style={{
                width: `${getProgressPercentage()}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00FF41, #32CD32)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
              }}></div>
            </div>
            
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#1DB954',
              textAlign: 'center',
              marginTop: '5px',
              textShadow: '0 0 4px rgba(29, 185, 84, 0.3)'
            }}>
              {getNextLevelXP() - userXP} XP to Level {userLevel + 1}
            </div>
            <p style={{ 
              color: theme.textSecondary, 
              margin: 0, 
              fontSize: '0.9rem'
            }}>
              {user?.email || 'user@example.com'}
            </p>
          </div>

          {/* FORCED VISIBLE THEME TOGGLE */}
          <div style={{ marginTop: '30px', marginBottom: '20px' }}>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>

          {/* Category Navigation */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ 
              color: theme.textSecondary, 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Categories
            </h4>
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: selectedCategory === 'all' ? (darkMode ? '#4a4a6a' : '#e8f0fe') : 'transparent',
                color: theme.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: selectedCategory === 'all' ? '600' : '500',
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }} 
              onClick={() => setSelectedCategory('all')}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'all') {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 4px 20px rgba(255,255,255,0.1)' 
                    : '0 4px 20px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'all') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <span>📋 All Tasks</span>
              <span style={{
                backgroundColor: darkMode ? '#3a3a5a' : '#d1d9e0',
                color: theme.text,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {tasks?.length || 0}
              </span>
            </button>
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: selectedCategory === 'work' ? (darkMode ? '#4a4a6a' : '#e8f0fe') : 'transparent',
                color: theme.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: selectedCategory === 'work' ? '600' : '500',
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }} 
              onClick={() => setSelectedCategory('work')}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'work') {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 4px 20px rgba(255,255,255,0.1)' 
                    : '0 4px 20px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'work') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <span>💼 Work</span>
              <span style={{
                backgroundColor: darkMode ? '#3a3a5a' : '#d1d9e0',
                color: theme.text,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {tasks.filter(t => t.category === 'work').length}
              </span>
            </button>
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: selectedCategory === 'personal' ? (darkMode ? '#4a4a6a' : '#e8f0fe') : 'transparent',
                color: theme.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: selectedCategory === 'personal' ? '600' : '500',
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }} 
              onClick={() => setSelectedCategory('personal')}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'personal') {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 4px 20px rgba(255,255,255,0.1)' 
                    : '0 4px 20px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'personal') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <span>👤 Personal</span>
              <span style={{
                backgroundColor: darkMode ? '#3a3a5a' : '#d1d9e0',
                color: theme.text,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {tasks.filter(t => t.category === 'personal').length}
              </span>
            </button>
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: selectedCategory === 'shopping' ? (darkMode ? '#4a4a6a' : '#e8f0fe') : 'transparent',
                color: theme.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: selectedCategory === 'shopping' ? '600' : '500',
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }} 
              onClick={() => setSelectedCategory('shopping')}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'shopping') {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 4px 20px rgba(255,255,255,0.1)' 
                    : '0 4px 20px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'shopping') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <span>🛒 Shopping</span>
              <span style={{
                backgroundColor: darkMode ? '#3a3a5a' : '#d1d9e0',
                color: theme.text,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {tasks.filter(t => t.category === 'shopping').length}
              </span>
            </button>

            {/* Habits Section */}
            <div style={{ marginTop: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h4 style={{ 
                  color: theme.textSecondary, 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  🎯 Habits
                </h4>
                <button
                  onClick={() => setShowHabitModal(true)}
                  style={{
                    backgroundColor: '#1DB954',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1ed760';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1DB954';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  + Add
                </button>
              </div>
              
              {habits.map(habit => (
                <div key={habit.id} style={{
                  padding: '10px',
                  backgroundColor: habit.completed ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                  border: habit.completed ? '1px solid rgba(29, 185, 84, 0.3)' : '1px solid transparent',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => toggleHabitComplete(habit.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = habit.completed ? 'rgba(29, 185, 84, 0.1)' : 'transparent';
                }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #1DB954',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: habit.completed ? '#1DB954' : 'transparent',
                    color: habit.completed ? 'white' : 'transparent'
                  }}>
                    {habit.completed && <span style={{ fontSize: '10px' }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: theme.text,
                    textDecoration: habit.completed ? 'line-through' : 'none',
                    opacity: habit.completed ? '0.7' : '1'
                  }}>
                    {habit.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                    }}
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.textSecondary,
                      cursor: 'pointer',
                      fontSize: '12px',
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {habits.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: theme.textSecondary,
                  fontSize: '12px'
                }}>
                  No habits yet. Click + Add to create one!
                </div>
              )}
            </div>
          </div>

          {/* Quick Add Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={quickAddTask}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#34a853',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d8e3d';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#34a853';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ⚡ Quick Add
            </button>
          </div>

          {/* Theme Toggle */}
          <div style={{ marginTop: '30px' }}>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>

          {/* Session Management */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleClearSession}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: '2px solid #FF6B35',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                marginBottom: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FF5722';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FF6B35';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🔄 Clear Session (Fix 401)
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '280px' : '0',
        flex: '1 1 0%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        minWidth: '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        overflow: 'hidden',
        overflowX: 'hidden',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px 30px',
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.sidebarBg,
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  display: window.innerWidth > 768 ? 'none' : 'block',
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: theme.text
                }}
              >
                ☰
              </button>

              <h1 style={{ 
                color: theme.text, 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: '700'
              }}>
                TASK V2
              </h1>
            </div>

            {/* Search Bar */}
            <div style={{
              position: 'relative',
              width: '300px',
              maxWidth: '350px',
              flex: '0 0 auto',
              boxSizing: 'border-box',
              marginRight: '0'
            }}>
              {/* Search Icon */}
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: theme.textSecondary,
                pointerEvents: 'none'
              }}>
                🔍
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '12px 16px 12px 40px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: theme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = theme.border}
              />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        </div>
      
      <div style={{ 
        padding: '30px', 
        flex: '1 1 0%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        margin: '0',
        overflow: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
          {/* Stats Cards */}
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '40px',
            marginBottom: '40px',
            width: '100%',
            maxWidth: 'none'
          }}>
            <div style={{
              background: darkMode 
                ? '#181818' 
                : 'rgba(255, 255, 255, 0.9)',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '500' }}>Total Tasks</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a73e8', margin: '0' }}>
                {filteredTasks?.length || 0}
              </p>
            </div>
            
            <div style={{
              background: darkMode 
                ? '#181818' 
                : 'rgba(255, 255, 255, 0.9)',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '500' }}>Completed</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#34a853', margin: '0' }}>
                {completedCount}
              </p>
            </div>
            
            <div style={{
              background: darkMode 
                ? '#181818' 
                : 'rgba(255, 255, 255, 0.9)',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏳</div>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '500' }}>Pending</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fbbc04', margin: '0' }}>
                {pendingCount}
              </p>
            </div>

            {/* Donut Chart Card */}
            <div style={{
              background: darkMode 
                ? '#181818' 
                : 'rgba(255, 255, 255, 0.9)',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 20px 0', fontSize: '1.1rem' }}>Progress</h3>
              
              {/* SVG Donut Chart */}
              <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '15px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={darkMode ? '#3d3d5c' : '#f0f0f0'}
                    strokeWidth="20"
                  />
                  
                  {/* Progress circle */}
                  {filteredTasks?.length > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#34a853"
                      strokeWidth="20"
                      strokeDasharray={`${(completionPercentage / 100) * 314.16} 314.16`}
                      strokeDashoffset="78.54"
                      transform="rotate(-90 60 60)"
                      style={{
                        transition: 'stroke-dasharray 0.5s ease-in-out',
                        filter: 'drop-shadow(0 2px 4px rgba(52, 168, 83, 0.3))'
                      }}
                    />
                  )}
                  
                  {/* Inner circle for donut effect */}
                  <circle
                    cx="60"
                    cy="60"
                    r="30"
                    fill={theme.cardBg}
                  />
                </svg>
                
                {/* Percentage text */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: theme.text
                }}>
                  {completionPercentage}%
                </div>
              </div>
              
              <p style={{ 
                fontSize: '0.9rem', 
                margin: 0, 
                color: theme.textSecondary,
                fontWeight: '500'
              }}>
                {completedCount} of {filteredTasks?.length || 0} completed
              </p>
            </div>
          </div>

          {/* Analytics Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
            marginBottom: '40px',
            width: '100%',
            maxWidth: 'none'
          }}>
            {/* Weekly Activity Chart */}
            <div style={{
              background: darkMode ? '#181818' : 'rgba(255, 255, 255, 0.9)',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: theme.text,
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                📊 Weekly Activity
              </h3>
              
              {/* Current Streak Insight */}
              <div style={{
                backgroundColor: darkMode ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255, 107, 53, 0.1)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '1.2rem',
                  color: '#FF6B35',
                  filter: showStreakAnimation ? 'hue-rotate(0deg)' : 'none',
                  animation: showStreakAnimation ? 'flameFlicker 0.5s ease-in-out infinite' : 'none'
                }}>
                  🔥
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: darkMode ? '#FFFFFF' : '#202124'
                }}>
                  Current Streak: {dailyStreak} {dailyStreak === 1 ? 'day' : 'days'}
                </span>
                {dailyStreak >= 3 && (
                  <span style={{
                    fontSize: '12px',
                    color: '#1DB954',
                    fontWeight: '500',
                    marginLeft: 'auto'
                  }}>
                    +{Math.floor(dailyStreak / 3) * 20} XP Bonus
                  </span>
                )}
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyActivityData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1DB954" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1a73e8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#282828' : '#e0e0e0'} />
                  <XAxis 
                    dataKey="day" 
                    stroke={darkMode ? '#A7A7A7' : '#666'}
                    tick={{ fill: darkMode ? '#A7A7A7' : '#666' }}
                  />
                  <YAxis 
                    stroke={darkMode ? '#A7A7A7' : '#666'}
                    tick={{ fill: darkMode ? '#A7A7A7' : '#666' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#181818' : '#ffffff',
                      border: darkMode ? '1px solid #282828' : '1px solid #e0e0e0',
                      borderRadius: '8px',
                      color: darkMode ? '#FFFFFF' : '#202124'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#1DB954" 
                    strokeWidth={2}
                    fill="url(#colorCompleted)" 
                    name="Completed"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="created" 
                    stroke="#1a73e8" 
                    strokeWidth={2}
                    fill="url(#colorCreated)" 
                    name="Created"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution Pie Chart */}
            <div style={{
              background: darkMode ? '#181818' : 'rgba(255, 255, 255, 0.9)',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: theme.text,
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                🥧 Category Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#181818' : '#ffffff',
                      border: darkMode ? '1px solid #282828' : '1px solid #e0e0e0',
                      borderRadius: '8px',
                      color: darkMode ? '#FFFFFF' : '#202124'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {categoryDistribution.map((category, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: category.color
                    }}></div>
                    <span style={{
                      fontSize: '12px',
                      color: darkMode ? '#A7A7A7' : '#666'
                    }}>
                      {category.name}: {category.value} tasks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Task Section */}
          <div style={{ 
            background: theme.cardBg, 
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '40px',
            border: `1px solid ${theme.border}`,
            boxSizing: 'border-box'
          }}>
            <h3 style={{ color: theme.textSecondary, marginBottom: '20px', fontSize: '1.3rem' }}>Add New Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Test Button */}
              <TestVoiceButton />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="What needs to be done?"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    disabled={isAddingTask}
                    style={{
                      width: '100%',
                      padding: '15px 50px 15px 20px',
                      backgroundColor: theme.inputBg,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: theme.text,
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                    onBlur={(e) => e.target.style.borderColor = theme.border}
                  />
                  
                  {/* Large Green Microphone Icon Inside Input */}
                  <button
                    onClick={startVoiceRecognition}
                    disabled={isListening}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: isListening ? '#1ed760' : '#1DB954',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isListening ? 'not-allowed' : 'pointer',
                      fontSize: '18px',
                      transition: 'all 0.3s ease',
                      boxShadow: isListening 
                        ? '0 0 15px rgba(30, 215, 0, 0.6)' 
                        : '0 2px 8px rgba(29, 185, 84, 0.3)',
                      animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isListening) {
                        e.target.style.backgroundColor = '#1ed760';
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isListening) {
                        e.target.style.backgroundColor = '#1DB954';
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                      }
                    }}
                  >
                    🎤
                  </button>
                </div>
                
                <button
                  onClick={addTask}
                  disabled={isAddingTask || !newTaskName.trim()}
                  style={{
                    padding: '15px 30px',
                    backgroundColor: isAddingTask || !newTaskName.trim() ? '#ccc' : '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isAddingTask || !newTaskName.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isAddingTask ? (
                    <>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid white', 
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <span>+</span>
                      Add Task
                    </>
                  )}
                </button>
              </div>
              
              {/* Category and Priority Selectors */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: theme.textSecondary, fontSize: '14px' }}>
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: theme.text,
                      outline: 'none'
                    }}
                  >
                    <option value="work">💼 Work</option>
                    <option value="personal">👤 Personal</option>
                    <option value="shopping">🛒 Shopping</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: theme.textSecondary, fontSize: '14px' }}>
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: theme.text,
                      outline: 'none'
                    }}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '20px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`
          }}>
            <div style={{ 
              padding: '30px 30px 20px 30px',
              borderBottom: `1px solid ${theme.border}`
            }}>
              <h3 style={{ color: theme.textSecondary, margin: 0, fontSize: '1.3rem' }}>
                Your Tasks {selectedCategory !== 'all' && `- ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
              </h3>
            </div>
            
            <div style={{ padding: '20px 30px 30px 30px' }}>
              {filteredTasks?.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: theme.textSecondary
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                  <h4 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: theme.text }}>
                    {searchQuery ? 'No tasks found' : 'No tasks yet!'}
                  </h4>
                  <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.8 }}>
                    {searchQuery ? 'Try a different search term' : 'Start by adding your first task above. Let\'s make today productive! 🚀'}
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredTasks?.map(task => task?._id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="task-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                      gap: '25px',
                      width: '100%',
                      maxWidth: 'none'
                    }}>
                      {filteredTasks?.map((task, index) => (
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
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        backgroundColor: darkMode ? '#181818' : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '16px',
                        cursor: 'grabbing',
                        minHeight: '120px',
                        position: 'relative',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                        transform: 'rotate(5deg)',
                        opacity: 0.9
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: priorityColors[filteredTasks.find(t => t._id === activeId)?.priority] || priorityColors.medium
                        }}></div>
                        
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: categoryColors[filteredTasks.find(t => t._id === activeId)?.category] || categoryColors.work,
                          color: 'white'
                        }}>
                          {filteredTasks.find(t => t._id === activeId)?.category || 'work'}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '25px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            border: '2px solid #1a73e8',
                            borderRadius: '6px',
                            marginRight: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: filteredTasks.find(t => t._id === activeId)?.completed ? '#1a73e8' : 'transparent',
                            flexShrink: 0
                          }}>
                            {filteredTasks.find(t => t._id === activeId)?.completed && (
                              <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                            )}
                          </div>
                          
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ 
                              fontWeight: '500', 
                              color: filteredTasks.find(t => t._id === activeId)?.completed ? theme.textSecondary : theme.text,
                              textDecoration: filteredTasks.find(t => t._id === activeId)?.completed ? 'line-through' : 'none',
                              fontSize: '16px',
                              marginBottom: '5px',
                              lineHeight: '1.4'
                            }}>
                              {filteredTasks.find(t => t._id === activeId)?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Alarm Popup */}
      {showAlarmPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998
        }}
        onClick={() => setShowAlarmPopup(null)}>
          <div style={{
            backgroundColor: darkMode ? '#181818' : '#ffffff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
            maxWidth: '400px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: darkMode ? '#FFFFFF' : '#202124',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              Set Alarm Reminder
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: darkMode ? '#A7A7A7' : '#5f6368'
              }}>
                Date & Time
              </label>
              <input
                type="datetime-local"
                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                defaultValue={alarms[showAlarmPopup] || ''}
                id={`alarm-input-${showAlarmPopup}`}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: darkMode ? '#282828' : '#ffffff',
                  border: `1px solid ${darkMode ? '#282828' : '#dadce0'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: darkMode ? '#FFFFFF' : '#202124',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1DB954'}
                onBlur={(e) => e.target.style.borderColor = darkMode ? '#282828' : '#dadce0'}
              />
            </div>

            {alarms[showAlarmPopup] && (
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                backgroundColor: darkMode ? 'rgba(29, 185, 84, 0.1)' : 'rgba(29, 185, 84, 0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: darkMode ? '#A7A7A7' : '#5f6368'
              }}>
                Current alarm: {new Date(alarms[showAlarmPopup]).toLocaleString()}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              {alarms[showAlarmPopup] && (
                <button
                  onClick={() => handleRemoveAlarm(showAlarmPopup)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ea4335',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d33b2c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ea4335'}
                >
                  Remove Alarm
                </button>
              )}
              <button
                onClick={() => setShowAlarmPopup(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: darkMode ? '#282828' : '#f1f3f4',
                  color: darkMode ? '#FFFFFF' : '#202124',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3c3c3c' : '#e8eaed'}
                onMouseLeave={(e) => e.target.style.backgroundColor = darkMode ? '#282828' : '#f1f3f4'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById(`alarm-input-${showAlarmPopup}`);
                  if (input && input.value) {
                    handleSetAlarm(showAlarmPopup, input.value);
                  }
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1DB954',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1ed760'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1DB954'}
              >
                Set Alarm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alarm Modal */}
      {showAlarmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: darkMode ? '#181818' : '#ffffff',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            animation: 'scaleIn 0.3s ease'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px'
            }}>
              ⏰🔔
            </div>
            <h2 style={{
              margin: '0 0 15px 0',
              color: darkMode ? '#FFFFFF' : '#202124',
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              Task Reminder!
            </h2>
            <p style={{
              margin: '0 0 30px 0',
              color: darkMode ? '#A7A7A7' : '#5f6368',
              fontSize: '1.1rem',
              lineHeight: '1.5'
            }}>
              It's time to: <strong style={{ color: '#1DB954' }}>{showAlarmModal.name}</strong>
            </p>
            <button
              onClick={() => setShowAlarmModal(null)}
              style={{
                padding: '15px 30px',
                backgroundColor: '#1DB954',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(29, 185, 84, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1ed760';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1DB954';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Got it! ✅
            </button>
          </div>
        </div>
      )}

      {/* Level Up Celebration Modal */}
      {showLevelUp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            padding: '50px',
            borderRadius: '30px',
            boxShadow: '0 30px 80px rgba(255, 215, 0, 0.4)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            animation: 'levelUpPulse 0.6s ease, scaleIn 0.3s ease',
            color: '#000'
          }}>
            <div style={{
              fontSize: '5rem',
              marginBottom: '20px',
              animation: 'bounce 1s ease infinite'
            }}>
              🎉🏆
            </div>
            <h2 style={{
              margin: '0 0 15px 0',
              fontSize: '2.5rem',
              fontWeight: '800',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              LEVEL UP!
            </h2>
            <p style={{
              margin: '0 0 30px 0',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              You're now <strong>Level {userLevel}</strong>!
            </p>
            <div style={{
              fontSize: '1rem',
              marginBottom: '30px',
              opacity: 0.8
            }}>
              Keep completing tasks to earn more XP and unlock new badges!
            </div>
            <button
              onClick={() => setShowLevelUp(false)}
              style={{
                padding: '15px 40px',
                backgroundColor: '#000',
                color: '#FFD700',
                border: 'none',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
              }}
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Habit Modal */}
      {showHabitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998
        }}
        onClick={() => setShowHabitModal(false)}>
          <div style={{
            backgroundColor: darkMode ? '#181818' : '#ffffff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
            maxWidth: '400px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: darkMode ? '#FFFFFF' : '#202124',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              🎯 Create New Habit
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: darkMode ? '#A7A7A7' : '#5f6368'
              }}>
                Habit Name
              </label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: darkMode ? '#282828' : '#ffffff',
                  border: `1px solid ${darkMode ? '#282828' : '#dadce0'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: darkMode ? '#FFFFFF' : '#202124',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1DB954'}
                onBlur={(e) => e.target.style.borderColor = darkMode ? '#282828' : '#dadce0'}
              />
            </div>

            <div style={{
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: darkMode ? 'rgba(29, 185, 84, 0.1)' : 'rgba(29, 185, 84, 0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: darkMode ? '#A7A7A7' : '#5f6368'
            }}>
              💡 Habits are recurring daily tasks. Check them off each day to maintain your streak!
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowHabitModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: darkMode ? '#282828' : '#f1f3f4',
                  color: darkMode ? '#FFFFFF' : '#202124',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3c3c3c' : '#e8eaed'}
                onMouseLeave={(e) => e.target.style.backgroundColor = darkMode ? '#282828' : '#f1f3f4'}
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                disabled={!newHabitName.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: newHabitName.trim() ? '#1DB954' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: newHabitName.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (newHabitName.trim()) {
                    e.target.style.backgroundColor = '#1ed760';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = newHabitName.trim() ? '#1DB954' : '#ccc';
                }}
              >
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations and responsive styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        @keyframes levelUpPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 30px 80px rgba(255, 215, 0, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 40px 100px rgba(255, 215, 0, 0.6);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 30px 80px rgba(255, 215, 0, 0.4);
          }
        }

        @keyframes pulse {
          0% {
            transform: translateY(-50%) scale(1);
            box-shadow: 0 0 0 0 rgba(234, 67, 53, 0.7);
          }
          70% {
            transform: translateY(-50%) scale(1.05);
            box-shadow: 0 0 0 10px rgba(234, 67, 53, 0);
          }
          100% {
            transform: translateY(-50%) scale(1);
            box-shadow: 0 0 0 0 rgba(234, 67, 53, 0);
          }
        }

        @keyframes streakFire {
          0% {
            transform: scale(1);
            filter: hue-rotate(0deg);
          }
          25% {
            transform: scale(1.1);
            filter: hue-rotate(10deg);
          }
          50% {
            transform: scale(1.2);
            filter: hue-rotate(-10deg);
          }
          75% {
            transform: scale(1.1);
            filter: hue-rotate(5deg);
          }
          100% {
            transform: scale(1);
            filter: hue-rotate(0deg);
          }
        }

        @keyframes flameFlicker {
          0%, 100% {
            filter: brightness(1) hue-rotate(0deg);
            transform: scale(1);
          }
          25% {
            filter: brightness(1.2) hue-rotate(10deg);
            transform: scale(1.05);
          }
          50% {
            filter: brightness(1.4) hue-rotate(-10deg);
            transform: scale(1.1);
          }
          75% {
            filter: brightness(1.2) hue-rotate(5deg);
            transform: scale(1.05);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .task-grid {
            grid-template-columns: 1fr !important;
          }
          
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .task-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 40px !important;
          }
        }

        @media (min-width: 1025px) {
          .task-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
  } catch (error) {
    console.error('App component error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Something went wrong</h2>
        <p>Please refresh the page</p>
        <details style={{ marginTop: '20px', textAlign: 'left' }}>
          <summary>Error details</summary>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {error?.message || 'Unknown error'}
          </pre>
        </details>
      </div>
    );
  }
}

export default App;