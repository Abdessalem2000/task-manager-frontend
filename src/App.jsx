import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchTasks = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/v1/tasks`)
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(err => console.error("Error fetching tasks:", err));
  };

  const deleteTask = (taskId) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/v1/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      console.log("Task deleted:", data);
      // Update state immediately for better UX
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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newTaskName,
        completed: false
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Task added:", data);
      setNewTaskName(''); // Clear input
      // Add the new task to state immediately for better UX
      if (data.task) {
        setTasks(prevTasks => [...prevTasks, data.task]);
        showToast('Task added successfully!', 'success');
      }
    })
    .catch(err => {
      console.error("Error adding task:", err);
      showToast('Failed to add task', 'error');
    });
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#1a73e8' }}>Dashboard with Tasks</h1>
      
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
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '20px', 
        display: 'inline-block',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'left'
      }}>
        <h3 style={{ color: '#5f6368', marginBottom: '20px' }}>Task List</h3>
        
        {/* Add Task Form */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Enter new task..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={addTask}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#357ae8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
          >
            Add Task
          </button>
        </div>
        
        {tasks.length === 0 ? (
          <p style={{ color: '#999' }}>No tasks found</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #eee',
                marginBottom: '5px'
              }}>
                <span style={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#999' : '#333'
                }}>
                  {task.name}
                </span>
                <button 
                  onClick={() => deleteTask(task._id)}
                  style={{
                    backgroundColor: '#ea4335',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#d33b2c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#ea4335'}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 20px',
          borderRadius: '8px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 1000,
          backgroundColor: toast.type === 'success' ? '#34a853' : '#ea4335',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'slideIn 0.3s ease-out'
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
