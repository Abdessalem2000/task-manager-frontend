'use client';

import { useUser } from '@clerk/nextjs';
import { ClerkAuthWrapper } from '../../src/components/ClerkAuthWrapper';
import ClientDashboard from '../../src/components/ClientDashboard';

export default function WorkingApp() {
  // Check if Clerk is available
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkAvailable = clerkPublishableKey && 
      clerkPublishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE' && 
      clerkPublishableKey.startsWith('pk_test_');
  
  // Only use useUser if Clerk is available
  const clerkUser = isClerkAvailable ? useUser() : { isLoaded: true, isSignedIn: false, user: null };
  const { isLoaded = true, isSignedIn = false, user = null } = clerkUser;

  return (
    <ClerkAuthWrapper>
      <ClientDashboard />
    </ClerkAuthWrapper>
  );
}
