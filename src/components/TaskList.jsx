import React, { useState } from 'react';

const TaskList = ({ 
  tasks, 
  setTasks, 
  theme, 
  showHabits, 
  showStats,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterPriority,
  setFilterPriority,
  showCompleted,
  setShowCompleted,
  showToast,
  dbConnected,
  isAddingTask,
  setIsAddingTask
}) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('work');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

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

  const addTask = async () => {
    if (!newTaskName.trim()) return;
    
    setIsAddingTask(true);
    try {
      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newTaskName.trim(),
          priority: newTaskPriority,
          category: newTaskCategory
        })
      });
      const data = await response.json();
      
      if (data._id) {
        setTasks(prev => [data, ...prev]);
        setNewTaskName('');
        setShowAddTaskModal(false);
        showToast('Task added successfully! 🎯', 'success');
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
      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks?taskId=${taskId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.message) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
        showToast('Task deleted successfully! 🗑️', 'success');
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

      // For Vercel, always use relative paths. For local dev, use environment variable or localhost
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : '';
      const response = await fetch(`${apiUrl}/api/tasks?taskId=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      const data = await response.json();
      
      if (data.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? { ...t, completed: data.task.completed } : t
        ));
        showToast(task.completed ? 'Task marked as incomplete' : 'Great job! Task completed! ✅', 'success');
      } else {
        showToast(data.error || 'Failed to update task', 'error');
      }
    } catch (error) {
      console.error('❌ Toggle task error:', error);
      showToast('Failed to update task. Please try again.', 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCompleted = showCompleted || !task.completed;
    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
  });

  if (showHabits || showStats) {
    return null;
  }

  return (
    <div>
      {/* Search and Filters */}
      <div style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.glassBorder}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: theme.shadow
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '280px',
              padding: '14px 20px',
              border: `1px solid ${theme.glassBorder}`,
              borderRadius: '12px',
              backgroundColor: theme.glass,
              color: theme.text,
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.glassBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '14px 20px',
              border: `1px solid ${theme.glassBorder}`,
              borderRadius: '12px',
              backgroundColor: theme.glass,
              color: theme.text,
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="all">📂 All Categories</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="shopping">🛒 Shopping</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{
              padding: '14px 20px',
              border: `1px solid ${theme.glassBorder}`,
              borderRadius: '12px',
              backgroundColor: theme.glass,
              color: theme.text,
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="all">🎯 All Priorities</option>
            <option value="high">🔥 High Priority</option>
            <option value="medium">⚡ Medium Priority</option>
            <option value="low">💧 Low Priority</option>
          </select>
          
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            style={{
              padding: '14px 24px',
              background: showCompleted 
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }}
          >
            {showCompleted ? '✅ Show All' : '👁️ Active Only'}
          </button>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowAddTaskModal(true)}
          style={{
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          + Add New Task
        </button>
      </div>

      {/* Tasks List */}
      <div style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ color: theme.text, marginBottom: '16px' }}>
          Tasks ({filteredTasks.length})
        </h3>
        
        {filteredTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: theme.textSecondary || '#666'
          }}>
            No tasks found. Try adjusting your filters or add a new task!
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '20px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {filteredTasks.map((task, index) => (
              <div
                key={task._id}
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.glassBorder}`,
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: theme.shadow,
                  backdropFilter: 'blur(10px)',
                  animation: `scaleIn 0.3s ease-out ${index * 0.1}s both`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = theme.shadow;
                }}
              >
                {/* Priority Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: 
                    task.priority === 'high' ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)' :
                    task.priority === 'medium' ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)' :
                    'linear-gradient(90deg, #6366F1 0%, #4F46E5 100%)',
                  borderRadius: '4px 4px 0 0'
                }}></div>

                <div style={{ flex: 1, marginBottom: '16px' }}>
                  <h4 style={{
                    margin: '0',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: theme.text,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1,
                    lineHeight: '1.4',
                    letterSpacing: '-0.25px'
                  }}>
                    {task.name}
                  </h4>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: 
                        task.priority === 'high' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' :
                        task.priority === 'medium' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' :
                        'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {task.priority}
                    </span>
                    <span style={{
                      background: 
                        task.category === 'work' ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' :
                        task.category === 'personal' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                        'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {task.category}
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  marginTop: 'auto'
                }}>
                  <button
                    onClick={() => toggleTaskComplete(task._id)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: task.completed 
                        ? 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
                        : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                  >
                    {task.completed ? '↩️ Undo' : '✅ Complete'}
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
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
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ color: theme.text, marginBottom: '16px' }}>Add New Task</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Task name..."
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                style={{
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.inputBg || theme.cardBg,
                  color: theme.text
                }}
              />
              
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                style={{
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.inputBg || theme.cardBg,
                  color: theme.text
                }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                style={{
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.inputBg || theme.cardBg,
                  color: theme.text
                }}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddTaskModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={!newTaskName.trim() || isAddingTask}
                style={{
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  opacity: (!newTaskName.trim() || isAddingTask) ? 0.6 : 1
                }}
              >
                {isAddingTask ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
