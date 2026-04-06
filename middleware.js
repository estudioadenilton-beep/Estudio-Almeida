
// middleware.js
// Vercel Edge Middleware
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// O middleware roda no Edge, o Upstash Redis SDK (HTTP) é compatível!
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://upstash-redis-mock',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'upstash-token-mock',
});

// Limite: 3 tentativas por IP a cada 5 minutos (Auth)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '5 m'),
  analytics: true,
  ephemeralCache: new Map(), // Opcional, cache local para Edge Functions
});

export const config = {
  matcher: [
    '/login',
    '/cadastro',
    '/admin-login',
    '/esqueci-senha'
  ],
};

export default async function middleware(request) {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(`ratelimit_auth_${ip}`);
  
  if (!success) {
    // Retornamos 429 mas em formato HTML já que são rotas de página, 
    // ou deixamos o roteador lidar caindo numa página genérica com 429
    return new Response(JSON.stringify({ 
      error: 'Too Many Requests',
      message: 'Muitas tentativas na rota de autenticação. Aguarde alguns minutos.' 
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': '300'
      }
    });
  }

  const response = Response.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  
  return response;
}
