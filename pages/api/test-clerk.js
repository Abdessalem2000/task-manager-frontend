export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  return res.status(200).json({
    environment: 'production',
    timestamp: new Date().toISOString(),
    clerkConfigured: clerkKey && clerkKey !== 'pk_test_YOUR_CLERK_KEY_HERE',
    clerkSecretConfigured: clerkSecret && clerkSecret !== 'sk_test_YOUR_CLERK_SECRET_HERE',
    openaiConfigured: openaiKey && openaiKey !== 'sk_test_YOUR_OPENAI_KEY_HERE',
    clerkKeyLength: clerkKey ? clerkKey.length : 0,
    clerkKeyStart: clerkKey ? clerkKey.substring(0, 10) + '...' : 'not_set',
    openaiKeyLength: openaiKey ? openaiKey.length : 0,
    openaiKeyStart: openaiKey ? openaiKey.substring(0, 10) + '...' : 'not_set'
  });
}
