import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AudioLines, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/shared/SEO';
import { loginSchema } from '../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.senha,
      });

      if (error) {
        setAuthError(error.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos.' 
          : error.message);
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setAuthError('Ocorreu um erro ao tentar entrar. Tente novamente.');
    }
  };

  return (
    <>
      <SEO 
        title="Login | Estúdio Almeida" 
        description="Acesse sua conta para gerenciar seus projetos sonoros."
        canonical="/login"
      />

      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_30%,rgba(242,202,80,0.03)_0%,transparent_50%)] pointer-events-none" />
        
        <main className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 py-12">
          
          {/* Brand Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col flex-1 text-left space-y-8"
          >
            <div className="space-y-4">
              <span className="font-label text-primary tracking-[0.2em] text-[0.6875rem] uppercase font-bold">The Auditory Gallery</span>
              <h1 className="font-headline text-5xl xl:text-7xl leading-tight font-bold tracking-tight text-white uppercase tracking-tighter">
                Refined <br />
                <span className="italic text-primary">Voice-Over</span> <br />
                Excellence.
              </h1>
            </div>
            <div className="pt-8 border-t border-white/10 max-w-xs">
              <div className="flex items-center gap-4 text-primary">
                <AudioLines size={32} />
                <span className="font-headline italic text-lg text-white">Sound Design Excellence</span>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="mb-12 text-center">
              <Link to="/" className="inline-block hover:scale-105 transition-transform">
                <img alt="Logo" className="h-16 w-auto mx-auto mb-6 brightness-200 grayscale" src="/minha-logo.png" />
              </Link>
              <h2 className="font-headline text-2xl tracking-tight text-white uppercase tracking-tighter">Portal do Cliente</h2>
              <div className="h-px w-12 bg-primary/40 mx-auto mt-4" />
            </div>

            <div className="w-full bg-surface-container-lowest/40 backdrop-blur-xl p-8 md:p-12 rounded-lg shadow-2xl border border-white/5">
              
              {authError && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded flex items-center gap-3 text-error text-xs uppercase tracking-widest font-bold">
                  <AlertCircle size={16} />
                  {authError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="group">
                  <label className="font-label text-secondary text-[0.6875rem] uppercase tracking-widest block mb-2 group-focus-within:text-primary transition-colors font-bold">E-mail</label>
                  <div className="relative border-b border-white/10 group-focus-within:border-primary transition-colors">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                    <input {...register('email')} className="w-full bg-transparent border-none py-3 pl-8 text-white focus:ring-0 font-body text-sm" placeholder="seu@email.com" type="email" />
                  </div>
                  {errors.email && <span className="text-error text-[0.6rem] uppercase tracking-widest mt-1 block">{errors.email.message}</span>}
                </div>

                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <label className="font-label text-secondary text-[0.6875rem] uppercase tracking-widest block group-focus-within:text-primary transition-colors font-bold">Senha</label>
                    <Link to="/esqueci-senha" className="text-secondary hover:text-primary transition-colors font-label text-[0.6rem] uppercase tracking-widest opacity-60 hover:opacity-100 font-bold">Esqueci minha senha</Link>
                  </div>
                  <div className="relative border-b border-white/10 group-focus-within:border-primary transition-colors">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                    <input {...register('senha')} className="w-full bg-transparent border-none py-3 pl-8 text-white focus:ring-0 font-body text-sm" placeholder="••••••••" type="password" />
                  </div>
                  {errors.senha && <span className="text-error text-[0.6rem] uppercase tracking-widest mt-1 block">{errors.senha.message}</span>}
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs font-bold tracking-[0.2em] rounded uppercase transition-all hover:scale-[1.02] disabled:opacity-50">
                  {isSubmitting ? 'Autenticando...' : 'Entrar na Plataforma'}
                </button>
              </form>

              <div className="mt-12 text-center border-t border-white/5 pt-8">
                <p className="font-body text-[0.65rem] text-secondary mb-3 uppercase tracking-widest opacity-60">Novo por aqui?</p>
                <Link to="/cadastro" className="inline-flex items-center gap-2 font-label text-white text-[0.7rem] uppercase tracking-widest border-b border-primary/40 pb-1 hover:border-primary transition-all font-bold">
                  Criar conta <ArrowRight size={14} className="text-primary" />
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Login;
