import React, { useState } from 'react';

const HabitTracker = ({ 
  habits, 
  setHabits, 
  theme, 
  showHabits, 
  setShowHabits,
  showToast,
  darkMode 
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [showHabitModal, setShowHabitModal] = useState(false);

  const professionalHabits = [
    { _id: '1', name: 'Morning Exercise', completed: true, streak: 7, icon: '🏃‍♂️', color: '#10B981' },
    { _id: '2', name: 'Read for 30 mins', completed: true, streak: 5, icon: '📚', color: '#6366F1' },
    { _id: '3', name: 'Meditation', completed: false, streak: 3, icon: '🧘‍♂️', color: '#8B5CF6' },
    { _id: '4', name: 'Drink 8 glasses water', completed: true, streak: 12, icon: '💧', color: '#06B6D4' },
    { _id: '5', name: 'No social media before noon', completed: false, streak: 2, icon: '📱', color: '#F59E0B' }
  ];

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
      h._id === habitId 
        ? { 
            ...h, 
            completed: !h.completed, 
            streak: h.completed ? Math.max(0, h.streak - 1) : h.streak + 1 
          } 
        : h
    ));
    showToast('Habit updated! ✅', 'success');
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h._id !== habitId));
    showToast('Habit deleted! 🗑️', 'success');
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 21) return '💪';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '👍';
    return '🌱';
  };

  return (
    <div>
      {showHabits ? (
        <div style={{ padding: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.glassBorder}`,
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}>
                🌟 Professional Habits Tracker
              </h2>
              <button
                onClick={() => setShowHabitModal(true)}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
                }}
              >
                ➕ Add New Habit
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {professionalHabits.map((habit, index) => (
                <div
                  key={habit._id}
                  style={{
                    background: darkMode 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.9) 100%)',
                    border: `1px solid ${theme.glassBorder}`,
                    borderRadius: '16px',
                    padding: '24px',
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
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '16px',
                    gap: '12px'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      filter: habit.completed ? 'grayscale(100%)' : 'none',
                      opacity: habit.completed ? '0.6' : '1'
                    }}>
                      {habit.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: '0',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: theme.text,
                        textDecoration: habit.completed ? 'line-through' : 'none',
                        opacity: habit.completed ? '0.6' : '1',
                        letterSpacing: '-0.25px'
                      }}>
                        {habit.name}
                      </h3>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {getStreakEmoji(habit.streak)}
                      </span>
                      <div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: theme.text,
                          marginBottom: '2px'
                        }}>
                          {habit.streak} day streak
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: theme.subtext
                        }}>
                          Keep it going!
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => toggleHabitComplete(habit._id)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: habit.completed 
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
                      {habit.completed ? '↩️ Undo' : '✅ Complete'}
                    </button>
                    <button
                      onClick={() => deleteHabit(habit._id)}
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
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setShowHabits(true)}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
            }}
          >
            🌟 Show Professional Habits
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
