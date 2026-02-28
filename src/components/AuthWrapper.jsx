import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Clerk components to avoid SSR issues
const ClerkComponents = dynamic(
  () => import('@clerk/clerk-react').then(mod => ({ 
    default: { useAuth: mod.useAuth, SignIn: mod.SignIn, SignUp: mod.SignUp, useUser: mod.useUser } 
  })),
  { ssr: false }
);

const AuthWrapper = ({ children }) => {
  const [isClerkConfigured, setIsClerkConfigured] = useState(false);
  const [clerkLoaded, setClerkLoaded] = useState(false);

  useEffect(() => {
    const configured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_YOUR_CLERK_KEY_HERE';
    setIsClerkConfigured(configured);
    setClerkLoaded(true);
  }, []);

  // If Clerk is not configured, render children directly (demo mode)
  if (!isClerkConfigured || !clerkLoaded) {
    return <>{children}</>;
  }

  return <ClerkAuthWrapper>{children}</ClerkAuthWrapper>;
};

// Separate component for Clerk authentication logic
const ClerkAuthWrapper = ({ children }) => {
  const { useAuth, SignIn, SignUp, useUser } = ClerkComponents;
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Show loading state
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Loading...</h1>
        </div>
      </div>
    );
  }

  // If not signed in, show sign-in/up
  if (!isSignedIn) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
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

  // If signed in, render children
  return <>{children}</>;
};

export default AuthWrapper;
