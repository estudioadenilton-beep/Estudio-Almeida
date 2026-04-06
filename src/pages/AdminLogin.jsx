import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/shared/SEO';

/**
 * AdminLogin — Página de verificação de segundo fator para admin.
 * 
 * BUGS CORRIGIDOS:
 * 1. useAdminAuth() era chamado dentro de onClick handler → Violação de Regras de Hooks
 * 2. navigate() era chamado no corpo do render → Loop infinito potencial
 * 3. Secret comparada no browser → Agora enviada ao Edge Function server-side
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { verifyAdminSecret, isAdmin, verifying, error: authError } = useAdminAuth();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState(false);

  // FIX: navigate() movido para useEffect (antes causava loop infinito no render)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Se já é admin, redirecionar para o painel
  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    const success = await verifyAdminSecret(secret);
    if (success) {
      navigate('/admin');
    } else {
      setError(true);
      setSecret('');
    }
  };

  // FIX: logoutAdmin extraído do hook no nível do componente (antes era chamado dentro de onClick)
  const { revokeAdmin } = useAdminAuth();

  const handleBack = () => {
    revokeAdmin();
    navigate('/login');
  };

  if (authLoading) return <div className="min-h-screen bg-background border-t-2 border-primary" />;

  return (
    <>
      <SEO title="Bunker Admin | Estúdio Almeida" description="Acesso restrito ao painel administrativo do estúdio." />

      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center relative overflow-hidden font-body">
        {/* Camada de Fundo - Visual Bunker */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,202,80,0.08)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent shadow-[0_0_20px_rgba(242,202,80,0.5)] animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md px-6 text-center"
        >
          <div className="mb-12 space-y-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(242,202,80,0.1)] mx-auto">
                <ShieldCheck size={48} className="text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-3xl tracking-tighter text-white uppercase font-bold">Acesso Restrito</h1>
              <p className="text-secondary text-[0.65rem] uppercase tracking-[0.25em] opacity-60">Área Administrativa do Estúdio</p>
            </div>
          </div>

          <div className="bg-surface-container-low/60 backdrop-blur-3xl p-8 md:p-12 rounded-lg shadow-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="group">
                  <label className="font-label text-secondary text-[0.6rem] uppercase tracking-[0.2em] block mb-4 group-focus-within:text-primary transition-colors font-bold text-left px-1">Chave de Segurança Extra</label>
                  <div className={`relative border-b transition-all duration-500 ${error || authError ? 'border-error animate-shake' : 'border-white/10 group-focus-within:border-primary'}`}>
                    <Lock className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error || authError ? 'text-error' : 'text-secondary group-focus-within:text-primary'}`} />
                    <input 
                      type="password"
                      value={secret}
                      onChange={(e) => {
                        setSecret(e.target.value);
                        setError(false);
                      }}
                      autoFocus
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-none py-4 pl-8 text-white focus:ring-0 font-body text-sm tracking-[0.4em] placeholder:text-white/5 placeholder:tracking-normal"
                    />
                  </div>
                  {(error || authError) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-error text-[0.6rem] uppercase tracking-widest mt-4 flex items-center justify-center gap-2 font-bold"
                    >
                      <ShieldAlert size={12} /> {authError || 'Senha Incorreta. Acesso Negado.'}
                    </motion.div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={verifying}
                className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs font-bold tracking-[0.25em] uppercase rounded shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group flex items-center justify-center gap-3 overflow-hidden relative disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                {verifying ? 'VERIFICANDO...' : <>DESBLOQUEAR PAINEL <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleBack}
              className="text-secondary hover:text-white transition-all uppercase font-label text-[0.6rem] tracking-[0.2em] font-medium"
            >
              Voltar ao Login Comum
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
