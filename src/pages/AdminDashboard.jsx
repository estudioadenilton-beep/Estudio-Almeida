import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  Users,
  ExternalLink,
  LogOut,
  Mic2,
  Trash2,
  ShieldAlert,
  X,
  ClipboardList
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { fetchAllPedidos, deleteAllPedidos, calcularStats } from '../services/pedidos';
import { getStatusColor, formatDateBR } from '../utils/status';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { revokeAdmin } = useAdminAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, aguardando: 0, producao: 0, concluido: 0 });

  // Estados do Modal Nuclear
  const [showNuclearModal, setShowNuclearModal] = useState(false);
  const [nuclearConfirmText, setNuclearConfirmText] = useState('');
  const [isCleaning, setIsCleaning] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const { data, error } = await fetchAllPedidos();
      if (!error && data) {
        setPedidos(data);
        setStats(calcularStats(data));
      }
      setLoading(false);
    };
    loadOrders();
  }, []);

  /**
   * Operação Nuclear - REFATORADO:
   * ANTES: Validava VITE_ADMIN_SECRET no browser (bypassável).
   * DEPOIS: A proteção é garantida pelo RLS do Supabase (app_metadata.role = 'admin').
   *         A confirmação agora é textual ("DELETAR TUDO") ao invés de uma senha exposta.
   */
  const handleNuclearClean = async () => {
    if (nuclearConfirmText !== 'DELETAR TUDO') return;

    setIsCleaning(true);
    const { error } = await deleteAllPedidos();

    if (error) {
      setFeedback({ type: 'error', message: 'Erro crítico: ' + error.message });
    } else {
      setPedidos([]);
      setStats({ total: 0, aguardando: 0, producao: 0, concluido: 0 });
      setShowNuclearModal(false);
      setNuclearConfirmText('');
      setFeedback({ type: 'success', message: 'Todos os pedidos foram removidos.' });
    }
    setIsCleaning(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogout = async () => {
    await revokeAdmin();
    navigate('/login');
  };

  return (
    <>
      <SEO title="Admin | Estúdio Almeida" description="Gestão de pedidos e produções sonoras." />

      <div className="min-h-screen bg-background text-on-surface flex flex-col font-body relative">
        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-[60] px-6 py-4 rounded-lg shadow-2xl font-label text-xs font-bold uppercase tracking-widest ${
                feedback.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Header */}
        <header className="border-b border-white/5 bg-surface-container-low px-6 md:px-12 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <img src="/minha-logo.png" alt="Logo" className="h-8 w-auto brightness-200 grayscale" />
              <div className="h-6 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 text-primary font-headline text-lg uppercase tracking-tighter italic">
                <Mic2 size={18} /> Bunker Administrativo
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 bg-yellow-700 hover:bg-yellow-800 text-white rounded transition-all text-[0.65rem] font-bold uppercase tracking-wider shadow-lg shadow-yellow-900/20"
              >
                <ClipboardList size={14} />
                <span className="hidden md:inline">Fazer Novo Pedido</span>
              </Link>

              <span className="text-[0.6rem] font-label text-secondary uppercase tracking-[0.2em] font-bold hidden lg:block">Acesso Mestre</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 font-label text-[0.65rem] text-white hover:text-error transition-colors uppercase tracking-widest font-bold"
              >
                <span className="hidden sm:inline">ENCERRAR SESSÃO</span> <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-12">

            {/* Upper Actions */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl text-white uppercase tracking-tighter">Gerenciar Estúdio</h2>
                <p className="font-body text-sm text-secondary opacity-60">Visão consolidada de todas as produções em andamento.</p>
              </div>
            </header>

            {/* Admin Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-high p-6 rounded border border-white/5 bento-card">
                <div className="flex justify-between items-start mb-4">
                  <Users className="text-secondary w-6 h-6" />
                  <span className="text-white font-headline text-2xl">{stats.total}</span>
                </div>
                <p className="text-[0.6rem] font-label text-secondary uppercase tracking-widest font-bold">Total Pedidos</p>
              </div>
              <div className="bg-surface-container-high p-6 rounded border border-white/5 bento-card">
                <div className="flex justify-between items-start mb-4">
                  <Clock className="text-amber-500 w-6 h-6" />
                  <span className="text-amber-500 font-headline text-2xl">{stats.aguardando}</span>
                </div>
                <p className="text-[0.6rem] font-label text-secondary uppercase tracking-widest font-bold">Aguardando</p>
              </div>
              <div className="bg-surface-container-high p-6 rounded border border-white/5 bento-card">
                <div className="flex justify-between items-start mb-4">
                  <BarChart3 className="text-blue-500 w-6 h-6" />
                  <span className="text-blue-500 font-headline text-2xl">{stats.producao}</span>
                </div>
                <p className="text-[0.6rem] font-label text-secondary uppercase tracking-widest font-bold">Em Produção</p>
              </div>
              <div className="bg-surface-container-high p-6 rounded border border-white/5 bento-card">
                <div className="flex justify-between items-start mb-4">
                  <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                  <span className="text-emerald-500 font-headline text-2xl">{stats.concluido}</span>
                </div>
                <p className="text-[0.6rem] font-label text-secondary uppercase tracking-widest font-bold">Concluídos</p>
              </div>
            </div>

            {/* Orders Master Table */}
            <div className="bg-surface-container-lowest rounded-lg border border-white/5 shadow-2xl overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-secondary uppercase tracking-widest text-xs animate-pulse font-label">Consultando banco de dados...</div>
              ) : pedidos.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <p className="text-secondary uppercase tracking-widest text-xs opacity-50 font-bold font-label italic">Nenhum pedido encontrado no sistema.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-surface-container-low font-label">
                        <th className="px-6 py-5 font-label text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Pedido</th>
                        <th className="px-6 py-5 font-label text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Serviço</th>
                        <th className="px-6 py-5 font-label text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Status</th>
                        <th className="px-6 py-5 font-label text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Data</th>
                        <th className="px-6 py-5 font-label text-[0.65rem] uppercase tracking-widest text-secondary font-bold text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-white text-sm font-medium block">ID: {pedido.id.slice(0, 8)}</span>
                              {pedido.oculto_pelo_cliente && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[0.5rem] font-bold uppercase rounded border border-red-500/20">Oculto</span>
                              )}
                            </div>
                            <span className="text-[0.65rem] text-secondary font-body opacity-60 uppercase tracking-widest">{pedido.titulo || 'Sem Título'}</span>
                          </td>
                          <td className="px-6 py-6">
                            <span className="font-headline text-lg text-white group-hover:text-primary transition-colors uppercase tracking-tight italic">{pedido.servico}</span>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest border ${getStatusColor(pedido.status)}`}>
                              {pedido.status}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-sm text-secondary font-body">
                            {formatDateBR(pedido.created_at)}
                          </td>
                          <td className="px-6 py-6 text-right">
                            <Link
                              to={`/admin/pedido/${pedido.id}`}
                              className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-on-primary border border-white/10 hover:border-primary px-4 py-2 rounded text-[0.65rem] font-label font-bold uppercase tracking-widest transition-all"
                            >
                              <span className="hidden sm:inline">Gerenciar</span> <ExternalLink size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BOTÃO NUCLEAR DISCRETO */}
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setShowNuclearModal(true)}
                className="text-[0.6rem] font-label text-secondary hover:text-red-500 transition-colors uppercase tracking-[0.3em] font-bold flex items-center gap-2 opacity-30 hover:opacity-100"
              >
                <Trash2 size={14} /> LIMPAR TODOS OS PEDIDOS
              </button>
            </div>

          </div>
        </main>

        {/* MODAL DE SEGURANÇA MESTRE — REFATORADO */}
        <AnimatePresence>
          {showNuclearModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                tabIndex="-1"
                className="max-w-md w-full bg-surface-container-high border border-red-500/30 p-10 rounded-lg shadow-[0_0_80px_rgba(239,68,68,0.15)] text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />

                <button
                  onClick={() => { setShowNuclearModal(false); setNuclearConfirmText(''); }}
                  className="absolute top-4 right-4 text-secondary hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <ShieldAlert size={48} className="text-red-500 mx-auto mb-6" />
                <h3 className="font-headline text-3xl text-white uppercase tracking-tighter mb-4">Ação Irreversível</h3>
                <p className="text-secondary text-[0.65rem] font-bold uppercase tracking-[0.15em] leading-relaxed mb-8">
                  Esta ação apagará <span className="text-red-500">TODOS</span> os pedidos permanentemente do banco de dados. Esta operação não pode ser desfeita.
                  <br /><br />
                  Digite <span className="text-red-500">DELETAR TUDO</span> para confirmar.
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder='DELETAR TUDO'
                      className="w-full bg-black/40 border border-white/10 p-5 rounded text-center text-white focus:ring-1 focus:ring-red-500 font-body placeholder:text-[0.6rem] placeholder:tracking-[0.2em] outline-none transition-all uppercase text-xs"
                      value={nuclearConfirmText}
                      onChange={(e) => setNuclearConfirmText(e.target.value.toUpperCase())}
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 font-label">
                    <button
                      onClick={() => { setShowNuclearModal(false); setNuclearConfirmText(''); }}
                      className="py-5 border border-white/10 text-white rounded text-[0.65rem] font-bold uppercase tracking-widest hover:bg-white/5 transition-all outline-none"
                    >
                      CANCELAR
                    </button>
                    <button
                      onClick={handleNuclearClean}
                      disabled={isCleaning || nuclearConfirmText !== 'DELETAR TUDO'}
                      className="py-5 bg-red-600 text-white rounded text-[0.65rem] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-30 outline-none"
                    >
                      {isCleaning ? 'LIMPANDO...' : 'CONFIRMAR'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="p-8 text-center border-t border-white/5 bg-surface-container-low opacity-30 mt-auto">
          <p className="text-[0.6rem] text-secondary uppercase tracking-[0.4em] font-bold font-label">BUNKER ADMINISTRATIVO • ACESSO RESTRITO</p>
        </footer>
      </div>
    </>
  );
};

export default AdminDashboard;
