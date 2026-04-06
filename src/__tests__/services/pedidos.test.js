/**
 * src/__tests__/services/pedidos.test.js
 * Testes unitários do serviço de pedidos.
 *
 * Estratégia de mock: vi.mock() intercepta '../lib/supabase' e retorna
 * o supabaseMock antes que o módulo pedidos.js seja executado.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock do Supabase (DEVE estar antes dos imports dos serviços) ─────────────
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

import { supabase } from '@/lib/supabase';
import {
  fetchClientePedidos,
  fetchPedidoById,
  createPedido,
  updatePedido,
  ocultarPedido,
  subscribeToPedidos,
  unsubscribeChannel,
} from '@/services/pedidos';

// ─── Fixtures ────────────────────────────────────────────────────────────────
const mockPedido = {
  id: 'pedido-1',
  cliente_id: 'user-1',
  titulo: 'Logo',
  status: 'aguardando',
  oculto_pelo_cliente: false,
  created_at: '2026-01-01T00:00:00Z',
};

// Helper: cria a cadeia de mock fluente do Supabase
const mockChain = (resolvedValue) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
  };
  // Torna thenable para queries sem .single()
  chain[Symbol.toStringTag] = 'Promise';
  Object.defineProperty(chain, 'then', {
    value: (resolve, reject) => Promise.resolve(resolvedValue).then(resolve, reject),
    configurable: true,
  });
  return chain;
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── fetchClientePedidos ──────────────────────────────────────────────────────
describe('fetchClientePedidos()', () => {
  it('retorna pedidos do cliente autenticado', async () => {
    const expectedData = [mockPedido];
    supabase.from.mockReturnValue(mockChain({ data: expectedData, error: null }));

    const { data, error } = await fetchClientePedidos('user-1');

    expect(supabase.from).toHaveBeenCalledWith('pedidos');
    expect(data).toEqual(expectedData);
    expect(error).toBeNull();
  });

  it('propaga erro do Supabase sem lançar exceção', async () => {
    const mockError = { message: 'Permissão negada', code: '42501' };
    supabase.from.mockReturnValue(mockChain({ data: null, error: mockError }));

    const { data, error } = await fetchClientePedidos('user-1');

    expect(error).toEqual(mockError);
    expect(data).toBeNull();
  });
});

// ─── fetchPedidoById ──────────────────────────────────────────────────────────
describe('fetchPedidoById()', () => {
  it('retorna pedido único pelo ID', async () => {
    supabase.from.mockReturnValue(mockChain({ data: mockPedido, error: null }));

    const { data, error } = await fetchPedidoById('pedido-1');

    expect(data).toEqual(mockPedido);
    expect(error).toBeNull();
  });

  it('retorna erro quando pedido não existe (PGRST116)', async () => {
    const notFoundError = { code: 'PGRST116', message: 'Nenhum resultado encontrado' };
    supabase.from.mockReturnValue(mockChain({ data: null, error: notFoundError }));

    const { data, error } = await fetchPedidoById('inexistente');

    expect(data).toBeNull();
    expect(error.code).toBe('PGRST116');
  });
});

// ─── createPedido ──────────────────────────────────────────────────────────────
describe('createPedido()', () => {
  it('cria pedido e retorna o objeto inserido', async () => {
    supabase.from.mockReturnValue(mockChain({ data: mockPedido, error: null }));

    const novoPedido = { titulo: 'Logo', cliente_id: 'user-1' };
    const { data, error } = await createPedido(novoPedido);

    expect(error).toBeNull();
    expect(data.id).toBe('pedido-1');
  });

  it('propaga erro de validação do banco', async () => {
    const validationError = { message: 'null value in column', code: '23502' };
    supabase.from.mockReturnValue(mockChain({ data: null, error: validationError }));

    const { error } = await createPedido({});

    expect(error.code).toBe('23502');
  });
});

// ─── updatePedido ──────────────────────────────────────────────────────────────
describe('updatePedido()', () => {
  it('atualiza pedido com os campos fornecidos', async () => {
    const updated = { ...mockPedido, status: 'em produção' };
    supabase.from.mockReturnValue(mockChain({ data: [updated], error: null }));

    const { error } = await updatePedido('pedido-1', { status: 'em produção' });

    expect(error).toBeNull();
  });
});

// ─── ocultarPedido ────────────────────────────────────────────────────────────
describe('ocultarPedido()', () => {
  it('executa soft delete alterando oculto_pelo_cliente para true', async () => {
    supabase.from.mockReturnValue(mockChain({ data: null, error: null }));

    const { error } = await ocultarPedido('pedido-1');

    expect(error).toBeNull();
    // Verifica que update foi chamado (o mock registra isso)
    const fromMock = supabase.from.mock.results[0].value;
    expect(fromMock.update).toHaveBeenCalledWith({ oculto_pelo_cliente: true });
  });
});

// ─── subscribeToPedidos ────────────────────────────────────────────────────────
describe('subscribeToPedidos()', () => {
  it('cria channel com nome baseado no userId', () => {
    const mockChannel = { on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() };
    supabase.channel.mockReturnValue(mockChannel);

    const channel = subscribeToPedidos('user-1', vi.fn(), vi.fn(), vi.fn());

    expect(supabase.channel).toHaveBeenCalledWith('pedidos-cliente-user-1');
    expect(channel).toBe(mockChannel);
  });
});

// ─── unsubscribeChannel ───────────────────────────────────────────────────────
describe('unsubscribeChannel()', () => {
  it('chama removeChannel quando channel existe', () => {
    supabase.removeChannel.mockResolvedValue('ok');
    const mockChannel = {};

    unsubscribeChannel(mockChannel);

    expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
  });

  it('não lança erro quando channel é null', () => {
    expect(() => unsubscribeChannel(null)).not.toThrow();
  });
});
