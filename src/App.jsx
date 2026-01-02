import React, { useState, useEffect } from 'react';
import Auth from './Auth.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [toast, setToast] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskCategory, setTaskCategory] = useState('work');

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }

    // Check for saved sidebar preference
    const savedSidebar = localStorage.getItem('sidebarOpen');
    if (savedSidebar) {
      setSidebarOpen(JSON.parse(savedSidebar));
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save sidebar preference
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
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

  // Fetch tasks (only when user is authenticated)
  const fetchTasks = () => {
    if (!user) return;
    
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
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
      .catch(err => {
        console.error("Error fetching tasks:", err);
        showToast('Failed to fetch tasks', 'error');
      });
  };

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Filter tasks based on search and category
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get theme colors
  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    cardBg: '#2d2d44',
    text: 'white',
    textSecondary: 'rgba(255,255,255,0.7)',
    border: '#3d3d5c',
    inputBg: '#3d3d5c',
    sidebarBg: '#252538'
  } : {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'white',
    text: '#202124',
    textSecondary: '#5f6368',
    border: '#e0e0e0',
    inputBg: 'white',
    sidebarBg: 'rgba(255,255,255,0.95)'
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
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
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
      showToast(task.completed ? 'Task marked as incomplete' : 'Task completed!', 'success');
    })
    .catch(err => {
      console.error("Error updating task:", err);
      showToast('Failed to update task', 'error');
    });
  };

  const deleteTask = (taskId) => {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      showToast('Task deleted successfully!', 'success');
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
        showToast('Task added successfully!', 'success');
      } else {
        showToast('Task added successfully!', 'success');
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

  // Show Auth component if user is not logged in
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg,
      padding: '0',
      display: 'flex',
      color: theme.text
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
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#1a73e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px auto',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{user.name}</h4>
            <p style={{ margin: 0, fontSize: '14px', color: theme.textSecondary }}>
              {user.email}
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{
              padding: '12px 16px',
              backgroundColor: selectedCategory === 'all' ? '#1a73e8' : 'transparent',
              color: selectedCategory === 'all' ? 'white' : theme.text,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }} onClick={() => setSelectedCategory('all')}>
              📋 All Tasks
            </button>
            <button style={{
              padding: '12px 16px',
              backgroundColor: selectedCategory === 'work' ? '#1a73e8' : 'transparent',
              color: selectedCategory === 'work' ? 'white' : theme.text,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }} onClick={() => setSelectedCategory('work')}>
              💼 Work
            </button>
            <button style={{
              padding: '12px 16px',
              backgroundColor: selectedCategory === 'personal' ? '#34a853' : 'transparent',
              color: selectedCategory === 'personal' ? 'white' : theme.text,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }} onClick={() => setSelectedCategory('personal')}>
              👤 Personal
            </button>
            <button style={{
              padding: '12px 16px',
              backgroundColor: selectedCategory === 'shopping' ? '#fbbc04' : 'transparent',
              color: selectedCategory === 'shopping' ? 'white' : theme.text,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }} onClick={() => setSelectedCategory('shopping')}>
              🛒 Shopping
            </button>
          </div>

          {/* Theme Toggle */}
          <div style={{ marginTop: '30px' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: darkMode ? '#fbbc04' : '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Logout */}
          <div style={{ marginTop: '20px' }}>
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
        flex: 1,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px 30px',
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.sidebarBg,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto'
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
                Task Manager
              </h1>
            </div>

            {/* Search Bar */}
            <div style={{
              position: 'relative',
              width: '300px'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: theme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = theme.border}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.textSecondary,
                fontSize: '16px'
              }}>
                🔍
              </span>
            </div>
          </div>
        </div>
      
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Stats Cards */}
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '25px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: theme.cardBg,
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 10px 0', fontSize: '1.1rem' }}>Total Tasks</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a73e8', margin: '0' }}>
                {filteredTasks.length}
              </p>
            </div>
            
            <div style={{
              background: theme.cardBg,
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 10px 0', fontSize: '1.1rem' }}>Completed</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34a853', margin: '0' }}>
                {filteredTasks.filter(t => t.completed).length}
              </p>
            </div>
            
            <div style={{
              background: theme.cardBg,
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏳</div>
              <h3 style={{ color: theme.textSecondary, margin: '0 0 10px 0', fontSize: '1.1rem' }}>Pending</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbc04', margin: '0' }}>
                {filteredTasks.filter(t => !t.completed).length}
              </p>
            </div>
          </div>

          {/* Add Task Section */}
          <div style={{ 
            background: theme.cardBg, 
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            border: `1px solid ${theme.border}`
          }}>
            <h3 style={{ color: theme.textSecondary, marginBottom: '20px', fontSize: '1.3rem' }}>Add New Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="What needs to be done?"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  disabled={isAddingTask}
                  style={{
                    flex: 1,
                    padding: '15px 20px',
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
              {filteredTasks.length === 0 ? (
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
                <div className="task-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px'
                }}>
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task._id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        backgroundColor: task.completed ? (darkMode ? '#2a2a3e' : '#f8f9fa') : theme.cardBg,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                        cursor: 'pointer',
                        minHeight: '120px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
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
                          e.currentTarget.style.backgroundColor = '#c82333';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc3545';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          backgroundColor: toast.type === 'success' ? '#28a745' : '#dc3545',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          <span>{toast.message}</span>
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
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (min-width: 1025px) {
          .task-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
