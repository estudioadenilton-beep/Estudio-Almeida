import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, Phone as PhoneIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/shared/SEO';
import { cadastroSchema } from '../utils/validation';

const Cadastro = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            full_name: data.nome,
            phone: data.telefone,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccessMessage('Cadastro concluído! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const onError = () => {
    // Tratamento de erro silencioso em produção
  };

  return (
    <>
      <SEO
        title="Cadastro | Estúdio Almeida"
        description="Crie sua conta para iniciar seus projetos sonoros de elite."
        canonical="/cadastro"
      />

      <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row overflow-hidden italic-accent font-body">

        {/* Left Visual Canvas */}
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-surface-container-lowest items-end p-20 border-r border-white/5">
          <div className="absolute inset-0 z-0 opacity-40">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              alt="Microfone"
              className="w-full h-full object-cover grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuiF-3iL6EiDNQchZAfvSoX20dfB5r8uPBXN1YTwnFUNq921DubZubdHK4PyRicZXI-bviC3tNzzBp9xjQ0zoOLgeDxWc2AC2VfZC4qZbVo7tjWpKKexoWVAxV3J5XwIoHeR7y1P3WydN65GlQfqeeG9-aVyeLRJBzec8P2e5-ip5xuo1vXd9nrBz_LP-gXvxq0PvNFMIMr98GG1cj9WGNmcCm4hvXP2iTYDRQBUveuTmIJBO0yHlOawNmz-Ofh9i7WRUYK9msJ5A"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          <div className="relative z-10 space-y-6">
            <span className="font-label text-xs tracking-[0.2em] text-primary uppercase font-bold">Elite Audio Production</span>
            <h1 className="font-headline text-4xl md:text-[3.5rem] leading-none tracking-tight text-white uppercase tracking-tighter font-bold">
              A voz da sua <br />
              <span className="italic text-primary">excelência.</span>
            </h1>
          </div>
        </section>

        {/* Right Content Canvas */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-24 bg-surface">
          <div className="w-full max-w-md space-y-12">

            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link to="/" className="inline-block hover:scale-105 transition-transform">
                <img alt="Logo" className="h-16 w-auto brightness-200 grayscale" src="/minha-logo.png" />
              </Link>
              <div className="space-y-1 text-center md:text-left">
                <h2 className="font-headline text-2xl text-white uppercase tracking-tighter font-bold">Crie sua conta</h2>
                <p className="font-body text-xs text-secondary opacity-60 uppercase tracking-widest">Inicie sua jornada criativa conosco.</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded flex items-center gap-3 text-error text-xs uppercase tracking-widest font-bold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-3 text-emerald-500 text-xs uppercase tracking-widest font-bold">
                <AlertCircle size={16} />
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
              <div className="space-y-6">

                {/* Nome */}
                <div className="relative border-b border-white/10 focus-within:border-primary transition-colors group">
                  <label className="block font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors font-bold">Nome Completo</label>
                  <div className="relative flex items-center mb-3">
                    <User className="absolute left-0 text-secondary w-4 h-4" />
                    <input
                      {...register('nome')}
                      className="w-full bg-transparent border-none p-0 pl-8 text-white focus:ring-0 font-body text-sm"
                      placeholder="Seu nome completo"
                      type="text"
                    />
                  </div>
                  {errors.nome && <span className="text-error text-[0.6rem] uppercase tracking-widest block mt-1">{errors.nome.message}</span>}
                </div>

                {/* Telefone */}
                <div className="relative border-b border-white/10 focus-within:border-primary transition-colors group">
                  <label className="block font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors font-bold">Telefone</label>
                  <div className="relative flex items-center mb-3">
                    <PhoneIcon className="absolute left-0 text-secondary w-4 h-4" />
                    <input
                      {...register('telefone')}
                      className="w-full bg-transparent border-none p-0 pl-8 text-white focus:ring-0 font-body text-sm"
                      placeholder="Ex: 11988887777"
                      type="tel"
                    />
                  </div>
                  {errors.telefone && <span className="text-error text-[0.6rem] uppercase tracking-widest block mt-1">{errors.telefone.message}</span>}
                </div>

                {/* Email */}
                <div className="relative border-b border-white/10 focus-within:border-primary transition-colors group">
                  <label className="block font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors font-bold">E-mail</label>
                  <div className="relative flex items-center mb-3">
                    <Mail className="absolute left-0 text-secondary w-4 h-4" />
                    <input
                      {...register('email')}
                      className="w-full bg-transparent border-none p-0 pl-8 text-white focus:ring-0 font-body text-sm"
                      placeholder="seu@email.com"
                      type="email"
                    />
                  </div>
                  {errors.email && <span className="text-error text-[0.6rem] uppercase tracking-widest block mt-1">{errors.email.message}</span>}
                </div>

                {/* Senha */}
                <div className="relative border-b border-white/10 focus-within:border-primary transition-colors group">
                  <label className="block font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors font-bold">Senha</label>
                  <div className="relative flex items-center mb-3">
                    <Lock className="absolute left-0 text-secondary w-4 h-4" />
                    <input
                      {...register('senha')}
                      className="w-full bg-transparent border-none p-0 pl-8 text-white focus:ring-0 font-body text-sm"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  {errors.senha && <span className="text-error text-[0.6rem] uppercase tracking-widest block mt-1">{errors.senha.message}</span>}
                </div>

                {/* Confirmação */}
                <div className="relative border-b border-white/10 focus-within:border-primary transition-colors group">
                  <label className="block font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors font-bold">Confirmar Senha</label>
                  <div className="relative flex items-center mb-3">
                    <Lock className="absolute left-0 text-secondary w-4 h-4" />
                    <input
                      {...register('confirmarSenha')}
                      className="w-full bg-transparent border-none p-0 pl-8 text-white focus:ring-0 font-body text-sm"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  {errors.confirmarSenha && <span className="text-error text-[0.6rem] uppercase tracking-widest block mt-1">{errors.confirmarSenha.message}</span>}
                </div>

              </div>

              <div className="pt-4 space-y-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs font-bold tracking-[0.15em] uppercase rounded shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale cursor-pointer"
                >
                  {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
                <div className="text-center">
                  <Link to="/login" className="font-label text-xs text-white hover:text-primary transition-all flex items-center justify-center gap-2 group uppercase tracking-widest font-bold">
                    Já tem uma conta? <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-primary" />
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Cadastro;
