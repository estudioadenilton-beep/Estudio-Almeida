import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { createPedido, updatePedido } from '../services/pedidos';
import { novoPedidoSchema as pedidoSchema } from '../utils/validation';
import { 
  ArrowLeft, 
  Send, 
  Mic2, 
  PenTool, 
  AudioLines, 
  Music, 
  Upload, 
  FileText, 
  Type,
  CheckCircle2,
  AlertCircle,
  MicVocal,
  SlidersHorizontal,
  Sparkles,
  X
} from 'lucide-react';
import SEO from '../components/shared/SEO';

const NovoPedido = () => {
  const navigate = useNavigate();
  const [arquivos, setArquivos] = useState([]);
  const [arquivosVocal, setArquivosVocal] = useState([]);
  const [arquivosReferencia, setArquivosReferencia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Estados do fluxo condicional de Produção
  const [temVocal, setTemVocal] = useState(null); // null | true | false
  const [tipoProducao, setTipoProducao] = useState(null); // null | 'descrever' | 'editor'

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      servico: 'Voice-Over',
      estilo_voz: 'Padrão'
    }
  });

  const selectedService = watch('servico');

  // Reset dos estados de produção quando muda de serviço
  React.useEffect(() => {
    if (selectedService !== 'Produção') {
      setTemVocal(null);
      setTipoProducao(null);
      setArquivosVocal([]);
      setArquivosReferencia([]);
    }
  }, [selectedService]);

  // --- Handlers de Arquivos ---

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArquivos(prev => [...prev, ...files]);
    setUploadError(null);
  };

  const handleVocalFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArquivosVocal(prev => [...prev, ...files]);
  };

  const handleReferenciaFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArquivosReferencia(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
  };

  const removeVocalFile = (index) => {
    setArquivosVocal(prev => prev.filter((_, i) => i !== index));
  };

  const removeReferenciaFile = (index) => {
    setArquivosReferencia(prev => prev.filter((_, i) => i !== index));
  };

  // --- Upload para Supabase Storage ---

  const uploadFilesToStorage = async (userId, pedidoId, fileList) => {
    const urls = [];
    for (const file of fileList) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${pedidoId}/${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('arquivos-pedidos')
          .upload(fileName, file);

        if (error) throw error;
        urls.push(fileName); // Salva path relativo
      } catch (err) {
        console.error(`Falha no arquivo ${file.name}:`, err);
      }
    }
    return urls;
  };

  // --- Submit ---

  const { user } = useAuth();

  const onSubmit = async (data) => {
    setUploadError(null);
    try {
      setUploading(true);
      if (!user) throw new Error("Usuário não autenticado");

      // Montar descrição baseada no fluxo
      let descricao = '';
      if (selectedService === 'Produção') {
        descricao += temVocal ? '[TEM VOCAL] ' : '[PRECISA DE VOCAL] ';
        descricao += tipoProducao === 'descrever' 
          ? '[PRODUÇÃO DESCRITA] ' 
          : '[LIVRE PARA O EDITOR] ';
        if (data.descricao_producao) descricao += data.descricao_producao.substring(0, 100);
        if (data.texto_roteiro) descricao += data.texto_roteiro.substring(0, 100);
      } else {
        descricao = (data.texto_roteiro || '').substring(0, 100);
      }

      // 1. Criar o pedido
      const { data: pedidoData, error: pedidoError } = await createPedido({
        titulo: data.titulo,
        servico: data.servico, 
        estilo_voz: data.estilo_voz,
        texto_roteiro: data.texto_roteiro,
        texto_guia: data.texto_guia,
        descricao,
        cliente_id: user.id,
        status: 'aguardando',
        metadata_producao: selectedService === 'Produção' ? JSON.stringify({
          temVocal,
          tipoProducao,
          descricao_producao: data.descricao_producao || null,
          estilo_audio: data.estilo_audio || null,
          observacoes_producao: data.observacoes_producao || null,
        }) : null
      });

      if (pedidoError) throw pedidoError;

      // 2. Upload de arquivos
      const allFiles = [...arquivos, ...arquivosVocal, ...arquivosReferencia];
      if (allFiles.length > 0) {
        try {
          const urls = await uploadFilesToStorage(user.id, pedidoData.id, allFiles);
          
          if (urls.length > 0) {
            await updatePedido(pedidoData.id, { arquivos_guia_urls: urls });
          }
        } catch (storageErr) {
          console.error('Falha no upload, mas pedido salvo:', storageErr);
          alert('Seu pedido foi salvo, mas houve um erro ao enviar os arquivos. Você pode enviá-los pelo chat depois.');
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no processo:', error);
      setUploadError('Erro ao processar pedido: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- Dados Estáticos ---

  const services = [
    { id: 'Voice-Over', icon: Mic2, label: 'Voice-Over' },
    { id: 'Produção', icon: PenTool, label: 'Produção' },
    { id: 'Sound Design', icon: AudioLines, label: 'Sound Design' },
    { id: 'Trilha', icon: Music, label: 'Trilha' },
  ];

  const estilosVoz = [
    'Padrão', 'Impacto', 'Jovem', 'Varejo', 'Institucional', 'Up/Festas', 'Jornalístico', 'Outro'
  ];

  // --- Componentes Auxiliares Internos ---

  const OptionButton = ({ selected, onClick, icon: Icon, label, sublabel }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center p-6 rounded border transition-all group cursor-pointer ${
        selected 
          ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10' 
          : 'border-white/10 bg-surface-container-high text-secondary hover:border-white/20 hover:text-white'
      }`}
    >
      <Icon className={`w-7 h-7 mb-3 transition-transform ${selected ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="text-[0.7rem] font-label uppercase tracking-widest font-bold text-center">{label}</span>
      {sublabel && <span className="text-[0.55rem] mt-1 opacity-50 uppercase tracking-wider">{sublabel}</span>}
    </button>
  );

  const FileUploadZone = ({ label, sublabel, files, onChange, onRemove, accept = '*/*' }) => (
    <div className="space-y-4">
      <label className="font-label text-[0.65rem] text-primary uppercase tracking-[0.2em] font-bold flex items-center gap-2">
        <Upload size={14} /> {label}
      </label>
      <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-primary/40 transition-colors relative group">
        <input 
          type="file" 
          multiple 
          onChange={onChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto text-secondary mb-3 group-hover:text-primary transition-colors" size={28} />
        <p className="text-secondary text-[0.65rem] uppercase tracking-widest font-bold">Clique ou arraste arquivos aqui</p>
        {sublabel && <p className="text-secondary/40 text-[0.55rem] uppercase tracking-widest mt-1">{sublabel}</p>}
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {files.map((file, index) => (
            <div key={index} className="bg-surface-container-high p-3 rounded flex items-center justify-between border border-white/5">
              <span className="text-[0.6rem] text-white truncate max-w-[80%] uppercase tracking-tighter">{file.name}</span>
              <button type="button" onClick={() => onRemove(index)} className="text-error hover:text-error/80 ml-2">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- Seção Visual de Pergunta ---
  const QuestionSection = ({ number, question, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 bg-surface-container-lowest/50 p-6 md:p-8 rounded-lg border border-white/5"
    >
      <div className="flex items-center gap-4 mb-2">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-label">{number}</span>
        <h3 className="font-headline text-lg text-white uppercase tracking-tight">{question}</h3>
      </div>
      {children}
    </motion.div>
  );

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <>
      <SEO title="Novo Pedido | Estúdio Almeida" description="Solicite sua produção sonora com detalhes profissionais." />

      <div className="min-h-screen bg-background text-on-surface p-6 md:p-12 font-body">
        <main className="max-w-4xl mx-auto">
          
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all mb-12 uppercase font-label text-[0.65rem] tracking-widest font-bold">
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 bg-surface-container-low p-8 md:p-12 rounded-lg border border-white/5 shadow-2xl"
          >
            <div className="border-b border-white/5 pb-8">
              <h1 className="font-headline text-4xl text-white uppercase tracking-tighter font-bold">Solicitar Proposta</h1>
              <p className="text-secondary opacity-60 text-[0.7rem] uppercase tracking-widest mt-2">Inspirado na excelência do Mercado do Off</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              {/* ============ TÍTULO DO PEDIDO ============ */}
              <div className="space-y-4">
                <label className="font-label text-[0.65rem] text-primary uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                  <Type size={14} /> Título do Projeto
                </label>
                <input 
                  {...register('titulo')}
                  placeholder="Ex: Comercial Supermercado Verão 2024"
                  className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white focus:ring-1 focus:ring-primary font-body"
                />
                {errors.titulo && <p className="text-error text-[0.6rem] uppercase tracking-widest">{errors.titulo.message}</p>}
              </div>

              {/* ============ SELEÇÃO DE SERVIÇO ============ */}
              <div className="space-y-6">
                <label className="font-label text-[0.65rem] text-primary uppercase tracking-[0.2em] font-bold">Serviço Desejado</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((s) => (
                    <label key={s.id} className="cursor-pointer group">
                      <input 
                        type="radio" 
                        value={s.id} 
                        {...register('servico')} 
                        className="peer hidden" 
                      />
                      <div className="flex flex-col items-center justify-center p-6 rounded bg-surface-container-high border border-white/5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-secondary peer-checked:text-primary hover:border-white/20">
                        <s.icon className="w-6 h-6 mb-3 transition-transform group-hover:scale-110" />
                        <span className="text-[0.6rem] font-label uppercase tracking-widest text-center font-bold">{s.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ============================================================ */}
              {/* ============ FLUXO VOICE-OVER (SERVIÇO DIRETO) ============ */}
              {/* ============================================================ */}
              <AnimatePresence mode="wait">
                {selectedService === 'Voice-Over' && (
                  <motion.div
                    key="voiceover-flow"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-10 overflow-hidden"
                  >
                    {/* Estilo de Voz */}
                    <div className="space-y-4">
                      <label className="font-label text-[0.65rem] text-primary uppercase tracking-[0.2em] font-bold">Estilo da Voz</label>
                      <select 
                        {...register('estilo_voz')}
                        className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white focus:ring-1 focus:ring-primary font-body uppercase text-xs font-bold tracking-widest"
                      >
                        {estilosVoz.map(estilo => <option key={estilo} value={estilo}>{estilo}</option>)}
                      </select>
                    </div>

                    {/* Roteiro */}
                    <div className="space-y-4">
                      <label className="font-label text-[0.65rem] text-primary uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                        <FileText size={14} /> Texto / Roteiro da Locução
                      </label>
                      <textarea 
                        {...register('texto_roteiro')}
                        placeholder="Cole aqui o texto que será gravado..."
                        className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[200px] resize-none"
                      />
                    </div>

                    {/* Observações */}
                    <div className="space-y-4">
                      <label className="font-label text-[0.65rem] text-secondary uppercase tracking-[0.2em] font-bold flex items-center gap-2 opacity-60">
                        <PenTool size={14} /> Observações para o Locutor (Opcional)
                      </label>
                      <textarea 
                        {...register('texto_guia')}
                        placeholder="Ex: Falar de forma alegre, dar ênfase na palavra 'Promoção'..."
                        className="w-full bg-surface-container-high/50 border border-white/5 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[100px] resize-none text-sm"
                      />
                    </div>

                    {/* Upload único */}
                    <FileUploadZone 
                      label="Arquivos de Guia / Referência"
                      sublabel="Sem restrições de formato"
                      files={arquivos}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />
                  </motion.div>
                )}

                {/* ============================================================ */}
                {/* ============ FLUXO PRODUÇÃO (CONDICIONAL) ================== */}
                {/* ============================================================ */}
                {selectedService === 'Produção' && (
                  <motion.div
                    key="producao-flow"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden"
                  >
                    {/* ========== PERGUNTA 1: TEM VOCAL? ========== */}
                    <QuestionSection number="1" question="Você já tem a locução gravada?">
                      <div className="grid grid-cols-2 gap-4">
                        <OptionButton 
                          selected={temVocal === true}
                          onClick={() => { setTemVocal(true); }}
                          icon={CheckCircle2}
                          label="Sim, tenho o vocal"
                          sublabel="Já possuo o áudio"
                        />
                        <OptionButton 
                          selected={temVocal === false}
                          onClick={() => { setTemVocal(false); }}
                          icon={MicVocal}
                          label="Não, preciso do vocal"
                          sublabel="Gravar locução"
                        />
                      </div>

                      {/* --- SE TEM VOCAL: Upload do Vocal --- */}
                      <AnimatePresence>
                        {temVocal === true && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="pt-4"
                          >
                            <FileUploadZone 
                              label="Upload do Vocal"
                              sublabel="Envie o arquivo de áudio da locução (.mp3, .wav, etc.)"
                              files={arquivosVocal}
                              onChange={handleVocalFileChange}
                              onRemove={removeVocalFile}
                              accept="audio/*,.mp3,.wav,.aac,.ogg,.flac"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* --- SE NÃO TEM VOCAL: Campos de Voice-Over --- */}
                      <AnimatePresence>
                        {temVocal === false && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 pt-4 pl-4 border-l-2 border-primary/20"
                          >
                            <p className="text-[0.6rem] text-primary/60 uppercase tracking-widest font-bold font-label">Detalhes da locução que precisamos gravar:</p>
                            
                            {/* Estilo de Voz */}
                            <div className="space-y-3">
                              <label className="font-label text-[0.6rem] text-secondary uppercase tracking-widest font-bold">Estilo da Voz</label>
                              <select 
                                {...register('estilo_voz')}
                                className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white focus:ring-1 focus:ring-primary font-body uppercase text-xs font-bold tracking-widest"
                              >
                                {estilosVoz.map(estilo => <option key={estilo} value={estilo}>{estilo}</option>)}
                              </select>
                            </div>

                            {/* Roteiro */}
                            <div className="space-y-3">
                              <label className="font-label text-[0.6rem] text-secondary uppercase tracking-widest font-bold flex items-center gap-2">
                                <FileText size={12} /> Texto / Roteiro da Locução
                              </label>
                              <textarea 
                                {...register('texto_roteiro')}
                                placeholder="Cole aqui o texto que será gravado..."
                                className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[160px] resize-none text-sm"
                              />
                            </div>

                            {/* Observações para o Locutor */}
                            <div className="space-y-3">
                              <label className="font-label text-[0.6rem] text-secondary/60 uppercase tracking-widest font-bold flex items-center gap-2">
                                <PenTool size={12} /> Observações para o Locutor (Opcional)
                              </label>
                              <textarea 
                                {...register('texto_guia')}
                                placeholder="Ex: Falar de forma alegre, dar ênfase na palavra 'Promoção'..."
                                className="w-full bg-surface-container-high/50 border border-white/5 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[80px] resize-none text-sm"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </QuestionSection>

                    {/* ========== PERGUNTA 2: TIPO DE PRODUÇÃO ========== */}
                    {/* Só aparece depois de responder a Pergunta 1 */}
                    <AnimatePresence>
                      {temVocal !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <QuestionSection number="2" question="Como quer a produção?">
                            <div className="grid grid-cols-2 gap-4">
                              <OptionButton 
                                selected={tipoProducao === 'descrever'}
                                onClick={() => setTipoProducao('descrever')}
                                icon={SlidersHorizontal}
                                label="Descrever como quero"
                                sublabel="Detalhes específicos"
                              />
                              <OptionButton 
                                selected={tipoProducao === 'editor'}
                                onClick={() => setTipoProducao('editor')}
                                icon={Sparkles}
                                label="Deixar por conta do editor"
                                sublabel="Liberdade criativa"
                              />
                            </div>

                            {/* --- SE DESCREVER: Campos detalhados --- */}
                            <AnimatePresence>
                              {tipoProducao === 'descrever' && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="space-y-6 pt-4 pl-4 border-l-2 border-primary/20"
                                >
                                  {/* Descrição da Produção */}
                                  <div className="space-y-3">
                                    <label className="font-label text-[0.6rem] text-secondary uppercase tracking-widest font-bold flex items-center gap-2">
                                      <FileText size={12} /> Descrição da Produção
                                    </label>
                                    <textarea 
                                      {...register('descricao_producao')}
                                      placeholder="Descreva como você imagina a produção final... Ex: Quero um áudio de impacto com efeitos dramáticos no início, transição suave para a locução e finalização épica."
                                      className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[140px] resize-none text-sm"
                                    />
                                  </div>

                                  {/* Estilo do Áudio */}
                                  <div className="space-y-3">
                                    <label className="font-label text-[0.6rem] text-secondary uppercase tracking-widest font-bold">Estilo do Áudio</label>
                                    <input 
                                      {...register('estilo_audio')}
                                      placeholder="Ex: calmo, impacto, suave, épico, institucional..."
                                      className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary text-sm"
                                    />
                                  </div>

                                  {/* Observações da Produção */}
                                  <div className="space-y-3">
                                    <label className="font-label text-[0.6rem] text-secondary/60 uppercase tracking-widest font-bold flex items-center gap-2">
                                      <PenTool size={12} /> Observações (Opcional)
                                    </label>
                                    <textarea 
                                      {...register('observacoes_producao')}
                                      placeholder="Informações adicionais para o editor..."
                                      className="w-full bg-surface-container-high/50 border border-white/5 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[80px] resize-none text-sm"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* --- Upload de Referências (aparece para ambos os tipos) --- */}
                            <AnimatePresence>
                              {tipoProducao !== null && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="pt-4"
                                >
                                  <FileUploadZone 
                                    label="Upload de Referências"
                                    sublabel={tipoProducao === 'editor' 
                                      ? "Opcional — envie referências de áudio/vídeo para inspirar o editor" 
                                      : "Envie referências de áudio ou vídeo que ilustrem o resultado desejado"
                                    }
                                    files={arquivosReferencia}
                                    onChange={handleReferenciaFileChange}
                                    onRemove={removeReferenciaFile}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </QuestionSection>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ============================================================ */}
                {/* ============ FLUXO GENÉRICO (Sound Design / Trilha) ========= */}
                {/* ============================================================ */}
                {(selectedService === 'Sound Design' || selectedService === 'Trilha') && (
                  <motion.div
                    key="generic-flow"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-10 overflow-hidden"
                  >
                    {/* Descrição */}
                    <div className="space-y-4">
                      <label className="font-label text-[0.65rem] text-primary uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                        <FileText size={14} /> Descreva o que você precisa
                      </label>
                      <textarea 
                        {...register('texto_roteiro')}
                        placeholder={selectedService === 'Trilha' 
                          ? "Descreva o tipo de trilha que precisa, o mood, a duração e onde será usada..."
                          : "Descreva o projeto, os efeitos sonoros necessários e o contexto de uso..."
                        }
                        className="w-full bg-surface-container-high border border-white/10 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[200px] resize-none"
                      />
                    </div>

                    {/* Observações */}
                    <div className="space-y-4">
                      <label className="font-label text-[0.65rem] text-secondary uppercase tracking-[0.2em] font-bold flex items-center gap-2 opacity-60">
                        <PenTool size={14} /> Observações para o Produtor (Opcional)
                      </label>
                      <textarea 
                        {...register('texto_guia')}
                        placeholder="Informações adicionais, referências, etc."
                        className="w-full bg-surface-container-high/50 border border-white/5 p-4 rounded text-white font-body focus:ring-1 focus:ring-primary min-h-[100px] resize-none text-sm"
                      />
                    </div>

                    {/* Upload */}
                    <FileUploadZone 
                      label="Arquivos de Guia / Referência"
                      sublabel="Sem restrições de formato"
                      files={arquivos}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ============ FEEDBACK DE ERRO ============ */}
              {uploadError && (
                <div className="p-4 bg-error/10 border border-error/20 rounded flex items-center gap-3 text-error text-[0.65rem] uppercase tracking-widest font-bold">
                  <AlertCircle size={16} />
                  {uploadError}
                </div>
              )}

              {/* ============ BOTÃO SUBMIT ============ */}
              <div className="pt-8 border-t border-white/5 font-label">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="w-full py-6 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-xs tracking-[0.3em] uppercase rounded shadow-2xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {(isSubmitting || uploading) ? (
                    <>PROCESSANDO PEDIDO...</>
                  ) : (
                    <>SOLICITAR PROPOSTA AGORA <CheckCircle2 size={18} /></>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default NovoPedido;
