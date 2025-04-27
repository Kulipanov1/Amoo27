import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const app = new Hono();

// Enable CORS for all routes with more permissive settings
app.use('*', cors({
  origin: '*', // Allow all origins
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 600,
  credentials: true,
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API is running' });
});

// Handle tRPC requests
app.all('/api/trpc/*', async (c) => {
  try {
    // Set content type to ensure JSON response
    c.header('Content-Type', 'application/json');
    
    // Handle the tRPC request
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: c.req.raw,
      router: appRouter,
      createContext,
      onError: (opts) => {
        console.error('tRPC error:', opts.error);
      },
    });
    
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...response.headers,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      },
    });
  } catch (error) {
    console.error('Error handling tRPC request:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Add a fallback route for OPTIONS requests (preflight)
app.options('*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  c.header('Content-Type', 'application/json');
  return c.json({ error: 'Internal Server Error' }, 500);
});

// Export the app
export default app;