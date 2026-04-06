/**
 * src/lib/sentry.js
 * Configuração centralizada do Sentry para o Estúdio Almeida.
 *
 * Inicialização:
 * - Chamado UMA VEZ em src/main.jsx, antes do React montar
 * - Environment-aware: só envia eventos em produção/staging
 * - Desabilitado em 'test' para não poluir o painel
 *
 * Uso nos componentes:
 *   import { captureError, captureMessage, addBreadcrumb } from '@/lib/sentry';
 */

import * as Sentry from '@sentry/react';

// ─── Configuração ─────────────────────────────────────────────────────────────
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0';

// Apenas captura eventos em produção e staging
const CAPTURE_ENVIRONMENTS = ['production', 'staging'];
const shouldCapture = CAPTURE_ENVIRONMENTS.includes(APP_ENV);

/**
 * Inicializa o Sentry. Deve ser chamado antes de qualquer render do React.
 * Chame em src/main.jsx.
 */
export const initSentry = () => {
  // Não inicializa em testes ou se não há DSN configurado
  if (!SENTRY_DSN || APP_ENV === 'test') {
    if (APP_ENV !== 'test') {
      console.warn('[Sentry] DSN não configurado. Erros NÃO serão capturados remotamente.');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    release: `estudio-almeida@${APP_VERSION}`,

    // ── Integrações ──────────────────────────────────────────────────────────
    integrations: [
      // Captura navegação entre rotas (React Router v6/v7)
      Sentry.browserTracingIntegration(),
      // Replay de sessão para reproduzir erros (1% prod, 100% em erros)
      Sentry.replayIntegration({
        maskAllText: true,     // Mascara texto para LGPD/GDPR
        blockAllMedia: false,
      }),
    ],

    // ── Sample Rates ─────────────────────────────────────────────────────────
    // 10% das transações de performance em produção (ajustar conforme volume)
    tracesSampleRate: APP_ENV === 'production' ? 0.1 : 1.0,
    // Replay: 1% de sessões normais, 100% de sessões com erro
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,

    // ── Filtragem de eventos ─────────────────────────────────────────────────
    beforeSend(event, hint) {
      // Não captura se o ambiente não requer
      if (!shouldCapture) return null;

      // Filtra erros de extensões de browser (não é bug da aplicação)
      const error = hint?.originalException;
      if (error?.stack?.includes('chrome-extension://')) return null;
      if (error?.stack?.includes('moz-extension://')) return null;

      // Filtra erros de rede genéricos (ex: usuário offline)
      if (error?.message?.includes('Failed to fetch')) {
        // Ainda captura mas com nível menor
        event.level = 'warning';
      }

      return event;
    },

    // ── PII / LGPD ───────────────────────────────────────────────────────────
    // Remove dados pessoais dos breadcrumbs e contextos
    sendDefaultPii: false,
  });

  console.info(`[Sentry] Inicializado para ambiente: ${APP_ENV}`);
};

// ─── Helpers de captura ───────────────────────────────────────────────────────

/**
 * Captura uma exceção com contexto adicional.
 * @param {Error} error - O erro a ser capturado
 * @param {object} context - Dados extras { userId, action, extra }
 */
export const captureError = (error, context = {}) => {
  if (APP_ENV === 'test') return;

  const { userId, action, extra = {} } = context;

  Sentry.withScope((scope) => {
    if (userId) scope.setUser({ id: userId });
    if (action) scope.setTag('action', action);
    scope.setExtras(extra);
    Sentry.captureException(error);
  });

  // Sempre loga no console (em dev, é o canal principal)
  if (APP_ENV !== 'production') {
    console.error(`[Sentry] Capturou erro${action ? ` em "${action}"` : ''}:`, error);
  }
};

/**
 * Captura uma mensagem informativa ou de aviso.
 * Útil para eventos inesperados que não são exceções.
 * @param {string} message - A mensagem
 * @param {'info'|'warning'|'error'} level - Nível de severidade
 * @param {object} extra - Dados extras
 */
export const captureMessage = (message, level = 'info', extra = {}) => {
  if (APP_ENV === 'test') return;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setExtras(extra);
    Sentry.captureMessage(message);
  });
};

/**
 * Adiciona um breadcrumb (rastro de ação do usuário).
 * Aparece no histórico de eventos no painel do Sentry.
 * @param {object} breadcrumb - { category, message, level }
 */
export const addBreadcrumb = (breadcrumb) => {
  if (APP_ENV === 'test') return;
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Associa um usuário autenticado aos eventos futuros.
 * Chame após login bem-sucedido.
 * @param {object|null} user - O objeto do usuário ou null (ao sair)
 */
export const setSentryUser = (user) => {
  if (APP_ENV === 'test') return;
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email });
  } else {
    Sentry.setUser(null);
  }
};

// Exporta o ErrorBoundary do Sentry para uso no App.jsx
export { Sentry };
