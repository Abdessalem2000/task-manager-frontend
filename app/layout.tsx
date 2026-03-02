import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import '../src/App.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only use ClerkProvider if we have a valid key (not the placeholder)
  if (clerkPublishableKey && 
      clerkPublishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE' && 
      clerkPublishableKey.startsWith('pk_test_')) {
    return (
      <html lang="en">
        <body>
          <ClerkProvider publishableKey={clerkPublishableKey}>
            {children}
          </ClerkProvider>
        </body>
      </html>
    );
  }

  // Fallback without Clerk for development or invalid key
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
