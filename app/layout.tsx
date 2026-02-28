import '../src/App.css';

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

  // Only use ClerkProvider if we have a valid key
  if (clerkPublishableKey && clerkPublishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE') {
    return (
      <html lang="en">
        <body>
          <div id="clerk-root">
            {children}
          </div>
        </body>
      </html>
    );
  }

  // Fallback without Clerk for development
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
