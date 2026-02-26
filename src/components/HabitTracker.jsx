import React, { useState } from 'react';

const HabitTracker = ({ 
  habits, 
  setHabits, 
  theme, 
  showHabits, 
  setShowHabits,
  showToast 
}) => {
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const [newHabitName, setNewHabitName] = useState('');
  const [showHabitModal, setShowHabitModal] = useState(false);

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

  const getStreakColor = (streak) => {
    if (streak >= 30) return '#FF6B35';
    if (streak >= 21) return '#FFA726';
    if (streak >= 14) return '#FFD700';
    if (streak >= 7) return '#1DB954';
    if (streak >= 3) return '#667eea';
    return theme.subtext;
  };

  // NO EARLY RETURNS - ALL HOOKS ALREADY CALLED
  return (
    <div>
      {showHabits ? (
        <div style={{ padding: '20px' }}>
          {/* Habits Header */}
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.text
              }}>
                🌟 Daily Habits
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
                  fontWeight: '500'
                }}
              >
                ➕ Add Habit
              </button>
            </div>

            {/* Habits List */}
            {habits.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: theme.subtext
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌱</div>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>No habits yet</div>
                <div style={{ fontSize: '14px' }}>Start building positive habits today!</div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {habits.map(habit => (
                  <div key={habit._id} style={{
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: theme.text,
                        textDecoration: habit.completed ? 'line-through' : 'none'
                      }}>
                        {habit.name}
                      </h3>
                      <button
                        onClick={() => deleteHabit(habit._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: theme.danger,
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '5px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{ fontSize: '24px' }}>
                          {getStreakEmoji(habit.streak)}
                        </span>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: getStreakColor(habit.streak)
                          }}>
                            {habit.streak} day streak
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: theme.subtext
                          }}>
                            Keep it going!
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleHabitComplete(habit._id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: habit.completed ? theme.success : theme.hoverBg,
                          border: `1px solid ${habit.completed ? theme.success : theme.border}`,
                          borderRadius: '20px',
                          color: habit.completed ? 'white' : theme.text,
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {habit.completed ? '✅ Done' : '⭕ Mark Done'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Habit Modal */}
          {showHabitModal && (
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
                borderRadius: '16px',
                padding: '30px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: theme.text
                }}>
                  Add New Habit
                </h3>
                
                <input
                  type="text"
                  placeholder="Enter habit name..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.cardBg,
                    color: theme.text,
                    fontSize: '16px',
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
                      backgroundColor: newHabitName.trim() ? theme.success : theme.hoverBg,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: newHabitName.trim() ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Create Habit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default HabitTracker;
