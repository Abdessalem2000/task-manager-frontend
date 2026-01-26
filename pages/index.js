import React, { useState, useEffect } from 'react';

// Mock implementations for missing drag and drop imports
const useSensors = (...sensors) => [];
const useSensor = (sensor, options) => ({});
const PointerSensor = {};
const KeyboardSensor = {};
const sortableKeyboardCoordinates = () => ({});

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontSize: '24px',
        color: 'white',
        fontWeight: '600'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
          <div>Loading Task Manager...</div>
        </div>
      </div>
    );
  }

  // Original complete App component starts here
  try {
    const [user, setUser] = useState({ name: 'yahia', email: 'yahia@example.com' });
    const [tasks, setTasks] = useState([]);
    const [dbConnected, setDbConnected] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [toast, setToast] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [showAlarmPopup, setShowAlarmPopup] = useState(null);
    const [alarms, setAlarms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showCompleted, setShowCompleted] = useState(true);
    const [showHabits, setShowHabits] = useState(false);
    const [habits, setHabits] = useState([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [habitStreak, setHabitStreak] = useState(0);
    const [lastHabitDate, setLastHabitDate] = useState(null);
    const [showHabitModal, setShowHabitModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editingHabit, setEditingHabit] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [habitStats, setHabitStats] = useState({ total: 0, completed: 0, streak: 0 });
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [newTaskPriority, setNewTaskPriority] = useState('medium');
    const [newTaskCategory, setNewTaskCategory] = useState('work');
    const [profilePicture, setProfilePicture] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [sensors, setSensors] = useState(
      useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      )
    );
    const [activeId, setActiveId] = useState(null);

    const theme = darkMode ? {
      bg: '#1a1a1a',
      cardBg: '#2d2d2d',
      text: '#FFFFFF',
      border: '#404040',
      hoverBg: '#3d3d3d',
      subtext: '#A7A7A7',
      success: '#1DB954',
      warning: '#FFA726',
      danger: '#FF6B35',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    } : {
      bg: '#F8F9FA',
      cardBg: '#FFFFFF',
      text: '#202124',
      border: '#E0E0E0',
      hoverBg: '#F1F3F4',
      subtext: '#5F6368',
      success: '#1DB954',
      warning: '#FFA726',
      danger: '#FF6B35',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };

    const priorityColors = {
      low: '#667eea',
      medium: '#FFA726',
      high: '#FF6B35'
    };

    const categoryColors = {
      work: '#667eea',
      personal: '#1DB954',
      shopping: '#FF6B35'
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        console.log('📊 API Response:', data);
        
        if (data.tasks) {
          setTasks(data.tasks);
          setDbConnected(data.dbConnected || false);
          
          if (data.dbConnected && !dbConnected) {
            showToast('Database connected successfully! 🟢', 'success');
          }
        }
      } catch (error) {
        console.error('❌ Fetch tasks error:', error);
        showToast('Failed to fetch tasks. Using offline mode.', 'error');
        setDbConnected(false);
      }
    };

    const addTask = async () => {
      if (!newTaskName.trim()) return;
      
      setIsAddingTask(true);
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: newTaskName.trim(),
            priority: newTaskPriority,
            category: newTaskCategory
          })
        });
        const data = await response.json();
        
        if (data.task) {
          setTasks(prev => [data.task, ...prev]);
          setNewTaskName('');
          setNewTaskPriority('medium');
          setNewTaskCategory('work');
          showToast('Task added successfully! ✅', 'success');
          setDbConnected(data.dbConnected || false);
        } else {
          showToast(data.error || 'Failed to add task', 'error');
        }
      } catch (error) {
        console.error('❌ Add task error:', error);
        showToast('Failed to add task. Please try again.', 'error');
      } finally {
        setIsAddingTask(false);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        const response = await fetch(`/api/tasks?taskId=${taskId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.message) {
          setTasks(prev => prev.filter(task => task._id !== taskId));
          showToast('Task deleted successfully! 🗑️', 'success');
          setDbConnected(data.dbConnected || false);
        } else {
          showToast(data.error || 'Failed to delete task', 'error');
        }
      } catch (error) {
        console.error('❌ Delete task error:', error);
        showToast('Failed to delete task. Please try again.', 'error');
      }
    };

    const toggleTaskComplete = async (taskId) => {
      try {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return;

        const response = await fetch(`/api/tasks?taskId=${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !task.completed })
        });
        const data = await response.json();
        
        if (data.task) {
          setTasks(prev => prev.map(t => 
            t._id === taskId ? { ...t, completed: data.task.completed } : t
          ));
          showToast(data.task.completed ? 'Task completed! 🎉' : 'Task marked as incomplete', 'success');
          setDbConnected(data.dbConnected || false);
        } else {
          showToast(data.error || 'Failed to update task', 'error');
        }
      } catch (error) {
        console.error('❌ Toggle task error:', error);
        showToast('Failed to update task. Please try again.', 'error');
      }
    };

    const showToast = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    const addHabit = () => {
      if (!newHabitName.trim()) return;
      
      const newHabit = {
        _id: Date.now().toString(),
        name: newHabitName.trim(),
        completed: false,
        streak: 0,
        createdAt: new Date().toISOString()
      };
      
      setHabits(prev => [...prev, newHabit]);
      setNewHabitName('');
      setShowHabitModal(false);
      showToast('Habit added successfully! 🌟', 'success');
    };

    const toggleHabitComplete = (habitId) => {
      setHabits(prev => prev.map(h => 
        h._id === habitId ? { ...h, completed: !h.completed } : h
      ));
      showToast('Habit updated! ✅', 'success');
    };

    const deleteHabit = (habitId) => {
      setHabits(prev => prev.filter(h => h._id !== habitId));
      showToast('Habit deleted! 🗑️', 'success');
    };

    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesCompleted = showCompleted || !task.completed;
      return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
    });

    const statsData = [
      { name: 'Mon', tasks: 12, completed: 8 },
      { name: 'Tue', tasks: 15, completed: 12 },
      { name: 'Wed', tasks: 8, completed: 6 },
      { name: 'Thu', tasks: 10, completed: 9 },
      { name: 'Fri', tasks: 6, completed: 4 },
      { name: 'Sat', tasks: 4, completed: 3 },
      { name: 'Sun', tasks: 2, completed: 2 }
    ];

    const pieData = [
      { name: 'Completed', value: tasks.filter(t => t.completed).length, color: '#1DB954' },
      { name: 'Pending', value: tasks.filter(t => !t.completed).length, color: '#FF6B35' }
    ];

    const categoryData = [
      { name: 'Work', value: tasks.filter(t => t.category === 'work').length, color: '#667eea' },
      { name: 'Personal', value: tasks.filter(t => t.category === 'personal').length, color: '#1DB954' },
      { name: 'Shopping', value: tasks.filter(t => t.category === 'shopping').length, color: '#FF6B35' }
    ];

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
        {/* Database Status Bar */}
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          backgroundColor: dbConnected ? theme.success : theme.danger,
          color: 'white',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: '9999',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {dbConnected ? '🟢 Database Connected' : '🔴 Offline Mode - Tasks may not sync'}
        </div>

        {/* Main App Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 20px 20px'
        }}>
          {/* Header */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: theme.cardBg,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: theme.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{
                  margin: '0',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: theme.text
                }}>
                  Welcome back, {user.name}! 👋
                </h1>
                <p style={{
                  margin: '5px 0 0 0',
                  color: theme.subtext,
                  fontSize: '1rem'
                }}>
                  {user.email}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowProfileSettings(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚙️ Settings
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
          </header>

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
                  if (tab === 'tasks') setShowHabits(false);
                  if (tab === 'habits') setShowHabits(true);
                  if (tab === 'stats') setShowStats(true);
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

          {/* Search and Filters */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '25px',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '12px 16px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: theme.cardBg,
                color: theme.text
              }}
            />
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: theme.cardBg,
                color: theme.text
              }}
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: theme.cardBg,
                color: theme.text
              }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              style={{
                padding: '12px 20px',
                backgroundColor: showCompleted ? theme.success : theme.hoverBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {showCompleted ? '✅ Show All' : '👁️ Active Only'}
            </button>
          </div>

          {/* Add Task Button */}
          <div style={{ marginBottom: '25px' }}>
            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{
                padding: '15px 30px',
                backgroundColor: theme.gradient,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              ➕ Add New Task
            </button>
          </div>

          {/* Main Content Area */}
          {!showHabits && !showStats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredTasks.map((task, index) => (
                <div
                  key={task._id}
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${priorityColors[task.priority]}`,
                    transition: 'all 0.2s ease',
                    opacity: task.completed ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: '0',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: theme.text,
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        {task.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: categoryColors[task.category],
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {task.category}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: priorityColors[task.priority],
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => toggleTaskComplete(task._id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: task.completed ? theme.warning : theme.success,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {task.completed ? '↩️ Undo' : '✅ Complete'}
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: theme.danger,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
            Tasks: {filteredTasks.length} | DB: {dbConnected ? '🟢' : '🔴'}
          </div>

          {/* Add Task Modal */}
          {showAddTaskModal && (
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
                borderRadius: '12px',
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
                  Add New Task
                </h2>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.text
                  }}>
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter task name..."
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

                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.text
                  }}>
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: theme.bg,
                      color: theme.text
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.text
                  }}>
                    Category
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: theme.bg,
                      color: theme.text
                    }}
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => {
                      setShowAddTaskModal(false);
                      setNewTaskName('');
                      setNewTaskPriority('medium');
                      setNewTaskCategory('work');
                    }}
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
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      addTask();
                      setShowAddTaskModal(false);
                    }}
                    disabled={!newTaskName.trim() || isAddingTask}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: newTaskName.trim() && !isAddingTask ? theme.success : '#ccc',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: newTaskName.trim() && !isAddingTask ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {isAddingTask ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </div>
            </div>
          )}

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
                borderRadius: '12px',
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

          {/* Habits Modal */}
          {showHabits && (
            <div style={{
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: theme.cardBg,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: theme.text
                }}>
                  Daily Habits
                </h2>
                
                <button
                  onClick={() => setShowHabitModal(true)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: theme.success,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '20px'
                  }}
                >
                  ➕ Add Habit
                </button>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px'
                }}>
                  {habits.map(habit => (
                    <div
                      key={habit._id}
                      style={{
                        backgroundColor: theme.bg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        padding: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{
                          margin: '0 0 5px 0',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: theme.text,
                          textDecoration: habit.completed ? 'line-through' : 'none'
                        }}>
                          {habit.name}
                        </h4>
                        <p style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          color: theme.subtext
                        }}>
                          Streak: {habit.streak} days 🔥
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleHabitComplete(habit._id)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: habit.completed ? theme.warning : theme.success,
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {habit.completed ? '↩️' : '✅'}
                        </button>
                        <button
                          onClick={() => deleteHabit(habit._id)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: theme.danger,
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Habit Modal */}
              {showHabitModal && (
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
                    borderRadius: '12px',
                    padding: '30px',
                    width: '90%',
                    maxWidth: '400px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}>
                    <h3 style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: theme.text
                    }}>
                      Add New Habit
                    </h3>
                    
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="Enter habit name..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: theme.bg,
                        color: theme.text,
                        marginBottom: '20px'
                      }}
                    />

                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={() => {
                          setShowHabitModal(false);
                          setNewHabitName('');
                        }}
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
                        Cancel
                      </button>
                      <button
                        onClick={addHabit}
                        disabled={!newHabitName.trim()}
                        style={{
                          padding: '12px 20px',
                          backgroundColor: newHabitName.trim() ? theme.success : '#ccc',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          cursor: newHabitName.trim() ? 'pointer' : 'not-allowed',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Add Habit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Dashboard */}
          {showStats && (
            <div style={{
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: theme.cardBg,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: theme.text
                }}>
                  Task Statistics
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: theme.text,
                      marginBottom: '5px'
                    }}>
                      {tasks.length}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: theme.subtext
                    }}>
                      Total Tasks
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: theme.success,
                      marginBottom: '5px'
                    }}>
                      {tasks.filter(t => t.completed).length}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: theme.subtext
                    }}>
                      Completed
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: theme.warning,
                      marginBottom: '5px'
                    }}>
                      {tasks.filter(t => !t.completed).length}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: theme.subtext
                    }}>
                      Pending
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: theme.text
                  }}>
                    Task Categories
                  </h3>
                  {categoryData.map(category => (
                    <div key={category.name} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: `1px solid ${theme.border}`
                    }}>
                      <span style={{ color: theme.text }}>{category.name}</span>
                      <span style={{
                        backgroundColor: category.color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {category.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
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
