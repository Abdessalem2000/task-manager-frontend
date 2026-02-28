import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import Clerk components to avoid SSR issues
const SignUpComponent = dynamic(
  () => import('@clerk/nextjs').then(mod => ({ default: mod.SignUp })),
  { ssr: false }
);

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up - AI Productivity Dashboard</title>
        <meta name="description" content="Create your AI-powered productivity dashboard account" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
            min-height: 100vh;
          }
        `}</style>
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '400px',
          width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#1F2937', marginBottom: '8px' }}>
              Join AI Productivity Dashboard
            </h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '16px' }}>
              Create your account to boost your productivity
            </p>
          </div>
          
          <SignUpComponent 
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            redirectUrl="/working-app"
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
    </>
  );
}
