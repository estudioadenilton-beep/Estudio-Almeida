import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminProtectedRoute — Guard para rotas de admin.
 * 
 * ANTES: Verificava localStorage('admin_secret_session') — manipulável.
 * DEPOIS: Verifica app_metadata.role === 'admin' no JWT do Supabase.
 *         Impossível de forjar sem acesso ao service_role key do servidor.
 */
const AdminProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary uppercase font-label text-xs tracking-widest animate-pulse">
          Verificando acesso administrativo...
        </div>
      </div>
    );
  }

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado mas não for admin, redireciona para admin-login
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
