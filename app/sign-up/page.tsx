'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
          <h1 style={{ fontSize: '28px', margin: 0, color: '#1F2937', marginBottom: '8px' }}>
            AI Productivity Dashboard
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '16px' }}>
            Create your account to get started
          </p>
        </div>
        
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/working-app"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#6366F1',
              colorBackground: '#ffffff',
              colorInputBackground: '#f9fafb',
              colorInputText: '#111827',
            }
          }}
        />
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
            Already have an account?{' '}
            <a href="/sign-in" style={{ color: '#6366F1', textDecoration: 'none' }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
