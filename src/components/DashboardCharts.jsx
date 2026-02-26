import React from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DashboardCharts = ({ tasks, theme, showCharts, setShowCharts }) => {
  // Calculate completion percentage for chart
  const completionPercentage = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Mock data for charts
  const weeklyActivityData = [
    { day: 'Mon', completed: 8, total: 12 },
    { day: 'Tue', completed: 10, total: 15 },
    { day: 'Wed', completed: 6, total: 8 },
    { day: 'Thu', completed: 9, total: 10 },
    { day: 'Fri', completed: 4, total: 6 },
    { day: 'Sat', completed: 3, total: 4 },
    { day: 'Sun', completed: 2, total: 2 }
  ];

  const categoryData = [
    { name: 'Work', value: tasks.filter(t => t.category === 'work').length, color: '#667eea' },
    { name: 'Personal', value: tasks.filter(t => t.category === 'personal').length, color: '#1DB954' },
    { name: 'Shopping', value: tasks.filter(t => t.category === 'shopping').length, color: '#FF6B35' }
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#FF6B35' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#FFA726' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#667eea' }
  ].filter(item => item.value > 0);

  const productivityData = [
    { month: 'Jan', tasks: 45, completed: 38 },
    { month: 'Feb', tasks: 52, completed: 44 },
    { month: 'Mar', tasks: 48, completed: 42 },
    { month: 'Apr', tasks: 61, completed: 55 },
    { month: 'May', tasks: 55, completed: 48 },
    { month: 'Jun', tasks: 67, completed: 62 }
  ];

  return (
    <div>
      {!showCharts ? (
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setShowCharts(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: theme.gradient,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📊 Show Charts
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            color: theme.text
          }}>
            Weekly Activity 📊
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="day" stroke={theme.chartText} />
              <YAxis stroke={theme.chartText} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBg, 
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke={theme.success} 
                fill={theme.success} 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Completed"
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#667eea" 
                fill="#667eea" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Total"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            color: theme.text
          }}>
            Category Distribution 🥧
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.cardBg, 
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.subtext
            }}>
              No task data available
            </div>
          )}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginTop: '15px',
            justifyContent: 'center'
          }}>
            {categoryData.map((category) => (
              <div key={category.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: category.color
                }}></div>
                <span style={{ fontSize: '0.9rem', color: theme.text }}>
                  {category.name} ({category.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            color: theme.text
          }}>
            Priority Distribution 📈
          </h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.chartText} />
                <YAxis stroke={theme.chartText} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.cardBg, 
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.subtext
            }}>
              No priority data available
            </div>
          )}
        </div>

        {/* Productivity Trend */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            color: theme.text
          }}>
            Productivity Trend 📈
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="month" stroke={theme.chartText} />
              <YAxis stroke={theme.chartText} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBg, 
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="#667eea" 
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 4 }}
                name="Total Tasks"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke={theme.success} 
                strokeWidth={2}
                dot={{ fill: theme.success, r: 4 }}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rate Card */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          gridColumn: '1 / -1'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            color: theme.text
          }}>
            Overall Completion Rate 🎯
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: theme.success,
                marginBottom: '10px'
              }}>
                {completionPercentage}%
              </div>
              <div style={{ fontSize: '1rem', color: theme.subtext }}>
                Tasks Completed
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: theme.text,
                marginBottom: '10px'
              }}>
                {tasks.length}
              </div>
              <div style={{ fontSize: '1rem', color: theme.subtext }}>
                Total Tasks
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: theme.warning,
                marginBottom: '10px'
              }}>
                {tasks.filter(t => !t.completed).length}
              </div>
              <div style={{ fontSize: '1rem', color: theme.subtext }}>
                Pending Tasks
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default DashboardCharts;
