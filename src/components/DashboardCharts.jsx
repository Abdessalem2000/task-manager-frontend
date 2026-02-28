import React from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const DashboardCharts = ({ tasks = [], theme, showCharts, setShowCharts }) => {
  // Ensure tasks is an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  // Calculate completion percentage for chart
  const completionPercentage = safeTasks.length > 0 
    ? Math.round((safeTasks.filter(t => t.completed).length / safeTasks.length) * 100)
    : 0;

  // Enhanced mock data for professional charts
  const weeklyActivityData = [
    { day: 'Mon', completed: 8, total: 12, efficiency: 67 },
    { day: 'Tue', completed: 10, total: 15, efficiency: 67 },
    { day: 'Wed', completed: 6, total: 8, efficiency: 75 },
    { day: 'Thu', completed: 9, total: 10, efficiency: 90 },
    { day: 'Fri', completed: 4, total: 6, efficiency: 67 },
    { day: 'Sat', completed: 3, total: 4, efficiency: 75 },
    { day: 'Sun', completed: 2, total: 2, efficiency: 100 }
  ];

  const categoryData = [
    { name: 'Work', value: safeTasks.filter(t => t.category === 'work').length, color: '#6366F1' },
    { name: 'Personal', value: safeTasks.filter(t => t.category === 'personal').length, color: '#10B981' },
    { name: 'Shopping', value: safeTasks.filter(t => t.category === 'shopping').length, color: '#F59E0B' }
  ];

  const priorityData = [
    { name: 'High', value: safeTasks.filter(t => t.priority === 'high').length, color: '#EF4444' },
    { name: 'Medium', value: safeTasks.filter(t => t.priority === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: safeTasks.filter(t => t.priority === 'low').length, color: '#6366F1' }
  ];

  const productivityData = [
    { month: 'Jan', tasks: 45, completed: 38, efficiency: 84 },
    { month: 'Feb', tasks: 52, completed: 44, efficiency: 85 },
    { month: 'Mar', tasks: 48, completed: 42, efficiency: 88 },
    { month: 'Apr', tasks: 61, completed: 55, efficiency: 90 },
    { month: 'May', tasks: 55, completed: 48, efficiency: 87 },
    { month: 'Jun', tasks: 67, completed: 62, efficiency: 93 }
  ];

  const performanceData = [
    { subject: 'Speed', A: 85, fullMark: 100 },
    { subject: 'Quality', A: 92, fullMark: 100 },
    { subject: 'Consistency', A: 78, fullMark: 100 },
    { subject: 'Focus', A: 88, fullMark: 100 },
    { subject: 'Planning', A: 95, fullMark: 100 },
    { subject: 'Execution', A: 82, fullMark: 100 }
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: theme.text }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '2px 0', 
              color: entry.color || theme.text,
              fontSize: '14px'
            }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {!showCharts ? (
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setShowCharts(true)}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
            }}
          >
            📊 Show Professional Analytics
          </button>
        </div>
      ) : (
        <>
          {/* Charts Toggle */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: theme.text }}>
              📊 Analytics Dashboard
            </h2>
            <button
              onClick={() => setShowCharts(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: theme.hoverBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Hide Charts
            </button>
          </div>

          {/* Charts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            {/* Weekly Activity Chart */}
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.glassBorder}`,
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: theme.text, fontSize: '1.2rem', fontWeight: '600' }}>
                📈 Weekly Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyActivityData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis dataKey="day" stroke={theme.chartText} />
                  <YAxis stroke={theme.chartText} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stroke="#10B981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                  <Area type="monotone" dataKey="total" stroke="#6366F1" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.glassBorder}`,
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: theme.text, fontSize: '1.2rem', fontWeight: '600' }}>
                🎯 Category Distribution
              </h3>
              {categoryData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.textSecondary,
                  fontSize: '16px'
                }}>
                  No tasks available for category analysis
                </div>
              )}
            </div>

            {/* Priority Analysis */}
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.glassBorder}`,
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: theme.text, fontSize: '1.2rem', fontWeight: '600' }}>
                ⚡ Priority Analysis
              </h3>
              {priorityData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityData.filter(item => item.value > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                    <XAxis dataKey="name" stroke={theme.chartText} />
                    <YAxis stroke={theme.chartText} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {priorityData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.textSecondary,
                  fontSize: '16px'
                }}>
                  No tasks available for priority analysis
                </div>
              )}
            </div>

            {/* Performance Radar */}
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              padding: '25px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.glassBorder}`,
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: theme.text, fontSize: '1.2rem', fontWeight: '600' }}>
                🎯 Performance Metrics
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke={theme.chartGrid} />
                  <PolarAngleAxis dataKey="subject" stroke={theme.chartText} />
                  <PolarRadiusAxis stroke={theme.chartText} />
                  <Radar name="Performance" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} strokeWidth={3} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCharts;
