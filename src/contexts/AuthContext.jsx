import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * AuthProvider — Gerenciamento centralizado de autenticação.
 * 
 * Fornece:
 * - user: objeto do usuário autenticado (null se não logado)
 * - session: sessão Supabase ativa
 * - isAdmin: boolean derivado de app_metadata.role
 * - loading: true durante verificação inicial
 * - signOut: encerrar sessão
 * - refreshSession: forçar refresh do JWT (necessário após verify-admin)
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.app_metadata?.role === 'admin';

  // Inicializar sessão e ouvir mudanças de auth
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  /**
   * Força refresh da sessão para obter JWT atualizado.
   * Chamado após verify-admin para que app_metadata.role
   * seja refletido no token.
   */
  const refreshSession = async () => {
    const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
    if (!error && newSession) {
      setSession(newSession);
      setUser(newSession.user);
    }
    return { error };
  };

  const value = {
    user,
    session,
    isAdmin,
    loading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir o AuthContext.
 * Lança erro se usado fora do AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
