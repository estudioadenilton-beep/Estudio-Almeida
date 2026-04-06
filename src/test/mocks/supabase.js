/**
 * src/test/mocks/supabase.js
 * Mock centralizado do cliente Supabase.
 *
 * Estratégia: vi.mock() é içado ao topo do módulo pelo Vitest.
 * Todos os testes que importam '../lib/supabase' receberão este mock.
 *
 * Uso em testes:
 * ```js
 * import { supabase } from '@/lib/supabase';
 * supabase.from.mockReturnValueOnce({ ... });
 * ```
 */

import { vi } from 'vitest';

// ─── Builder de resposta ──────────────────────────────────────────────────────
// Fábrica que cria a cadeia fluente do Supabase (from().select().eq()...)
const createQueryBuilder = (overrides = {}) => {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    // Resolve padrão para a maioria dos queries
    then: undefined,
    ...overrides,
  };

  // Faz o builder ser thenable (Promise-like) para await funcionar
  Object.defineProperty(builder, 'then', {
    get() {
      return Promise.resolve({ data: [], error: null }).then.bind(
        Promise.resolve({ data: [], error: null })
      );
    },
  });

  return builder;
};

// ─── Mock do canal Realtime ───────────────────────────────────────────────────
const createChannelMock = () => ({
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
  unsubscribe: vi.fn().mockResolvedValue('ok'),
});

// ─── Mock principal do Supabase ───────────────────────────────────────────────
export const supabaseMock = {
  from: vi.fn(() => createQueryBuilder()),
  channel: vi.fn(() => createChannelMock()),
  removeChannel: vi.fn().mockResolvedValue('ok'),

  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    refreshSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({
      data: {},
      error: null,
    }),
    updateUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },

  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://storage.test/file.jpg' } })),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      list: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
};

// ─── Helper para simular sucesso/erro nos testes ─────────────────────────────
/**
 * Configura o mock do supabase.from() para retornar dados específicos.
 * @param {object} data - Dados a retornar
 * @param {object|null} error - Erro a retornar (null = sucesso)
 */
export const mockSupabaseFrom = (data, error = null) => {
  supabaseMock.from.mockReturnValueOnce({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: Array.isArray(data) ? data[0] : data, error }),
    then: undefined,
    ...{
      get then() {
        return Promise.resolve({ data, error }).then.bind(
          Promise.resolve({ data, error })
        );
      },
    },
  });
};
