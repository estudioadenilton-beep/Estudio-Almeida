import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/shared/SEO';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const RedefinirSenha = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Ocorreu um erro ao tentar redefinir a senha. Tente novamente.');
    }
  };

  return (
    <>
      <SEO 
        title="Redefinir Senha | Estúdio Almeida" 
        description="Crie uma nova senha para sua conta."
        canonical="/redefinir-senha"
      />

      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center relative overflow-hidden font-body">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,202,80,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md px-6"
        >
          <div className="mb-12 text-center text-white">
            <img alt="Logo" className="h-16 w-auto mx-auto mb-8 brightness-200 grayscale" src="/minha-logo.png" />
            <h2 className="font-headline text-3xl tracking-tighter uppercase font-bold">Nova Senha</h2>
            <p className="text-secondary text-[0.65rem] uppercase tracking-[0.2em] mt-2 opacity-60">Segurança em primeiro lugar</p>
          </div>

          <div className="bg-surface-container-lowest/40 backdrop-blur-xl p-8 md:p-12 rounded-lg shadow-2xl border border-white/5">
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline text-white text-lg uppercase tracking-tight">Senha Redefinida!</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    Sua nova senha foi salva com sucesso. Redirecionando para o login...
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {error && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded flex items-center gap-3 text-error text-[0.65rem] uppercase tracking-widest font-bold font-label">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="group">
                    <label className="font-label text-secondary text-[0.625rem] uppercase tracking-widest block mb-2 group-focus-within:text-primary transition-colors font-bold">Nova Senha</label>
                    <div className="relative border-b border-white/10 group-focus-within:border-primary transition-colors">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                      <input 
                        {...register('password')} 
                        className="w-full bg-transparent border-none py-3 pl-8 text-white focus:ring-0 font-body text-sm" 
                        placeholder="••••••••" 
                        type="password" 
                      />
                    </div>
                    {errors.password && <span className="text-error text-[0.6rem] uppercase tracking-widest mt-1 block">{errors.password.message}</span>}
                  </div>

                  <div className="group">
                    <label className="font-label text-secondary text-[0.625rem] uppercase tracking-widest block mb-2 group-focus-within:text-primary transition-colors font-bold">Confirmar Nova Senha</label>
                    <div className="relative border-b border-white/10 group-focus-within:border-primary transition-colors">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                      <input 
                        {...register('confirmPassword')} 
                        className="w-full bg-transparent border-none py-3 pl-8 text-white focus:ring-0 font-body text-sm" 
                        placeholder="••••••••" 
                        type="password" 
                      />
                    </div>
                    {errors.confirmPassword && <span className="text-error text-[0.6rem] uppercase tracking-widest mt-1 block">{errors.confirmPassword.message}</span>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs font-bold tracking-[0.15em] uppercase rounded shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? 'SALVANDO...' : <>REDEFINIR SENHA <ArrowRight size={14} /></>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RedefinirSenha;
