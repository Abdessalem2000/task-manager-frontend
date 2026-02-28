import React, { useState } from 'react';

const UpgradeModal = ({ theme, isOpen, onClose, showToast }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpgrade = async () => {
    setIsSubmitting(true);
    
    // Simulate upgrade process
    setTimeout(() => {
      showToast('🚀 Upgrade request received! We\'ll contact you soon.', 'success');
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        background: theme.cardBg,
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${theme.glassBorder}`,
        backdropFilter: 'blur(10px)',
        zIndex: 2001,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '30px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
          color: 'white',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚀</div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8em' }}>
            Upgrade to Pro
          </h2>
          <p style={{ margin: 0, fontSize: '1em', opacity: 0.9 }}>
            Unlock AI-powered productivity features
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Features */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: theme.text, fontSize: '1.2em' }}>
              ✨ Pro Features
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: '500', marginBottom: '2px' }}>
                    🤖 AI Task Optimization
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '0.9em' }}>
                    Smart prioritization and next-step suggestions
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: '500', marginBottom: '2px' }}>
                    📊 Advanced Analytics
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '0.9em' }}>
                    Deep insights into your productivity patterns
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: '500', marginBottom: '2px' }}>
                    🎯 Smart Scheduling
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '0.9em' }}>
                    AI-powered time management and scheduling
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: '500', marginBottom: '2px' }}>
                    🔄 Unlimited Sync
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '0.9em' }}>
                    Sync across all your devices seamlessly
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '30px',
            border: `1px solid ${theme.primary}33`,
          }}>
            <div style={{ color: theme.text, fontSize: '1.1em', marginBottom: '5px' }}>
              Limited Time Offer
            </div>
            <div style={{ color: theme.primary, fontSize: '2em', fontWeight: 'bold', marginBottom: '5px' }}>
              $9.99<span style={{ fontSize: '0.6em', fontWeight: 'normal' }}>/month</span>
            </div>
            <div style={{ color: theme.textSecondary, fontSize: '0.9em' }}>
              Save 50% with annual billing
            </div>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: theme.text, marginBottom: '8px', fontWeight: '500' }}>
              Email for upgrade instructions:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                background: theme.hoverBg,
                color: theme.text,
                fontSize: '16px',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleUpgrade}
              disabled={isSubmitting || !email}
              style={{
                flex: 1,
                padding: '15px',
                background: isSubmitting ? theme.hoverBg : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting || !email ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {isSubmitting ? 'Processing...' : '🚀 Upgrade Now'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '15px 20px',
                background: theme.hoverBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
            fontSize: '0.8em',
            color: theme.textSecondary,
          }}>
            <span>🔒 Secure Payment</span>
            <span>💳 30-Day Guarantee</span>
            <span>⭐ 4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradeModal;
