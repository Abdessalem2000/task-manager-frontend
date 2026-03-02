'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import DashboardCharts from '../../src/components/DashboardCharts';
import HabitTracker from '../../src/components/HabitTracker';
import TaskList from '../../src/components/TaskList';
import { ClerkAuthWrapper } from '../../src/components/ClerkAuthWrapper';
import AIAssistant from '../../src/components/AIAssistant';
import UpgradeModal from '../../src/components/UpgradeModal';

type Task = {
  _id: string;
  name: string;
  completed: boolean;
  priority: string;
  category: string;
};

type Habit = {
  _id: string;
  name: string;
  completed: boolean;
  streak: number;
  category: string;
};

export default function WorkingApp() {
  // Check if Clerk is available
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkAvailable = clerkPublishableKey && 
      clerkPublishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE' && 
      clerkPublishableKey.startsWith('pk_test_');
  
  // Only use useUser if Clerk is available
  const clerkUser = isClerkAvailable ? useUser() : { isLoaded: true, isSignedIn: false, user: null };
  const { isLoaded = true, isSignedIn = false, user = null } = clerkUser;
  
  // State management with clean initial state
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showHabits, setShowHabits] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(20);

  // Initialize demo data only after component is mounted and auth is loaded
  useEffect(() => {
    if (isLoaded && mounted) {
      // Demo data for immediate display
      const demoTasks: Task[] = [
        { _id: '1', name: 'Complete project documentation', completed: false, priority: 'high', category: 'work' },
        { _id: '2', name: 'Review pull requests', completed: true, priority: 'medium', category: 'work' },
        { _id: '3', name: 'Team meeting at 2 PM', completed: false, priority: 'high', category: 'meetings' },
        { _id: '4', name: 'Update dashboard design', completed: true, priority: 'low', category: 'work' },
        { _id: '5', name: 'Code review for feature branch', completed: false, priority: 'medium', category: 'work' }
      ];
      
      const demoHabits: Habit[] = [
        { _id: '1', name: 'Morning meditation', completed: true, streak: 5, category: 'personal' },
        { _id: '2', name: 'Exercise for 30 minutes', completed: false, streak: 3, category: 'health' },
        { _id: '3', name: 'Read for 20 minutes', completed: true, streak: 7, category: 'learning' }
      ];
      
      setTasks(demoTasks);
      setHabits(demoHabits);
      setCompletedToday(2);
    }
  }, [isLoaded, mounted]);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Task operations (only work if signed in)
  const addTask = async (taskData: any) => {
    if (!isClerkAvailable || !isSignedIn) {
      showToast('Please sign in to add tasks', 'error');
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
    if (!isClerkAvailable || !isSignedIn) {
      showToast('Please sign in to delete tasks', 'error');
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
    if (!isClerkAvailable || !isSignedIn) {
      showToast('Please sign in to update tasks', 'error');
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

  // Filter tasks
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

  // Show loading state during initial load
  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
          <h1 style={{ fontSize: '24px', margin: 0, color: theme.text }}>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <ClerkAuthWrapper>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: isMobile ? '16px' : '24px',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: isMobile ? '1.5em' : '2em', 
                fontWeight: 'bold', 
                color: theme.text 
              }}>
                ✨ Professional Dashboard
              </h1>
              {user && (
                <p style={{ 
                  margin: '4px 0 0 8px', 
                  fontSize: '0.9em', 
                  color: theme.subtext 
                }}>
                  Welcome back, {user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0]}! Here's your productivity overview.
                </p>
              )}
              {!user && (
                <p style={{ 
                  margin: '4px 0 0 8px', 
                  fontSize: '0.9em', 
                  color: theme.subtext 
                }}>
                  Welcome back, {!isClerkAvailable ? 'Developer!' : 'Guest!'} Here's your productivity overview.
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowProfileSettings(!showProfileSettings)}
                style={{
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setShowUpgradeModal(!showUpgradeModal)}
                style={{
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ⭐ Upgrade
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '16px' : '24px'
        }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
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
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.warning }}>
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
                📊 Total Tasks
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

          {/* Habit Tracker */}
          <HabitTracker
            habits={habits}
            setHabits={setHabits}
            theme={theme}
            showHabits={showHabits}
            setShowHabits={setShowHabits}
            showToast={showToast}
            darkMode={darkMode}
          />

          {/* AI Assistant */}
          <AIAssistant
            tasks={tasks}
            theme={theme}
            showToast={showToast}
          />

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
                maxWidth: '500px'
              }}>
                <h2 style={{ color: theme.text, marginBottom: '20px' }}>Profile Settings</h2>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="userName" style={{ display: 'block', color: theme.textSecondary, marginBottom: '5px' }}>Name:</label>
                  <input
                    id="userName"
                    type="text"
                    value={user?.firstName || (!isClerkAvailable ? 'Developer' : '')}
                    readOnly
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

        {/* Toast Notifications */}
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: toast.type === 'error' ? theme.error : toast.type === 'success' ? theme.success : theme.primary,
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: theme.shadow,
              zIndex: 1000,
              fontSize: '14px',
              maxWidth: '300px'
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ClerkAuthWrapper>
  );
}
