import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute — Guard para rotas autenticadas.
 * 
 * ANTES: Cada instância fazia sua própria chamada a supabase.auth.getUser()
 * DEPOIS: Consome o AuthContext centralizado (uma única subscription)
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary uppercase font-label text-xs tracking-widest animate-pulse">
          Verificando acesso...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
