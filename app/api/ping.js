export default function handler(req, res) {
  // Set CORS headers IMMEDIATELY
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://task-manager-frontend-opal-nu.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS preflight FIRST - no auth, no checks
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only after OPTIONS, handle actual requests
  return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
}
