import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Send, 
  Save, 
  FileAudio,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Download
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import { fetchPedidoById, updatePedido } from '../services/pedidos';
import { fetchMensagens, enviarMensagem, subscribeToMensagens } from '../services/mensagens';
import { downloadFile } from '../services/storage';
import { unsubscribeChannel } from '../services/pedidos';
import { formatTimeBR } from '../utils/status';

const AdminPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [status, setStatus] = useState('');
  const [arquivoUrl, setArquivoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: pedidoData } = await fetchPedidoById(id);
      if (pedidoData) {
        setPedido(pedidoData);
        setStatus(pedidoData.status);
        setArquivoUrl(pedidoData.arquivo_url || '');
      }
      const { data: msgs } = await fetchMensagens(id);
      if (msgs) setMensagens(msgs);
      setLoading(false);
    };

    loadData();

    const channel = subscribeToMensagens(id, (newMsg) => {
      setMensagens(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => unsubscribeChannel(channel);
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleUpdatePedido = async () => {
    setSaving(true);
    const { error } = await updatePedido(id, { status, arquivo_url: arquivoUrl });
    if (!error) {
      setPedido(prev => ({ ...prev, status, arquivo_url: arquivoUrl }));
      setFeedback({ type: 'success', message: 'Pedido atualizado com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: 'Erro ao atualizar: ' + error.message });
    }
    setSaving(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    const { error } = await enviarMensagem({ pedidoId: id, remetente: 'admin', conteudo: novaMensagem });
    if (!error) setNovaMensagem('');
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary uppercase font-label text-xs tracking-widest animate-pulse">Consultando Bunker...</div>;

  return (
    <>
      <SEO title={`Gerenciar Pedido | Estúdio Almeida`} description="Gestão detalhada do projeto sonoro." />

      <div className="min-h-screen bg-background text-on-surface flex flex-col font-body">
        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl font-label text-xs font-bold uppercase tracking-widest ${
                feedback.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <header className="border-b border-white/5 bg-surface-container-low px-6 md:px-12 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 text-secondary hover:text-white transition-all uppercase font-label text-[0.65rem] tracking-widest font-bold">
              <ChevronLeft size={16} /> Voltar ao Painel
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] font-bold text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20 uppercase tracking-widest block">Acesso Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-grow p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-1 space-y-8">
              <section className="bg-surface-container-low p-8 rounded-lg border border-white/5 space-y-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center text-primary mb-6">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="font-headline text-3xl text-white uppercase tracking-tighter leading-none">Controle do Projeto</h2>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="space-y-3">
                    <label className="font-label text-secondary text-[0.65rem] uppercase tracking-widest font-bold block">Status da Produção</label>
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-sm text-white focus:ring-1 focus:ring-primary font-body appearance-none cursor-pointer uppercase font-bold"
                    >
                      <option value="aguardando">🟡 AGUARDANDO</option>
                      <option value="em produção">🔵 EM PRODUÇÃO</option>
                      <option value="concluído">🟢 CONCLUÍDO</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="font-label text-secondary text-[0.65rem] uppercase tracking-widest font-bold block">Link do Áudio Final</label>
                    <div className="relative group">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={arquivoUrl}
                        onChange={(e) => setArquivoUrl(e.target.value)}
                        placeholder="Ex: pasta/arquivo.mp3"
                        className="w-full bg-surface-container-high border border-white/10 py-4 pl-12 pr-4 rounded text-sm text-white focus:ring-1 focus:ring-primary font-body tracking-wider"
                      />
                    </div>
                  </div>

                  <button onClick={handleUpdatePedido} disabled={saving} className="w-full py-5 bg-primary text-on-primary font-label text-xs font-bold tracking-[0.25em] uppercase rounded flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-primary/20">
                    {saving ? 'ATUALIZANDO...' : <><Save size={18} /> SALVAR ALTERAÇÕES</>}
                  </button>
                </div>
              </section>

              <section className="bg-surface-container-lowest p-8 rounded-lg border border-white/5 border-dashed space-y-6 text-left">
                 <h4 className="font-label text-secondary text-[0.65rem] uppercase tracking-widest font-bold mb-4 opacity-60 flex items-center gap-2">
                   <FileAudio size={14} /> Detalhes do Projeto
                 </h4>
                 <div className="space-y-4">
                    <div>
                        <p className="font-label text-[0.6rem] text-primary uppercase tracking-widest font-bold mb-1">Título / Serviço</p>
                        <p className="font-headline text-2xl text-white uppercase italic leading-tight">{pedido.titulo || pedido.servico}</p>
                    </div>
                    <div>
                        <p className="font-label text-[0.6rem] text-primary uppercase tracking-widest font-bold mb-1">Roteiro / Texto</p>
                        <p className="text-secondary text-sm leading-relaxed bg-black/20 p-4 rounded border border-white/5 italic">&quot;{pedido.texto_roteiro || pedido.descricao}&quot;</p>
                    </div>

                    {pedido.arquivos_guia_urls && pedido.arquivos_guia_urls.length > 0 && (
                        <div className="pt-4 border-t border-white/5">
                            <p className="font-label text-[0.6rem] text-primary uppercase tracking-widest font-bold mb-3">Anexos de Guia</p>
                            <div className="space-y-2">
                                {pedido.arquivos_guia_urls.map((path, i) => (
                                    <button key={i} onClick={() => downloadFile(path)} className="w-full flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition-all group overflow-hidden">
                                        <span className="text-[0.6rem] text-secondary uppercase truncate pr-4 text-left">Guia {i+1}</span>
                                        <Download size={12} className="text-primary group-hover:scale-110" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
              </section>
            </div>

            <div className="lg:col-span-2 flex flex-col h-[800px] bg-surface-container-lowest rounded-lg border border-white/5 overflow-hidden shadow-2xl relative">
              <header className="p-6 border-b border-white/5 bg-surface-container-low flex items-center justify-between z-10 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary border border-white/10">
                    <MessageSquare size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-label text-[0.65rem] text-white uppercase tracking-widest font-bold italic">Bunker de Atendimento</h3>
                  </div>
                </div>
              </header>

              <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,rgba(242,202,80,0.02)_0%,transparent_100%)]">
                <AnimatePresence>
                  {mensagens.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, x: msg.remetente === 'admin' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${msg.remetente === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-5 rounded-lg text-sm relative shadow-2xl ${msg.remetente === 'admin' ? 'bg-primary text-on-primary ml-auto shadow-primary/20' : 'bg-surface-container-high text-white'}`}>
                        <p className="leading-relaxed font-body">{msg.conteudo}</p>
                        <span className={`text-[0.55rem] uppercase tracking-widest mt-3 block opacity-50 font-bold ${msg.remetente === 'admin' ? 'text-right' : 'text-left'}`}>{formatTimeBR(msg.created_at)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleEnviarMensagem} className="p-6 bg-surface-container-low border-t border-white/5 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
                <div className="flex gap-4">
                  <input type="text" value={novaMensagem} onChange={(e) => setNovaMensagem(e.target.value)} placeholder="Responda seu cliente..." className="flex-grow bg-surface-container-high border border-white/10 px-6 py-5 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary font-body" />
                  <button type="submit" className="bg-primary hover:bg-primary-container text-on-primary w-14 h-14 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"><Send size={24} /></button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPedido;
