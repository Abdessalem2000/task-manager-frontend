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
      // Use relative path for Vercel deployment, fallback to env var for local development
      const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
      const apiUrl = isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
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
      
      if (data.task) {
        setTasks(prev => [data.task, ...prev]);
        setNewTaskName('');
        setNewTaskPriority('medium');
        setNewTaskCategory('work');
        setShowAddTaskModal(false);
        showToast('Task added successfully! ✅', 'success');
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
      // Use relative path for Vercel deployment, fallback to env var for local development
      const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
      const apiUrl = isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
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

      // Use relative path for Vercel deployment, fallback to env var for local development
      const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
      const apiUrl = isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
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
        showToast(data.task.completed ? 'Task completed! 🎉' : 'Task marked as incomplete', 'success');
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
            borderRadius: '12px',
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

      {/* Task Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '5px'
          }}>
            {filteredTasks.length}
          </div>
          <div style={{ fontSize: '0.9rem', color: theme.subtext }}>
            Filtered Tasks
          </div>
        </div>
        
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.success,
            marginBottom: '5px'
          }}>
            {filteredTasks.filter(t => t.completed).length}
          </div>
          <div style={{ fontSize: '0.9rem', color: theme.subtext }}>
            Completed
          </div>
        </div>
        
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.danger,
            marginBottom: '5px'
          }}>
            {filteredTasks.filter(t => !t.completed && t.priority === 'high').length}
          </div>
          <div style={{ fontSize: '0.9rem', color: theme.subtext }}>
            High Priority
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${priorityColors[task.priority]}`,
                transition: 'all 0.2s ease',
                opacity: task.completed ? 0.7 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Priority Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: priorityColors[task.priority],
                color: 'white',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {task.priority}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: theme.text,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  paddingRight: '80px' // Space for priority badge
                }}>
                  {task.name}
                </h3>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                  {task.completed && (
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: theme.success,
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
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
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
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
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
            {searchQuery || filterCategory !== 'all' || filterPriority !== 'all' || !showCompleted ? '🔍' : '📝'}
          </div>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            color: theme.text
          }}>
            {searchQuery || filterCategory !== 'all' || filterPriority !== 'all' || !showCompleted 
              ? 'No tasks found' 
              : 'No tasks yet'}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: theme.subtext,
            marginBottom: '25px'
          }}>
            {searchQuery || filterCategory !== 'all' || filterPriority !== 'all' || !showCompleted
              ? 'Try adjusting your filters or search query'
              : 'Start by adding your first task!'}
          </p>
          {!searchQuery && filterCategory === 'all' && filterPriority === 'all' && showCompleted && (
            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{
                padding: '15px 30px',
                backgroundColor: theme.gradient,
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              ➕ Add Your First Task
            </button>
          )}
        </div>
      )}

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
                autoFocus
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
                onClick={addTask}
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
    </div>
  );
};

export default TaskList;
