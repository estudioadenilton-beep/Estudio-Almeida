/**
 * src/__tests__/contexts/AuthContext.test.jsx
 * Testes de integração do AuthContext.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// O Vitest mocka o módulo pelo caminho resolvido.
// Como AuthContext.jsx importa '../../lib/supabase' (relativo),
// usamos o alias '@/lib/supabase' que aponta para o mesmo arquivo.
vi.mock('@/lib/supabase', () => {
  const mockOnAuthStateChange = vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  }));
  const mockGetSession = vi.fn().mockResolvedValue({
    data: { session: null },
    error: null,
  });
  const mockSignOut = vi.fn().mockResolvedValue({ error: null });
  const mockRefreshSession = vi.fn().mockResolvedValue({
    data: { session: null },
    error: null,
  });

  return {
    supabase: {
      auth: {
        getSession: mockGetSession,
        signOut: mockSignOut,
        refreshSession: mockRefreshSession,
        onAuthStateChange: mockOnAuthStateChange,
      },
    },
  };
});

// Importar DEPOIS do vi.mock
import { supabase } from '@/lib/supabase';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// ─── Wrapper com Provider ─────────────────────────────────────────────────────
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

// ─── Setup antes de cada teste ────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();

  supabase.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });

  supabase.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });

  supabase.auth.signOut.mockResolvedValue({ error: null });
});

// ─── Testes ───────────────────────────────────────────────────────────────────
describe('AuthContext', () => {
  describe('Estado inicial', () => {
    it('seta loading=false e user=null quando não há sessão', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await new Promise(r => setTimeout(r, 10));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('Com sessão ativa', () => {
    const mockUser = {
      id: 'user-1',
      email: 'user@test.com',
      app_metadata: { role: null },
    };
    const mockSession = { user: mockUser, access_token: 'token-123' };

    beforeEach(() => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
    });

    it('popula user ao carregar sessão existente', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await new Promise(r => setTimeout(r, 10));
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
    });

    it('isAdmin é false quando role não é admin', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await new Promise(r => setTimeout(r, 10));
      });

      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('isAdmin é true quando app_metadata.role === "admin"', async () => {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@estudio.com',
        app_metadata: { role: 'admin' },
      };
      supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: adminUser, access_token: 'admin-token' } },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await new Promise(r => setTimeout(r, 10));
      });

      expect(result.current.isAdmin).toBe(true);
    });
  });

  describe('signOut()', () => {
    it('limpa user e session após signOut', async () => {
      const mockUser = { id: 'user-1', email: 'user@test.com', app_metadata: {} };
      supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser, access_token: 'token' } },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await new Promise(r => setTimeout(r, 10));
      });

      expect(result.current.user).toEqual(mockUser);

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalledOnce();
    });
  });

  describe('useAuth() fora do Provider', () => {
    it('lança erro descritivo quando usado sem AuthProvider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() =>
        renderHook(() => useAuth())
      ).toThrow('useAuth deve ser usado dentro de um AuthProvider');

      consoleError.mockRestore();
    });
  });

  describe('onAuthStateChange', () => {
    it('atualiza user quando evento de auth muda', async () => {
      let authCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await new Promise(r => setTimeout(r, 10));
      });

      const newUser = { id: 'user-2', email: 'novo@test.com', app_metadata: {} };
      await act(async () => {
        authCallback('SIGNED_IN', { user: newUser, access_token: 'new-token' });
      });

      expect(result.current.user).toEqual(newUser);
    });
  });
});
