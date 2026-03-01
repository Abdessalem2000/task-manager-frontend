'use client';

import React, { useState, useEffect } from 'react';
import DashboardCharts from '../../src/components/DashboardCharts';
import HabitTracker from '../../src/components/HabitTracker';
import TaskList from '../../src/components/TaskList';
import AuthWrapper from '../../src/components/AuthWrapper';
import AIAssistant from '../../src/components/AIAssistant';
import UpgradeModal from '../../src/components/UpgradeModal';

export default function WorkingApp() {
  // State management with clean initial state
  const [mounted, setMounted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  // Initialize with demo data for immediate display
  const [tasks, setTasks] = useState<any[]>([
    { _id: '1', name: 'Complete project documentation', completed: false, priority: 'high', category: 'work' },
    { _id: '2', name: 'Review pull requests', completed: true, priority: 'medium', category: 'work' },
    { _id: '3', name: 'Team meeting at 2 PM', completed: false, priority: 'high', category: 'meetings' },
    { _id: '4', name: 'Update dashboard design', completed: true, priority: 'low', category: 'work' },
    { _id: '5', name: 'Code review for feature branch', completed: false, priority: 'medium', category: 'work' }
  ]);
  const [dbConnected, setDbConnected] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  // Initialize with demo habits
  const [habits, setHabits] = useState<any[]>([
    { _id: '1', name: 'Morning meditation', completed: true, streak: 5, category: 'personal' },
    { _id: '2', name: 'Exercise for 30 minutes', completed: false, streak: 3, category: 'health' },
    { _id: '3', name: 'Read for 20 minutes', completed: true, streak: 7, category: 'learning' },
    { _id: '4', name: 'Drink 8 glasses of water', completed: true, streak: 12, category: 'health' },
    { _id: '5', name: 'No social media before noon', completed: false, streak: 2, category: 'personal' }
  ]);
  const [showHabits, setShowHabits] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [completedToday, setCompletedToday] = useState(2); // 2 tasks completed from demo data
  const [weeklyGoal, setWeeklyGoal] = useState(20);

  // Theme management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme) {
          setDarkMode(JSON.parse(savedTheme));
        }
      } catch (e) {
        // Theme loading failed
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (e) {
        // Failed to save theme preference
      }
    }
  }, [darkMode]);

  // REAL DATABASE FETCHING (with fallback to current data)
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        
        // Handle both direct array and wrapped response
        const tasksData = Array.isArray(data) ? data : (data.tasks || []);
        const isConnected = data.dbConnected !== undefined ? data.dbConnected : true;
        
        if (tasksData.length > 0) {
          setTasks(tasksData);
          setDbConnected(isConnected);
          
          // Calculate completed today
          const today = new Date().toDateString();
          const todayTasks = tasksData.filter((task: any) => 
            task.completed && new Date(task.updatedAt).toDateString() === today
          );
          setCompletedToday(todayTasks.length);
        }
      } else if (response.status === 401) {
        // User not authenticated - keep demo data
        setDbConnected(false);
      } else {
        setDbConnected(false);
      }
    } catch (error) {
      // Network error - keep demo data
      setDbConnected(false);
    }
  };

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        
        // Handle both direct array and wrapped response
        const habitsData = Array.isArray(data) ? data : (data.habits || []);
        
        if (habitsData.length > 0) {
          setHabits(habitsData);
        }
      } else if (response.status === 401) {
        // User not authenticated - keep demo habits
      } else {
        // Other error - keep demo habits
      }
    } catch (error) {
      // Network error - keep demo habits
    }
  };

  // Initial data fetch and mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Fetch data
    fetchTasks();
    fetchHabits();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme object
  const theme = darkMode ? {
    bg: '#0F0F0F',
    cardBg: '#1A1A1A', 
    text: '#FFFFFF',
    border: '#2A2A2A',
    hoverBg: '#252525',
    subtext: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    inputBg: '#1F2937',
    inputText: '#F3F4F6',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textSecondary: '#9CA3AF'
  } : {
    bg: '#FFFFFF',
    cardBg: '#F9FAFB',
    text: '#1F2937',
    border: '#E5E7EB',
    hoverBg: '#F3F4F6',
    subtext: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    inputBg: '#FFFFFF',
    inputText: '#1F2937',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    textSecondary: '#6B7280'
  };

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Task operations
  const addTask = async (taskData: any) => {
    // For demo mode, add task locally
    if (!dbConnected) {
      const newTask = {
        _id: Date.now().toString(),
        ...taskData,
        completed: false
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('Task added successfully! (Demo Mode)', 'success');
      setIsAddingTask(false);
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setTasks(prev => [result.task, ...prev]);
        showToast('Task added successfully!', 'success');
        setIsAddingTask(false);
      } else {
        showToast('Failed to add task', 'error');
      }
    } catch (error) {
      showToast('Error adding task', 'error');
    }
  };

  const deleteTask = async (taskId: string) => {
    // For demo mode, delete task locally
    if (!dbConnected) {
      setTasks(prev => prev.filter(task => task._id !== taskId));
      showToast('Task deleted successfully! (Demo Mode)', 'success');
      return;
    }

    try {
      const response = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
        showToast('Task deleted successfully!', 'success');
      } else {
        showToast('Failed to delete task', 'error');
      }
    } catch (error) {
      showToast('Error deleting task', 'error');
    }
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    // For demo mode, toggle task locally
    if (!dbConnected) {
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, completed } : task
      ));
      showToast(`Task ${completed ? 'completed' : 'uncompleted'}! (Demo Mode)`, 'success');
      return;
    }

    try {
      const response = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === taskId ? { ...task, ...updatedTask } : task
        ));
        showToast(`Task ${completed ? 'completed' : 'uncompleted'}!`, 'success');
      } else {
        showToast('Failed to update task', 'error');
      }
    } catch (error) {
      showToast('Error updating task', 'error');
    }
  };

  // Filter tasks with error handling
  const filteredTasks = tasks.filter(task => {
    try {
      const matchesSearch = task.name ? task.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesCompleted = showCompleted || !task.completed;
      return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
    } catch (error) {
      console.error('Error filtering task:', error);
      return false;
    }
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AuthWrapper>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Toast Notifications */}
        {toasts.map(toast => (
          <div key={toast.id} style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: toast.type === 'success' ? theme.success : toast.type === 'error' ? theme.error : theme.primary,
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: theme.shadow,
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out'
          }}>
            {toast.message}
          </div>
        ))}

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{ fontSize: '2.2em', margin: '0', color: theme.primary, marginBottom: '5px' }}>
                ✨ Professional Dashboard
              </h1>
              <p style={{ margin: '0', color: theme.textSecondary, fontSize: '1em' }}>
                Welcome back, {user?.name || 'Guest'}! Here's your productivity overview.
              </p>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1em',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.cardBg;
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                📋 Total Tasks
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.primary }}>
                {totalTasks}
              </p>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                ✅ Completed Today
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.success }}>
                {completedToday}
              </p>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                📈 Completion Rate
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.primary }}>
                {completionRate}%
              </p>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                🎯 Weekly Goal
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.warning }}>
                {weeklyGoal}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          {showCharts && (
            <DashboardCharts 
              tasks={tasks}
              theme={theme}
              showCharts={showCharts}
              setShowCharts={setShowCharts}
            />
          )}

          {/* Task List */}
          {(() => {
            try {
              return (
                <TaskList
                  tasks={filteredTasks}
                  setTasks={setTasks}
                  theme={theme}
                  showHabits={showHabits}
                  showStats={true}
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
              );
            } catch (error) {
              console.error('TaskList error:', error);
              return (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: theme.cardBg, 
                  borderRadius: '12px',
                  border: `1px solid ${theme.error}`,
                  color: theme.text
                }}>
                  <h3>⚠️ Task List Error</h3>
                  <p>Unable to load task list. Please refresh the page.</p>
                </div>
              );
            }
          })()}

          {/* Habit Tracker */}
          {(() => {
            try {
              return (
                <HabitTracker
                  habits={habits}
                  setHabits={setHabits}
                  theme={theme}
                  showHabits={showHabits}
                  setShowHabits={setShowHabits}
                  showToast={showToast}
                  darkMode={darkMode}
                />
              );
            } catch (error) {
              console.error('HabitTracker error:', error);
              return (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: theme.cardBg, 
                  borderRadius: '12px',
                  border: `1px solid ${theme.error}`,
                  color: theme.text
                }}>
                  <h3>⚠️ Habit Tracker Error</h3>
                  <p>Unable to load habit tracker. Please refresh the page.</p>
                </div>
              );
            }
          })()}

          {/* AI Assistant */}
          {(() => {
            try {
              return (
                <AIAssistant
                  tasks={tasks}
                  theme={theme}
                  showToast={showToast}
                />
              );
            } catch (error) {
              console.error('AIAssistant error:', error);
              return (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: theme.cardBg, 
                  borderRadius: '12px',
                  border: `1px solid ${theme.error}`,
                  color: theme.text
                }}>
                  <h3>⚠️ AI Assistant Error</h3>
                  <p>Unable to load AI assistant. Please refresh the page.</p>
                </div>
              );
            }
          })()}

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <UpgradeModal
              theme={theme}
              isOpen={showUpgradeModal}
              onClose={() => setShowUpgradeModal(false)}
              showToast={showToast}
            />
          )}

          {/* Profile Settings Modal */}
          {showProfileSettings && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: theme.cardBg,
                padding: '30px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow,
                width: '90%',
                maxWidth: '500px',
                animation: 'scaleIn 0.3s ease-out'
              }}>
                <h2 style={{ color: theme.text, marginBottom: '20px' }}>Profile Settings</h2>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="userName" style={{ display: 'block', color: theme.textSecondary, marginBottom: '5px' }}>Name:</label>
                  <input
                    id="userName"
                    type="text"
                    value={user?.name || ''}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.inputBg,
                      color: theme.inputText,
                      fontSize: '1em',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowProfileSettings(false)}
                    style={{
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowProfileSettings(false)}
                    style={{
                      backgroundColor: theme.primary,
                      border: 'none',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Buttons */}
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 100
          }}>
            <button
              onClick={() => setShowCharts(!showCharts)}
              style={{
                backgroundColor: theme.primary,
                border: 'none',
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: theme.shadow,
                fontSize: '1.2em'
              }}
            >
              📊
            </button>
            
            <button
              onClick={() => setShowUpgradeModal(true)}
              style={{
                backgroundColor: theme.secondary,
                border: 'none',
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: theme.shadow,
                fontSize: '1.2em'
              }}
            >
              💎
            </button>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
