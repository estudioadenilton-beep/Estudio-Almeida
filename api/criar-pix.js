import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Inicializar o Redis padrão do Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://upstash-redis-mock',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'upstash-token-mock',
});

// Limite: 5 requisições por IP a cada 10 minutos
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Pegar IP real no Vercel
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '127.0.0.1';

  try {
    // Aplicar rate limit
    const { success, pending, limit, remaining, reset } = await ratelimit.limit(`ratelimit_criar_pix_${ip}`);
    
    // Adicionar headers auxiliares
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (!success) {
      return res.status(429).json({ 
        error: 'Too Many Requests', 
        message: 'Você excedeu o limite de tentativas de criação de PIX. Aguarde alguns minutos.' 
      });
    }

    const { amount, description, payer_email } = req.body;

    if (!amount || !payer_email) {
      return res.status(400).json({ error: 'Faltam dados obrigatórios' });
    }

    // Chamada real ou mockada para Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-TOKEN'}`,
        'X-Idempotency-Key': `${Date.now()}-${ip}`,
      },
      body: JSON.stringify({
        transaction_amount: Number(amount),
        description: description || 'Pagamento Estúdio Almeida',
        payment_method_id: 'pix',
        payer: {
          email: payer_email,
        },
      }),
    });

    if (!mpResponse.ok) {
      throw new Error('Falha na API do Mercado Pago');
    }

    const data = await mpResponse.json();

    return res.status(200).json({
      id: data.id,
      qr_code: data.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      status: data.status,
    });

  } catch (error) {
    console.error('Erro na criação de PIX:', error);
    return res.status(500).json({ error: 'Erro interno ao processar PIX' });
  }
}
