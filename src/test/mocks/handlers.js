/**
 * src/test/mocks/handlers.js
 * Handlers do MSW (Mock Service Worker) para interceptar chamadas de rede.
 *
 * Cobre:
 * - Supabase REST API (queries ao banco)
 * - Edge Functions (verify-admin, revoke-admin)
 * - APIs externas
 */

import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://test.supabase.co';

// ─── Dados de fixtures ──────────────────────────────────────────────────────
export const fixtures = {
  pedido: {
    id: 'pedido-uuid-001',
    cliente_id: 'user-uuid-001',
    titulo: 'Logo para empresa',
    descricao: 'Preciso de uma logo moderna',
    status: 'aguardando',
    oculto_pelo_cliente: false,
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  pedidoEmProducao: {
    id: 'pedido-uuid-002',
    cliente_id: 'user-uuid-001',
    titulo: 'Banner para redes sociais',
    status: 'em produção',
    oculto_pelo_cliente: false,
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z',
  },
  pedidoConcluido: {
    id: 'pedido-uuid-003',
    cliente_id: 'user-uuid-001',
    titulo: 'Cartão de visita',
    status: 'concluído',
    oculto_pelo_cliente: false,
    created_at: '2026-01-03T10:00:00Z',
    updated_at: '2026-01-03T10:00:00Z',
  },
  mensagem: {
    id: 'msg-uuid-001',
    pedido_id: 'pedido-uuid-001',
    remetente: 'cliente',
    conteudo: 'Olá, qual o prazo?',
    created_at: '2026-01-01T11:00:00Z',
  },
  user: {
    id: 'user-uuid-001',
    email: 'cliente@test.com',
    app_metadata: { role: null },
    user_metadata: { name: 'Cliente Teste' },
  },
  adminUser: {
    id: 'admin-uuid-001',
    email: 'admin@estudio.com',
    app_metadata: { role: 'admin' },
    user_metadata: {},
  },
};

// ─── Handlers MSW ────────────────────────────────────────────────────────────
export const handlers = [

  // Supabase: GET pedidos
  http.get(`${SUPABASE_URL}/rest/v1/pedidos`, () => {
    return HttpResponse.json([
      fixtures.pedido,
      fixtures.pedidoEmProducao,
      fixtures.pedidoConcluido,
    ]);
  }),

  // Supabase: GET pedido por ID
  http.get(`${SUPABASE_URL}/rest/v1/pedidos/:id`, ({ params }) => {
    const pedido = [fixtures.pedido, fixtures.pedidoEmProducao, fixtures.pedidoConcluido]
      .find(p => p.id === params.id);

    if (!pedido) {
      return HttpResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });
    }
    return HttpResponse.json(pedido);
  }),

  // Supabase: GET mensagens
  http.get(`${SUPABASE_URL}/rest/v1/mensagens`, () => {
    return HttpResponse.json([fixtures.mensagem]);
  }),

  // Supabase: POST mensagens
  http.post(`${SUPABASE_URL}/rest/v1/mensagens`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...fixtures.mensagem, ...body, id: 'msg-uuid-new' }, { status: 201 });
  }),

  // Edge Function: verify-admin (sucesso)
  http.post(`${SUPABASE_URL}/functions/v1/verify-admin`, async ({ request }) => {
    const body = await request.json();
    if (body.secret === 'secret-correta') {
      return HttpResponse.json({ message: 'Admin verified' });
    }
    return HttpResponse.json({ error: 'Secret inválida' }, { status: 401 });
  }),

  // Edge Function: revoke-admin
  http.post(`${SUPABASE_URL}/functions/v1/revoke-admin`, () => {
    return HttpResponse.json({ message: 'Admin access revoked' });
  }),

  // Supabase Auth: sign in
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'cliente@test.com' && body.password === 'senha123') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        user: fixtures.user,
      });
    }
    return HttpResponse.json(
      { error: 'Invalid login credentials' },
      { status: 400 }
    );
  }),
];
