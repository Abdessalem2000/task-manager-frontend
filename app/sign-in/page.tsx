'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignInPage() {
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
            Sign in to access your personalized workspace
          </p>
        </div>
        
        <SignIn 
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
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
            Don't have an account?{' '}
            <a href="/sign-up" style={{ color: '#6366F1', textDecoration: 'none' }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
