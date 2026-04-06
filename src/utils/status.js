/**
 * Utilitários de Status — Funções compartilhadas de UI para status de pedidos.
 * Antes duplicada em Dashboard.jsx e AdminDashboard.jsx.
 */

/**
 * Retorna classes Tailwind para coloração de badges de status.
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'aguardando':
      return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'em produção':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'concluído':
      return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    default:
      return 'text-secondary bg-secondary/10 border-secondary/20';
  }
};

/**
 * Retorna ícone emoji para cada status.
 */
export const getStatusEmoji = (status) => {
  switch (status?.toLowerCase()) {
    case 'aguardando': return '🟡';
    case 'em produção': return '🔵';
    case 'concluído': return '🟢';
    default: return '⚪';
  }
};

/**
 * Formata data para padrão brasileiro.
 */
export const formatDateBR = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

/**
 * Formata hora para exibição em chat.
 */
export const formatTimeBR = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
