import React, { useState, useEffect } from 'react';

const ProfileSettings = ({ user, onBack, darkMode, showToast, userLevel, userXP, badges }) => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: '',
    phone: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0
  });

  // Theme colors
  const theme = darkMode ? {
    bg: '#121212',
    cardBg: '#181818',
    text: '#FFFFFF',
    textSecondary: '#A7A7A7',
    border: '#282828',
    inputBg: '#282828',
    sidebarBg: '#181818'
  } : {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#202124',
    textSecondary: '#5f6368',
    border: 'rgba(255,255,255,0.2)',
    inputBg: 'white',
    sidebarBg: 'rgba(255,255,255,0.95)'
  };

  // Load user data and stats on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || '',
        email: user.email || '',
        bio: localStorage.getItem('userBio') || '',
        phone: localStorage.getItem('userPhone') || ''
      });
      
      // Load profile picture
      const savedProfilePicture = localStorage.getItem('profilePicture');
      if (savedProfilePicture) {
        setProfilePicture(savedProfilePicture);
      }
      
      // Calculate user stats
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const userTasks = tasks.filter(task => task.userId === user.id);
      const completedTasks = userTasks.filter(task => task.completed);
      
      setUserStats({
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        completionRate: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
      });
    }
  }, [user]);

  // Handle profile picture upload
  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        localStorage.setItem('profilePicture', e.target.result);
        showToast('📸 Profile picture updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userBio', profileData.bio);
      localStorage.setItem('userPhone', profileData.phone);
      
      // Update user in localStorage
      const updatedUser = { ...user, name: profileData.fullName, email: profileData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsLoading(false);
      showToast('✅ Profile updated successfully!', 'success');
    }, 1000);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('❌ Passwords do not match!', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showToast('⚠️ Password must be at least 6 characters!', 'error');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsLoading(false);
      showToast('🔒 Password changed successfully!', 'success');
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      padding: '40px 30px',
      color: theme.text
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        gap: '20px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Profile Settings
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Profile Information Card */}
        <div style={{
          background: theme.cardBg,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.border}`,
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            margin: '0 0 30px 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: theme.text
          }}>
            Profile Information
          </h2>

          {/* Profile Picture */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#1a73e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '48px',
              color: 'white',
              fontWeight: 'bold',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(26, 115, 232, 0.3)',
              border: `3px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'}`,
              transition: 'all 0.3s ease'
            }}
            onClick={() => document.getElementById('profile-upload-settings').click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(26, 115, 232, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(26, 115, 232, 0.3)';
            }}>
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                profileData.fullName?.charAt(0).toUpperCase() || 'U'
              )}
              <input
                id="profile-upload-settings-file"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureUpload}
              />
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '32px',
                height: '32px',
                backgroundColor: '#34a853',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                border: `2px solid ${darkMode ? '#2d2d44' : 'white'}`
              }}>
                📷
              </div>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: theme.textSecondary
            }}>
              Click to change profile picture
            </p>
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.textSecondary
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = theme.border}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.textSecondary
              }}>
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = theme.border}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.textSecondary
              }}>
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = theme.border}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.textSecondary
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = theme.border}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: isLoading ? '#ccc' : '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* User Stats Card */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 30px 0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: theme.text
            }}>
              Your Activity Stats
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                borderRadius: '12px'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#1a73e8',
                  marginBottom: '8px'
                }}>
                  {userStats.totalTasks}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: theme.textSecondary
                }}>
                  Total Tasks
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                borderRadius: '12px'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#34a853',
                  marginBottom: '8px'
                }}>
                  {userStats.completedTasks}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: theme.textSecondary
                }}>
                  Completed
                </div>
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
              borderRadius: '12px'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#fbbc04',
                marginBottom: '8px'
              }}>
                {userStats.completionRate}%
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: theme.textSecondary
              }}>
                Completion Rate
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 30px 0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: theme.text
            }}>
              🏆 Achievements
            </h2>
            
            {/* User Level Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
              borderRadius: '12px',
              border: `1px solid ${darkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.2)'}`
            }}>
              <div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: '#FFD700',
                  marginBottom: '5px'
                }}>
                  Level {userLevel}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: darkMode ? '#A7A7A7' : '#666'
                }}>
                  {userXP} Total XP
                </div>
              </div>
              <div style={{
                fontSize: '3rem'
              }}>
                🌟
              </div>
            </div>
            
            {/* Badges Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: darkMode ? 'rgba(29, 185, 84, 0.1)' : 'rgba(29, 185, 84, 0.1)',
                    borderRadius: '12px',
                    border: `1px solid ${darkMode ? 'rgba(29, 185, 84, 0.3)' : 'rgba(29, 185, 84, 0.2)'}`
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '10px'
                    }}>
                      {badge === 'First Task Completed' ? '🎯' : badge === 'Weekly Warrior' ? '⚔️' : '🏆'}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: theme.text,
                      marginBottom: '5px'
                    }}>
                      {badge}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: darkMode ? '#A7A7A7' : '#666'
                    }}>
                      Unlocked!
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px',
                  color: darkMode ? '#A7A7A7' : '#666',
                  fontSize: '1rem'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '15px',
                    opacity: 0.5
                  }}>
                    🔒
                  </div>
                  Complete tasks to unlock achievements!
                </div>
              )}
            </div>
            
            {/* Progress Hint */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: darkMode ? '#A7A7A7' : '#666',
              textAlign: 'center'
            }}>
              💡 Complete more tasks to earn XP and unlock new badges!
            </div>
          </div>

          {/* Account Security Card */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1px solid #282828' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 30px 0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: theme.text
            }}>
              Account Security
            </h2>

            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.textSecondary
                }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: theme.text,
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = theme.border}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.textSecondary
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: theme.text,
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = theme.border}
                  required
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.textSecondary
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: theme.text,
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = theme.border}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: isLoading ? '#ccc' : '#ea4335',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
