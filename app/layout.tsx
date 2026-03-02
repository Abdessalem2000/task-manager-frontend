import '../src/App.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'AI Productivity Dashboard',
  description: 'Professional AI-powered task management and productivity tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Only use ClerkProvider if we have a valid key (not the placeholder)
  if (clerkPublishableKey && 
      clerkPublishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE' && 
      clerkPublishableKey.startsWith('pk_test_')) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <html lang="en">
          <body>
            <div id="clerk-root">
              {children}
            </div>
          </body>
        </html>
      </ClerkProvider>
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
