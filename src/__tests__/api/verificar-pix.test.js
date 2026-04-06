import { describe, it, expect, vi, beforeEach } from 'vitest';
import verificarPix from '../../../../api/verificar-pix';

vi.mock('@upstash/ratelimit', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Ratelimit: class {
      static slidingWindow = vi.fn();
      constructor() {}
      async limit(identifier) {
        if (identifier.includes('blocked')) {
          return { success: false, limit: 30, remaining: 0, reset: Date.now() + 1000 };
        }
        return { success: true, limit: 30, remaining: 29, reset: Date.now() + 1000 };
      }
    }
  }
});

vi.mock('@upstash/redis', () => ({
  Redis: class { constructor() {} }
}));

describe('API Route: GET /api/verificar-pix', () => {
  
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

  it('deve retornar 405 se o método não for GET', async () => {
    const req = { method: 'POST', headers: {} };
    const res = mockRes();
    
    await verificarPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('deve retornar 429 se o rate limit for atingido', async () => {
    const req = { 
      method: 'GET', 
      headers: { 'x-real-ip': 'blocked-ip' },
      query: { id: '123' } 
    };
    const res = mockRes();
    
    await verificarPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(429);
  });

  it('deve retornar status approved em sucesso', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '123456789',
        status: 'approved',
        date_approved: '2024-01-01T10:00:00Z',
      })
    });

    const req = { 
      method: 'GET', 
      headers: { 'x-real-ip': 'valid-ip' },
      query: { id: '123456789' } 
    };
    const res = mockRes();
    
    await verificarPix(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: '123456789',
      status: 'approved',
      date_approved: '2024-01-01T10:00:00Z'
    });
  });
});
