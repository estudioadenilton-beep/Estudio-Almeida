
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Inicializar o Redis padrão do Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://upstash-redis-mock',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'upstash-token-mock',
});

// Limite: 30 requisições por IP a cada 1 minuto
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Pegar IP real no Vercel
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '127.0.0.1';

  try {
    // Aplicar rate limit
    const { success, limit, remaining } = await ratelimit.limit(`ratelimit_verificar_pix_${ip}`);
    
    // Adicionar headers auxiliares
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (!success) {
      return res.status(429).json({ 
        error: 'Too Many Requests', 
        message: 'Muitas verificações simultâneas. Aguarde alguns segundos.' 
      });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Falta o ID do pagamento' });
    }

    // Chamada real ou mockada para Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-TOKEN'}`,
      },
    });

    if (!mpResponse.ok) {
      throw new Error('Falha na API do Mercado Pago ao verificar pagamento');
    }

    const data = await mpResponse.json();

    return res.status(200).json({
      id: data.id,
      status: data.status,
      date_approved: data.date_approved,
    });

  } catch (error) {
    console.error('Erro na verificação de PIX:', error);
    return res.status(500).json({ error: 'Erro interno ao verificar PIX' });
  }
}
