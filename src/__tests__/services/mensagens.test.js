/**
 * src/__tests__/services/mensagens.test.js
 * Testes unitários do serviço de mensagens.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
  },
}));

import { supabase } from '@/lib/supabase';
import {
  fetchMensagens,
  enviarMensagem,
  subscribeToMensagens,
} from '@/services/mensagens';

const mockMensagem = {
  id: 'msg-1',
  pedido_id: 'pedido-1',
  remetente: 'cliente',
  conteudo: 'Olá, qual o prazo?',
  created_at: '2026-01-01T11:00:00Z',
};

const mockChain = (resolvedValue) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
  };
  Object.defineProperty(chain, 'then', {
    value: (resolve, reject) => Promise.resolve(resolvedValue).then(resolve, reject),
    configurable: true,
  });
  return chain;
};

beforeEach(() => vi.clearAllMocks());

// ─── fetchMensagens ───────────────────────────────────────────────────────────
describe('fetchMensagens()', () => {
  it('busca mensagens ordenadas por data ascendente', async () => {
    const data = [mockMensagem];
    supabase.from.mockReturnValue(mockChain({ data, error: null }));

    const result = await fetchMensagens('pedido-1');

    expect(supabase.from).toHaveBeenCalledWith('mensagens');
    expect(result.data).toHaveLength(1);
    expect(result.error).toBeNull();
  });

  it('retorna array vazio quando não há mensagens', async () => {
    supabase.from.mockReturnValue(mockChain({ data: [], error: null }));

    const { data } = await fetchMensagens('pedido-sem-msgs');

    expect(data).toHaveLength(0);
  });

  it('propaga erro do banco', async () => {
    const mockError = { message: 'Row Level Security violation' };
    supabase.from.mockReturnValue(mockChain({ data: null, error: mockError }));

    const { error } = await fetchMensagens('pedido-proibido');

    expect(error).toEqual(mockError);
  });
});

// ─── enviarMensagem ───────────────────────────────────────────────────────────
describe('enviarMensagem()', () => {
  it('insere mensagem com os campos corretos', async () => {
    supabase.from.mockReturnValue(mockChain({ data: mockMensagem, error: null }));

    const payload = {
      pedidoId: 'pedido-1',
      remetente: 'cliente',
      conteudo: 'Mensagem de teste',
    };

    const { error } = await enviarMensagem(payload);

    expect(error).toBeNull();

    // Verifica que insert foi chamado com os campos corretos
    const fromMock = supabase.from.mock.results[0].value;
    expect(fromMock.insert).toHaveBeenCalledWith({
      pedido_id: 'pedido-1',
      remetente: 'cliente',
      conteudo: 'Mensagem de teste',
    });
  });

  it('propaga erro de insert', async () => {
    const insertError = { message: 'Conteúdo não pode ser vazio', code: '23514' };
    supabase.from.mockReturnValue(mockChain({ data: null, error: insertError }));

    const { error } = await enviarMensagem({ pedidoId: 'p1', remetente: 'cliente', conteudo: '' });

    expect(error.code).toBe('23514');
  });
});

// ─── subscribeToMensagens ─────────────────────────────────────────────────────
describe('subscribeToMensagens()', () => {
  it('cria channel com nome baseado no pedidoId', () => {
    const mockChannel = { on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() };
    supabase.channel.mockReturnValue(mockChannel);

    const channel = subscribeToMensagens('pedido-1', vi.fn());

    expect(supabase.channel).toHaveBeenCalledWith('chat-pedido-pedido-1');
    expect(channel).toBe(mockChannel);
  });

  it('chama onNewMessage ao receber nova mensagem via payload', () => {
    // Simula o comportamento do .on() ao chamar o callback manualmente
    let capturedCallback;
    const mockChannel = {
      on: vi.fn().mockImplementation((event, filter, callback) => {
        capturedCallback = callback;
        return mockChannel;
      }),
      subscribe: vi.fn().mockReturnThis(),
    };
    supabase.channel.mockReturnValue(mockChannel);

    const onNewMessage = vi.fn();
    subscribeToMensagens('pedido-1', onNewMessage);

    // Simula chegada de nova mensagem
    capturedCallback?.({ new: mockMensagem });

    expect(onNewMessage).toHaveBeenCalledWith(mockMensagem);
  });
});
