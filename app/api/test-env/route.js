export async function GET() {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  // Check environment variables
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  return Response.json({
    environment: 'production',
    timestamp: new Date().toISOString(),
    clerkConfigured: clerkKey && clerkKey !== 'pk_test_YOUR_CLERK_KEY_HERE',
    clerkSecretConfigured: clerkSecret && clerkSecret !== 'sk_test_YOUR_CLERK_SECRET_HERE',
    openaiConfigured: openaiKey && openaiKey !== 'sk_test_YOUR_OPENAI_KEY_HERE',
    clerkKeyLength: clerkKey ? clerkKey.length : 0,
    clerkKeyStart: clerkKey ? clerkKey.substring(0, 10) + '...' : 'not_set',
    openaiKeyLength: openaiKey ? openaiKey.length : 0,
    openaiKeyStart: openaiKey ? openaiKey.substring(0, 10) + '...' : 'not_set',
    allEnvVars: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkKey ? 'SET' : 'NOT_SET',
      CLERK_SECRET_KEY: clerkSecret ? 'SET' : 'NOT_SET',
      OPENAI_API_KEY: openaiKey ? 'SET' : 'NOT_SET',
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET'
    }
  }, { headers });
}
