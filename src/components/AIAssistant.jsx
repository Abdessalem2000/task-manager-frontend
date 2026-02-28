import React, { useState } from 'react';

const AIAssistant = ({ tasks, theme, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const optimizeTasks = async () => {
    setIsOptimizing(true);
    setAiResponse(null);

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data);
        if (!data.demo) {
          showToast('🤖 AI optimization completed successfully!', 'success');
        }
      } else {
        throw new Error(data.error || 'AI optimization failed');
      }
    } catch (error) {
      console.error('AI Optimization Error:', error);
      showToast('🤖 AI optimization failed. Please try again.', 'error');
      setAiResponse({
        optimizedTasks: [],
        suggestions: [
          {
            type: 'error',
            message: '🤖 AI optimization temporarily unavailable. Try again later!',
            demo: false
          }
        ],
        demo: false
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#6366F1';
      default: return theme.primary;
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'priority': return '🎯';
      case 'efficiency': return '⚡';
      case 'motivation': return '🚀';
      case 'next_step': return '📋';
      case 'empty': return '📝';
      case 'error': return '⚠️';
      default: return '💡';
    }
  };

  return (
    <div>
      {/* AI Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.4)';
        }}
      >
        🤖
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          background: theme.cardBg,
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: `1px solid ${theme.glassBorder}`,
          backdropFilter: 'blur(10px)',
          zIndex: 1001,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ margin: 0, color: theme.text, fontSize: '1.2em' }}>
              🤖 AI Productivity Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
            {/* Optimize Button */}
            <button
              onClick={optimizeTasks}
              disabled={isOptimizing}
              style={{
                width: '100%',
                padding: '15px',
                background: isOptimizing ? theme.hoverBg : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isOptimizing ? 'not-allowed' : 'pointer',
                marginBottom: '20px',
                transition: 'all 0.3s ease',
              }}
            >
              {isOptimizing ? '🤖 Analyzing...' : '⚡ Optimize My Tasks'}
            </button>

            {/* AI Response */}
            {aiResponse && (
              <div>
                {/* Optimized Tasks */}
                {aiResponse.optimizedTasks && aiResponse.optimizedTasks.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: theme.text, fontSize: '1em' }}>
                      📋 Optimized Task Order
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {aiResponse.optimizedTasks.map((task, index) => (
                        <div
                          key={index}
                          style={{
                            background: theme.hoverBg,
                            padding: '15px',
                            borderRadius: '8px',
                            border: `1px solid ${getPriorityColor(task.priority)}33`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <span style={{ color: theme.text, fontWeight: '500' }}>
                              {index + 1}. {task.name}
                            </span>
                            <span
                              style={{
                                background: getPriorityColor(task.priority),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8em',
                                fontWeight: 'bold',
                              }}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                          {task.nextStep && (
                            <div style={{ color: theme.textSecondary, fontSize: '0.9em', marginBottom: '5px' }}>
                              💡 {task.nextStep}
                            </div>
                          )}
                          {task.estimatedTime && (
                            <div style={{ color: theme.textSecondary, fontSize: '0.8em' }}>
                              ⏱️ {task.estimatedTime} minutes
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
                  <div>
                    <h4 style={{ margin: '0 0 15px 0', color: theme.text, fontSize: '1em' }}>
                      💡 AI Suggestions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {aiResponse.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          style={{
                            background: suggestion.demo ? 'rgba(99, 102, 241, 0.1)' : theme.hoverBg,
                            padding: '12px',
                            borderRadius: '8px',
                            border: suggestion.demo ? `1px solid ${theme.primary}33` : `1px solid ${theme.border}`,
                          }}
                        >
                          <div style={{ color: theme.text, fontSize: '0.9em' }}>
                            {getSuggestionIcon(suggestion.type)} {suggestion.message}
                          </div>
                          {suggestion.demo && (
                            <div style={{ color: theme.textSecondary, fontSize: '0.8em', marginTop: '5px' }}>
                              Configure OpenAI API key to enable real AI optimization
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!aiResponse && !isOptimizing && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
                <h4 style={{ margin: '0 0 10px 0', color: theme.text }}>
                  AI Productivity Assistant
                </h4>
                <p style={{ margin: 0, color: theme.textSecondary, fontSize: '0.9em' }}>
                  Get intelligent task optimization and personalized productivity suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default AIAssistant;
