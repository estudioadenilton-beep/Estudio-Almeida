import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Download, 
  Clock, 
  CheckCircle2, 
  Mic2,
  Calendar,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import { useAuth } from '../contexts/AuthContext';
import { fetchPedidoById } from '../services/pedidos';
import { fetchMensagens, enviarMensagem, subscribeToMensagens } from '../services/mensagens';
import { downloadFile } from '../services/storage';
import { unsubscribeChannel } from '../services/pedidos';

const Pedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      const { data: pedidoData, error: pedidoError } = await fetchPedidoById(id);
      if (pedidoError || !pedidoData) {
        navigate('/dashboard');
        return;
      }
      setPedido(pedidoData);

      const { data: msgData } = await fetchMensagens(id);
      setMensagens(msgData || []);
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
  }, [id, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const { user } = useAuth();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || sending) return;

    setSending(true);
    const { error } = await enviarMensagem({
      pedidoId: id,
      conteudo: novaMensagem,
      remetente: user?.email || 'cliente',
    });

    if (!error) {
      setNovaMensagem('');
    }
    setSending(false);
  };

  // handleDownload agora centralizado via services/storage.js

  const statusIcons = {
    'aguardando': <Clock size={20} className="text-amber-500" />,
    'em produção': <Mic2 size={20} className="text-blue-500" />,
    'concluído': <CheckCircle2 size={20} className="text-emerald-500" />
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary text-xs uppercase tracking-widest">Sintonizando...</div>;

  return (
    <>
      <SEO title={`${pedido.servico} | Estúdio Almeida`} description="Detalhes do projeto e comunicação direta." />

      <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row font-body h-screen overflow-hidden">
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-surface-container-low border-r border-white/5 p-8 overflow-y-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12 uppercase font-label text-[0.6rem] tracking-[0.2em] font-bold">
            <ArrowLeft size={14} /> Voltar ao Painel
          </Link>

          <header className="space-y-6">
            <div className={`w-fit px-4 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-widest border flex items-center gap-2 ${
              pedido.status === 'concluído' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' :
              pedido.status === 'em produção' ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' : 
              'text-amber-500 border-amber-500/20 bg-amber-500/10'
            }`}>
              {statusIcons[pedido.status.toLowerCase()]} {pedido.status}
            </div>

            <h1 className="font-headline text-3xl text-white uppercase tracking-tighter leading-tight">
              {pedido.servico}
            </h1>

            <div className="space-y-4 pt-6 text-[0.7rem] text-secondary font-label uppercase tracking-widest opacity-80 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-primary" />
                <span>Solicitado em: {new Date(pedido.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={14} className="text-primary" />
                <span>ID: {pedido.id.slice(0,8)}</span>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-headline text-white mb-4 uppercase tracking-tight">Descrição</h4>
              <p className="text-secondary text-sm leading-relaxed">{pedido.descricao}</p>
            </div>

            {pedido.arquivo_url && pedido.status === 'concluído' && (
              <div className="pt-8">
                <button 
                  onClick={() => downloadFile(pedido.arquivo_url)}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary py-4 rounded font-label text-xs font-bold tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  BAIXAR ARQUIVO FINAL <Download size={18} />
                </button>
              </div>
            )}
          </header>
        </aside>

        <main className="flex-1 flex flex-col bg-surface-container-lowest h-full">
          <header className="p-6 border-b border-white/5 bg-surface-container-lowest/50 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-headline text-white text-lg tracking-tight uppercase">Chat do Projeto</h3>
                <span className="text-[0.6rem] text-secondary uppercase tracking-widest font-bold">Comunicação direta com o Estúdio</span>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-grow p-6 md:p-12 overflow-y-auto space-y-8 scroll-smooth">
            {mensagens.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic font-body">
                <MessageSquare size={48} className="mb-4" />
                <p>Nenhuma mensagem ainda. <br /> Inicie a conversa abaixo.</p>
              </div>
            ) : (
              mensagens.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.remetente === 'admin' ? 'items-start' : 'items-end'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${msg.remetente === 'admin' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.remetente === 'admin' ? 'bg-primary text-on-primary' : 'bg-white/10 text-white'}`}>
                      <UserIcon size={12} />
                    </div>
                    <span className="font-label text-[0.6rem] uppercase tracking-widest font-bold text-secondary">{msg.remetente === 'admin' ? 'Estúdio Almeida' : 'Você'}</span>
                    <span className="text-[0.55rem] text-white/20 font-body">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-xl font-body text-sm leading-relaxed ${msg.remetente === 'admin' ? 'bg-surface-container-high text-white rounded-tl-none border border-white/5' : 'bg-primary/10 text-primary rounded-tr-none border border-primary/20'}`}>
                    {msg.conteudo}
                  </div>
                </div>
              ))
            )}
          </div>

          <footer className="p-6 border-t border-white/5 bg-surface-container-low">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-4">
              <div className="flex-1 relative group">
                <textarea 
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Escreva sua mensagem aqui..."
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-xl p-4 pr-12 text-white font-body text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none min-h-[56px] max-h-[150px] scrollbar-hide"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                />
              </div>
              <button type="submit" disabled={sending || !novaMensagem.trim()} className="w-14 h-14 bg-primary text-on-primary rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-primary/10">
                <Send size={24} />
              </button>
            </form>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Pedido;
