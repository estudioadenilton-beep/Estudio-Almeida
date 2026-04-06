import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * useAdminAuth — Hook de autenticação admin via Edge Functions.
 * 
 * ANTES: Secret comparada no browser, sessão em localStorage.
 * DEPOIS: Secret enviada ao servidor, validada server-side,
 *         role gravada em app_metadata do JWT.
 */
export const useAdminAuth = () => {
  const { user, isAdmin, loading, refreshSession, signOut } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Envia a secret para o Edge Function verify-admin.
   * Se válida, o servidor atualiza app_metadata.role = 'admin'.
   * Depois fazemos refresh da sessão para obter o JWT atualizado.
   */
  const verifyAdminSecret = async (secret) => {
    setError(null);
    setVerifying(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Sessão expirada. Faça login novamente.');
        setVerifying(false);
        return false;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ secret }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Falha na verificação');
        setVerifying(false);
        return false;
      }

      // Refresh para obter JWT com app_metadata.role = 'admin'
      const { error: refreshError } = await refreshSession();
      if (refreshError) {
        setError('Acesso concedido, mas falha ao atualizar sessão. Recarregue a página.');
        setVerifying(false);
        return false;
      }

      setVerifying(false);
      return true;
    } catch {
      setError('Erro de conexão com o servidor.');
      setVerifying(false);
      return false;
    }
  };

  /**
   * Revoga o acesso admin via Edge Function revoke-admin.
   * Remove app_metadata.role e faz signOut completo.
   */
  const revokeAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/revoke-admin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );
      }
    } catch {
      // Se falhar revoke, signOut garante que o usuário perde acesso local
    }
    await signOut();
  };

  return {
    user,
    isAdmin,
    loading,
    verifying,
    error,
    verifyAdminSecret,
    revokeAdmin,
  };
};
