import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import SEO from '../components/shared/SEO';

const NotFound = () => {
  return (
    <>
      <SEO title="404 - Página não encontrada | Estúdio Almeida" />
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-6 relative overflow-hidden font-body">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,202,80,0.05)_0%,transparent_60%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-lg"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-surface-container-high border border-white/5 shadow-2xl rounded-2xl flex items-center justify-center text-primary/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              <Search size={32} />
            </div>
          </div>
          
          <h1 className="font-headline text-6xl md:text-8xl text-white tracking-tighter uppercase font-bold mb-4 drop-shadow-[0_0_15px_rgba(242,202,80,0.2)]">
            404
          </h1>
          
          <p className="text-primary font-label text-xs uppercase tracking-[0.2em] font-bold mb-8 italic">
            Frequência não encontrada
          </p>
          
          <p className="text-secondary/70 text-sm leading-relaxed mb-12 uppercase tracking-widest max-w-md mx-auto">
            A página que você está procurando foi movida, removida, renomeada ou possivelmente nunca existiu.
          </p>
          
          <Link 
            to="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded font-label text-[0.65rem] font-bold tracking-widest uppercase shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ArrowLeft size={16} /> Voltar para a Home
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
