import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Mic2,
  Eye,
  EyeOff,
  ChevronRight,
  LogOut,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import { useAuth } from '../contexts/AuthContext';
import { fetchClientePedidos, ocultarPedido, subscribeToPedidos, unsubscribeChannel } from '../services/pedidos';
import { getStatusColor, formatDateBR } from '../utils/status';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // Substitui alert()

  // Fetch inicial de pedidos
  useEffect(() => {
    if (!user) return;

    const loadPedidos = async () => {
      setLoading(true);
      const { data, error } = await fetchClientePedidos(user.id);
      if (!error && data) {
        setPedidos(data);
      }
      setLoading(false);
    };

    loadPedidos();

    // Realtime subscription com merge incremental (antes fazia re-fetch total)
    const channel = subscribeToPedidos(
      user.id,
      (newPedido) => {
        if (!newPedido.oculto_pelo_cliente) {
          setPedidos(prev => {
            if (prev.some(p => p.id === newPedido.id)) return prev;
            return [newPedido, ...prev];
          });
        }
      },
      (updatedPedido) => {
        setPedidos(prev =>
          prev.map(p => p.id === updatedPedido.id ? updatedPedido : p)
            .filter(p => !p.oculto_pelo_cliente)
        );
      },
      (deletedPedido) => {
        setPedidos(prev => prev.filter(p => p.id !== deletedPedido.id));
      }
    );

    return () => unsubscribeChannel(channel);
  }, [user]);

  const handleOcultar = async (pedidoId) => {
    // Substituição de window.confirm() por estado de feedback
    const { error } = await ocultarPedido(pedidoId);
    if (!error) {
      setPedidos(prev => prev.filter(p => p.id !== pedidoId));
      setFeedback({ type: 'success', message: 'Pedido ocultado com sucesso.' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: 'Erro ao ocultar pedido.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <SEO title="Dashboard | Estúdio Almeida" description="Gerencie seus pedidos de produção sonora." />

      <div className="min-h-screen bg-background text-on-surface flex flex-col font-body">
        {/* Header */}
        <header className="border-b border-white/5 bg-surface-container-low px-6 md:px-12 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/">
                <img src="/minha-logo.png" alt="Logo" className="h-8 w-auto brightness-200 grayscale" />
              </Link>
              <div className="h-6 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 text-primary font-headline text-lg uppercase tracking-tighter italic">
                <Mic2 size={18} /> Painel do Cliente
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-[0.6rem] font-label text-secondary uppercase tracking-[0.2em] font-bold hidden lg:block">
                {user?.email}
              </span>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2.5 rounded text-[0.6rem] font-bold uppercase tracking-wider transition-all"
                >
                  <ShieldCheck size={14} /> <span className="hidden md:inline">Painel Admin</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 font-label text-[0.65rem] text-white hover:text-error transition-colors uppercase tracking-widest font-bold"
              >
                <span className="hidden sm:inline">SAIR</span> <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl font-label text-xs font-bold uppercase tracking-widest ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-grow p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl text-white uppercase tracking-tighter">Suas Produções</h2>
                <p className="font-body text-sm text-secondary opacity-60 mt-2">Acompanhe seus pedidos sonoros em tempo real.</p>
              </div>
              <Link
                to="/novo-pedido"
                className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded font-label text-xs font-bold tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <PlusCircle size={18} /> Novo Pedido
              </Link>
            </header>

            {loading ? (
              <div className="py-32 text-center text-secondary uppercase tracking-widest text-xs animate-pulse font-label">
                Carregando produções...
              </div>
            ) : pedidos.length === 0 ? (
              <div className="py-32 text-center flex flex-col items-center gap-6">
                <Mic2 className="text-primary/20 w-20 h-20" />
                <p className="text-secondary uppercase tracking-widest text-xs opacity-50 font-bold font-label italic">
                  Nenhuma produção ativa.
                </p>
                <Link
                  to="/novo-pedido"
                  className="border border-primary text-primary px-8 py-3 text-[0.65rem] font-label font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                >
                  Criar Primeiro Pedido
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                  {pedidos.map((pedido) => (
                    <motion.div
                      key={pedido.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-surface-container-low rounded-lg border border-white/5 overflow-hidden group hover:border-primary/20 transition-all shadow-lg bento-card"
                    >
                      <div className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-headline text-xl text-white uppercase tracking-tight group-hover:text-primary transition-colors italic">
                              {pedido.servico}
                            </h3>
                            <p className="text-secondary text-[0.6rem] uppercase tracking-widest mt-1 opacity-60">
                              {pedido.titulo || 'Sem Título'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[0.55rem] font-bold uppercase tracking-widest border ${getStatusColor(pedido.status)}`}>
                            {pedido.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-secondary/40 text-[0.6rem] uppercase tracking-widest">
                          <Clock size={12} />
                          {formatDateBR(pedido.created_at)}
                        </div>
                      </div>

                      <div className="border-t border-white/5 flex">
                        <Link
                          to={`/pedido/${pedido.id}`}
                          className="flex-1 py-4 text-center text-[0.6rem] font-label text-secondary hover:text-primary font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          Ver Detalhes <ChevronRight size={12} />
                        </Link>
                        <div className="w-px bg-white/5" />
                        <button
                          onClick={() => handleOcultar(pedido.id)}
                          className="px-6 py-4 text-secondary hover:text-error transition-colors"
                          title="Ocultar pedido"
                        >
                          <EyeOff size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>

        <footer className="p-8 text-center border-t border-white/5 bg-surface-container-low opacity-30 mt-auto">
          <p className="text-[0.6rem] text-secondary uppercase tracking-[0.4em] font-bold font-label">ESTÚDIO ALMEIDA • PAINEL DO CLIENTE</p>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
