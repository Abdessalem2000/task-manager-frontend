import React, { useState, useEffect } from 'react';
import Auth from './Auth.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [toast, setToast] = useState(null);

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
    });
  };

  // Show Auth component if user is not logged in
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        maxWidth: '800px',
        margin: '0 auto 30px auto'
      }}>
        <h1 style={{ color: '#1a73e8', margin: 0 }}>Dashboard with Tasks</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#5f6368', fontWeight: '500' }}>
            Welcome, {user.name}!
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '20px', 
        display: 'inline-block',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#5f6368' }}>Total Tasks from MongoDB</h2>
        <p style={{ fontSize: '64px', fontWeight: 'bold', color: '#34a853', margin: '20px 0' }}>
          {tasks.length}
        </p>
        <p style={{ color: '#5f6368', margin: '0' }}>Tasks created by you</p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '20px', 
        display: 'inline-block',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h3 style={{ color: '#5f6368', marginBottom: '20px' }}>Add New Task</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Enter task name..."
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Add Task
          </button>
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {tasks.length === 0 ? (
            <p style={{ color: '#5f6368', textAlign: 'center', padding: '20px' }}>
              No tasks yet. Add your first task above!
            </p>
          ) : (
            tasks.map(task => (
              <div
                key={task._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: task.completed ? '#f8f9fa' : 'white'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ 
                    fontWeight: '500', 
                    color: task.completed ? '#6c757d' : '#212529',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    {task.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 20px',
          backgroundColor: toast.type === 'success' ? '#28a745' : '#dc3545',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          {toast.message}
        </div>
      )}
      {/* Add CSS animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
