import { supabase } from '../lib/supabase';

/**
 * Serviço de Pedidos — Abstração para CRUD da tabela pedidos.
 * Centraliza queries que antes estavam espalhadas em 5+ componentes.
 */

/**
 * Busca pedidos do cliente autenticado (exclui ocultos).
 */
export const fetchClientePedidos = async (userId) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('cliente_id', userId)
    .eq('oculto_pelo_cliente', false)
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Busca TODOS os pedidos (acesso admin — protegido por RLS).
 */
export const fetchAllPedidos = async () => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Busca um único pedido pelo ID.
 */
export const fetchPedidoById = async (id) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

/**
 * Cria um novo pedido.
 */
export const createPedido = async (pedido) => {
  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single();

  return { data, error };
};

/**
 * Atualiza campos de um pedido (admin).
 */
export const updatePedido = async (id, updates) => {
  const { data, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', id);

  return { data, error };
};

/**
 * Oculta um pedido pelo cliente (soft delete).
 */
export const ocultarPedido = async (id) => {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ oculto_pelo_cliente: true })
    .eq('id', id);

  return { data, error };
};

/**
 * Deleta TODOS os pedidos (operação nuclear — admin protegido por RLS).
 */
export const deleteAllPedidos = async () => {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .not('id', 'is', null);

  return { error };
};

/**
 * Calcula estatísticas de pedidos.
 */
export const calcularStats = (pedidos) => ({
  total: pedidos.length,
  aguardando: pedidos.filter(p => p.status === 'aguardando').length,
  producao: pedidos.filter(p => p.status === 'em produção').length,
  concluido: pedidos.filter(p => p.status === 'concluído').length,
});

/**
 * Cria subscription Realtime para mudanças em pedidos do cliente.
 * Retorna o channel para cleanup.
 */
export const subscribeToPedidos = (userId, onInsert, onUpdate, onDelete) => {
  const channel = supabase
    .channel(`pedidos-cliente-${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'pedidos',
      filter: `cliente_id=eq.${userId}`,
    }, payload => onInsert?.(payload.new))
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'pedidos',
      filter: `cliente_id=eq.${userId}`,
    }, payload => onUpdate?.(payload.new))
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'pedidos',
      filter: `cliente_id=eq.${userId}`,
    }, payload => onDelete?.(payload.old))
    .subscribe();

  return channel;
};

/**
 * Remove um channel Realtime.
 */
export const unsubscribeChannel = (channel) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};
