import { describe, it, expect, vi, beforeEach } from 'vitest';
import waitForPix from '../../../api/criar-pix';

// Mock do @upstash/ratelimit
vi.mock('@upstash/ratelimit', () => {
  return {
    Ratelimit: class {
      static slidingWindow = vi.fn();
      constructor() {}
      async limit(identifier) {
        if (identifier.includes('blocked')) {
          return { success: false, limit: 5, remaining: 0, reset: Date.now() + 1000 };
        }
        return { success: true, limit: 5, remaining: 4, reset: Date.now() + 1000 };
      }
    }
  };
});

vi.mock('@upstash/redis', () => ({
  Redis: class { constructor() {} }
}));

describe('API Route: POST /api/criar-pix', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.setHeader = vi.fn();
    return res;
  };

  it('deve retornar 405 se o método não for POST', async () => {
    const req = { method: 'GET', headers: {} };
    const res = mockRes();
    
    await waitForPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
  });

  it('deve retornar 429 se o rate limit for atingido', async () => {
    const req = { 
      method: 'POST', 
      headers: { 'x-real-ip': 'blocked-ip' },
      body: {} 
    };
    const res = mockRes();
    
    await waitForPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Too Many Requests' }));
  });

  it('deve retornar configuração do QR Code mockado em sucesso', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '123456789',
        status: 'pending',
        point_of_interaction: {
          transaction_data: {
            qr_code: '00020101021243650016COM.MERCADOLIBRE',
            qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAA',
          }
        }
      })
    });

    const req = { 
      method: 'POST', 
      headers: { 'x-real-ip': 'valid-ip' },
      body: { amount: 150, description: 'Teste', payer_email: 'test@test.com' } 
    };
    const res = mockRes();
    
    await waitForPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: '123456789',
      qr_code: '00020101021243650016COM.MERCADOLIBRE',
      qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAA',
      status: 'pending'
    });
  });

  it('deve retornar 500 se o Mercado Pago falhar', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false
    });

    const req = { 
      method: 'POST', 
      headers: { 'x-real-ip': 'valid-ip' },
      body: { amount: 150, payer_email: 'test@test.com' } 
    };
    const res = mockRes();
    
    await waitForPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao processar PIX' });
  });
});
