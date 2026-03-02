'use client';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import type { ReactNode } from 'react';

export function ClerkAuthWrapper({ children }: { children: ReactNode }) {
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
