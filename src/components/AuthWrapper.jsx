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
    
    // Auto-redirect after 2 seconds if not configured
    if (!configured) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/working-app';
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // If Clerk is not configured, render children directly
  if (!isClerkConfigured || !clerkLoaded) {
    return <>{children}</>;
  }

  // If Clerk is configured, render with Clerk components
  const { useAuth, SignIn, SignUp, useUser } = ClerkComponents;
  const ClerkAuthWrapper = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();

    // Show loading state only for first 2 seconds
    if (!isLoaded) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0F0F0F',
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
              Please sign in to access your personalized workspace
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <a 
              href="/sign-in" 
              style={{
                backgroundColor: '#6366F1',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'inline-block'
              }}
            >
              Sign In
            </a>
          </div>
        
          <div style={{ textAlign: 'center' }}>
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

return <>{children}</>;

};

export default AuthWrapper;
