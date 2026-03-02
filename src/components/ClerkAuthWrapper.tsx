'use client';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import type { ReactNode } from 'react';

export function ClerkAuthWrapper({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If no valid Clerk key, just render children (development mode)
  if (!clerkPublishableKey || 
      clerkPublishableKey === 'pk_test_YOUR_CLERK_KEY_HERE' || 
      !clerkPublishableKey.startsWith('pk_test_')) {
    return <>{children}</>;
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="text-center space-y-4">
            <p className="text-lg">Please sign in to view dashboard.</p>
            <SignInButton />
          </div>
        </div>
      </SignedOut>
    </>
  );
}
