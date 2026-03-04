import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  // Check if Clerk is properly configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  const isClerkConfigured = publishableKey && 
         secretKey && 
         publishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE' &&
         secretKey !== 'sk_test_YOUR_CLERK_SECRET_HERE' &&
         publishableKey.startsWith('pk_test_');
  
  // Only enforce authentication if Clerk is properly configured
  if (isClerkConfigured) {
    // Protect the working-app route
    if (req.nextUrl.pathname === '/working-app') {
      const { userId } = await auth();
      if (!userId) {
        throw new Error("Unauthorized - Please sign in");
      }
    }
  }
  // If Clerk is not configured, allow all routes (development mode)
});

export const config = {
  matcher: [
    // Run Clerk on all routes except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
