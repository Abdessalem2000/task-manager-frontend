import React, { useState, useEffect } from 'react';
import Auth from './Auth.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [toast, setToast] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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
      completed: false
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        maxWidth: '1200px',
        margin: '0 auto 40px auto'
      }}>
        <div>
          <h1 style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Task Manager
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            margin: '5px 0 0 0',
            fontSize: '1.1rem'
          }}>
            Welcome back, {user.name}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '12px 24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '25px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
            <h3 style={{ color: '#5f6368', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Total Tasks</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a73e8', margin: '0' }}>
              {tasks.length}
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
            <h3 style={{ color: '#5f6368', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Completed</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34a853', margin: '0' }}>
              {tasks.filter(t => t.completed).length}
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏳</div>
            <h3 style={{ color: '#5f6368', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Pending</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbc04', margin: '0' }}>
              {tasks.filter(t => !t.completed).length}
            </p>
          </div>
        </div>

        {/* Add Task Section */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#5f6368', marginBottom: '20px', fontSize: '1.3rem' }}>Add New Task</h3>
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
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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
        </div>

        {/* Tasks List */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '30px 30px 20px 30px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <h3 style={{ color: '#5f6368', margin: 0, fontSize: '1.3rem' }}>Your Tasks</h3>
          </div>
          
          <div style={{ padding: '20px 30px 30px 30px' }}>
            {tasks.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#5f6368'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                <h4 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#202124' }}>No tasks yet!</h4>
                <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.8 }}>
                  Start by adding your first task above. Let's make today productive! 🚀
                </p>
              </div>
            ) : (
              <div className="task-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {tasks.map((task, index) => (
                  <div
                    key={task._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      backgroundColor: task.completed ? '#f8f9fa' : 'white',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                      cursor: 'pointer',
                      minHeight: '80px'
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
                        backgroundColor: task.completed ? '#1a73e8' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {task.completed && (
                        <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                      )}
                    </div>
                    
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ 
                        fontWeight: '500', 
                        color: task.completed ? '#6c757d' : '#202124',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        fontSize: '16px',
                        marginBottom: '5px'
                      }}>
                        {task.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#5f6368' }}>
                        {new Date(task.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
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
