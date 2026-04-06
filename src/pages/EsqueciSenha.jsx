import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/shared/SEO';

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

const EsqueciSenha = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/redefinir-senha`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.');
    }
  };

  return (
    <>
      <SEO 
        title="Recuperar Senha | Estúdio Almeida" 
        description="Recupere o acesso à sua conta do Estúdio Almeida."
        canonical="/esqueci-senha"
      />

      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center relative overflow-hidden font-body">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,202,80,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md px-6"
        >
          <div className="mb-12 text-center">
            <img alt="Logo" className="h-16 w-auto mx-auto mb-8 brightness-200 grayscale" src="/minha-logo.png" />
            <h2 className="font-headline text-2xl tracking-tighter text-white uppercase font-bold">Recuperar Acesso</h2>
            <p className="text-secondary text-xs uppercase tracking-widest mt-2 opacity-60">Enviaremos as instruções por e-mail</p>
          </div>

          <div className="bg-surface-container-lowest/40 backdrop-blur-xl p-8 md:p-12 rounded-lg shadow-2xl border border-white/5">
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-headline text-white text-lg uppercase tracking-tight">Vá para seu E-mail</h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      Um link de recuperação foi enviado para seu e-mail. Verifique sua caixa de entrada.
                    </p>
                  </div>
                  <Link to="/login" className="block w-full py-4 bg-primary text-on-primary font-label text-xs font-bold tracking-widest uppercase rounded hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">
                    Voltar para o Login
                  </Link>
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

                <div className="group">
                  <label className="font-label text-secondary text-[0.625rem] uppercase tracking-widest block mb-2 group-focus-within:text-primary transition-colors font-bold font-label">Seu E-mail Cadastrado</label>
                  <div className="relative border-b border-white/10 group-focus-within:border-primary transition-colors">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                    <input 
                      {...register('email')} 
                      className="w-full bg-transparent border-none py-3 pl-8 text-white focus:ring-0 font-body text-sm" 
                      placeholder="seu@email.com" 
                      type="email" 
                    />
                  </div>
                  {errors.email && <span className="text-error text-[0.6rem] uppercase tracking-widest mt-1 block font-label">{errors.email.message}</span>}
                </div>

                <div className="space-y-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs font-bold tracking-[0.2em] rounded uppercase transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? 'ENVIANDO...' : <>ENVIAR LINK DE RECUPERAÇÃO <Send size={14} /></>}
                  </button>
                  
                  <Link to="/login" className="flex items-center justify-center gap-2 text-secondary hover:text-white transition-colors uppercase font-label text-[0.6rem] tracking-[0.2em] font-bold">
                    <ArrowLeft size={14} /> Cancelar e Voltar
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EsqueciSenha;
