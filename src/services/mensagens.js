import { supabase } from '../lib/supabase';

/**
 * Serviço de Mensagens — Abstração para CRUD da tabela mensagens.
 */

/**
 * Busca mensagens de um pedido.
 */
export const fetchMensagens = async (pedidoId) => {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('pedido_id', pedidoId)
    .order('created_at', { ascending: true });

  return { data, error };
};

/**
 * Envia uma mensagem em um pedido.
 */
export const enviarMensagem = async ({ pedidoId, remetente, conteudo }) => {
  const { data, error } = await supabase
    .from('mensagens')
    .insert({
      pedido_id: pedidoId,
      remetente,
      conteudo,
    });

  return { data, error };
};

/**
 * Cria subscription Realtime para novas mensagens de um pedido.
 */
export const subscribeToMensagens = (pedidoId, onNewMessage) => {
  const channel = supabase
    .channel(`chat-pedido-${pedidoId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'mensagens',
      filter: `pedido_id=eq.${pedidoId}`,
    }, payload => onNewMessage?.(payload.new))
    .subscribe();

  return channel;
};
