/**
 * src/__tests__/hooks/useAdminAuth.test.jsx
 * Testes de integração do hook useAdminAuth.
 *
 * Testa:
 * - verifyAdminSecret com secret correta e incorreta
 * - revokeAdmin com e sem sessão ativa
 * - Estados de loading e erro
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// ─── Mocks ───────────────────────────────────────────────────────────────────
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-token-valid',
            user: { id: 'user-1', email: 'user@test.com', app_metadata: {} },
          },
        },
        error: null,
      }),
    },
  },
}));

// Mock do AuthContext para controlar os valores retornados
const mockRefreshSession = vi.fn().mockResolvedValue({ error: null });
const mockSignOut = vi.fn().mockResolvedValue(undefined);

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-1', email: 'user@test.com', app_metadata: {} },
    isAdmin: false,
    loading: false,
    refreshSession: mockRefreshSession,
    signOut: mockSignOut,
  })),
}));

import { useAdminAuth } from '@/hooks/useAdminAuth';

// Wrapper mínimo para o hook que usa useAuth internamente
const wrapper = ({ children }) => <>{children}</>;

beforeEach(() => {
  vi.clearAllMocks();
  // Reseta fetch global antes de cada teste
  global.fetch = vi.fn();
});

// ─── verifyAdminSecret ────────────────────────────────────────────────────────
describe('verifyAdminSecret()', () => {
  it('retorna true quando a secret é válida e refresh de sessão funciona', async () => {
    // Simula Edge Function respondendo com sucesso
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Admin verified' }),
    });

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.verifyAdminSecret('secret-correta');
    });

    expect(success).toBe(true);
    expect(mockRefreshSession).toHaveBeenCalledOnce();
    expect(result.current.error).toBeNull();
  });

  it('retorna false e seta error quando a secret é inválida', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Secret inválida' }),
    });

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.verifyAdminSecret('secret-errada');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Secret inválida');
    expect(mockRefreshSession).not.toHaveBeenCalled();
  });

  it('retorna false e seta erro de conexão quando fetch lança exceção', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.verifyAdminSecret('qualquer-secret');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Erro de conexão com o servidor.');
  });

  it('seta verifying=true durante a requisição e false após', async () => {
    let resolvePromise;
    global.fetch = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = () =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'ok' }),
          });
      })
    );

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    // Inicia sem resolver
    act(() => {
      result.current.verifyAdminSecret('secret');
    });

    expect(result.current.verifying).toBe(true);

    // Resolve a promessa
    await act(async () => {
      resolvePromise();
    });

    expect(result.current.verifying).toBe(false);
  });

  it('seta erro quando session está ausente', async () => {
    const { supabase } = await import('@/lib/supabase');
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.verifyAdminSecret('qualquer');
    });

    expect(success).toBe(false);
    expect(result.current.error).toContain('Sessão expirada');
  });
});

// ─── revokeAdmin ──────────────────────────────────────────────────────────────
describe('revokeAdmin()', () => {
  it('chama revoke-admin e depois signOut', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Revoked' }),
    });

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    await act(async () => {
      await result.current.revokeAdmin();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('revoke-admin'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it('ainda chama signOut mesmo se revoke falhar', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    await act(async () => {
      await result.current.revokeAdmin();
    });

    // signOut deve ser chamado independentemente da falha do fetch
    expect(mockSignOut).toHaveBeenCalledOnce();
  });
});
