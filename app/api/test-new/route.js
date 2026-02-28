export async function GET() {
  return Response.json({
    message: 'This is a new test API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}
