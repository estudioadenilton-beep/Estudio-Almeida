/**
 * src/utils/logger.js
 * Logger estruturado para o frontend do Estúdio Almeida.
 *
 * Por que um logger customizado?
 * - console.log/error não têm níveis, contexto ou formato padronizado
 * - Permite integração com Sentry sem acoplar código de negócio ao SDK
 * - JSON em produção é legível por ferramentas como Datadog, Logtail, etc.
 * - Em desenvolvimento, formata de forma legível no console do browser
 *
 * Níveis: debug < info < warn < error
 * Em produção, debug e info são silenciados para reduzir ruído.
 */

import { captureError, captureMessage, addBreadcrumb } from '@/lib/sentry';

// ─── Configuração ─────────────────────────────────────────────────────────────
const APP_ENV = import.meta.env?.VITE_APP_ENV || 'development';
const IS_PROD = APP_ENV === 'production';
const IS_TEST = APP_ENV === 'test';

// Níveis numéricos para filtragem
const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

// Em produção, só mostra warn e error no console. Em dev, mostra tudo.
const MIN_CONSOLE_LEVEL = IS_PROD ? LOG_LEVELS.warn : LOG_LEVELS.debug;

// ─── Formatação ───────────────────────────────────────────────────────────────
const formatTimestamp = () => new Date().toISOString();

/**
 * Formata a entrada de log como JSON (produção) ou string legível (dev).
 */
const formatEntry = (level, message, context = {}) => {
  const entry = {
    timestamp: formatTimestamp(),
    level,
    message,
    env: APP_ENV,
    ...context,
  };

  if (IS_PROD) {
    // JSON estruturado — legível por plataformas de log
    return JSON.stringify(entry);
  }

  // Formato legível para desenvolvimento
  const contextStr = Object.keys(context).length > 0
    ? `\n  ${JSON.stringify(context, null, 2).slice(1, -1).trim()}`
    : '';
  return `[${entry.timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

// ─── Saídas do console ────────────────────────────────────────────────────────
const consoleMethods = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

const writeToConsole = (level, formatted) => {
  if (IS_TEST) return; // Silencia durante testes
  if (LOG_LEVELS[level] < MIN_CONSOLE_LEVEL) return;
  consoleMethods[level]?.(formatted);
};

// ─── Logger principal ─────────────────────────────────────────────────────────
const createLogger = () => ({
  /**
   * Mensagens de diagnóstico — apenas em desenvolvimento.
   * Ex: estado de variável, resultado de cálculo intermediário.
   */
  debug(message, context = {}) {
    const formatted = formatEntry('debug', message, context);
    writeToConsole('debug', formatted);
  },

  /**
   * Eventos normais do sistema.
   * Ex: usuário logou, pedido criado, página navegada.
   */
  info(message, context = {}) {
    const formatted = formatEntry('info', message, context);
    writeToConsole('info', formatted);

    // Adiciona como breadcrumb no Sentry (rastro de ações)
    addBreadcrumb({
      category: context.category || 'app',
      message,
      level: 'info',
      data: context,
    });
  },

  /**
   * Situações incomuns mas recuperáveis.
   * Ex: dado ausente mas com fallback, retry automático.
   */
  warn(message, context = {}) {
    const formatted = formatEntry('warn', message, context);
    writeToConsole('warn', formatted);

    captureMessage(message, 'warning', context);

    addBreadcrumb({
      category: context.category || 'app',
      message,
      level: 'warning',
      data: context,
    });
  },

  /**
   * Erros que afetam a experiência do usuário.
   * Ex: falha em API, erro de autenticação, exceção não tratada.
   */
  error(message, error = null, context = {}) {
    const formatted = formatEntry('error', message, {
      ...context,
      errorMessage: error?.message,
      errorCode: error?.code,
    });
    writeToConsole('error', formatted);

    if (error instanceof Error) {
      captureError(error, { action: message, extra: context });
    } else {
      captureMessage(message, 'error', { ...context, error });
    }

    addBreadcrumb({
      category: context.category || 'error',
      message,
      level: 'error',
      data: { ...context, errorMessage: error?.message },
    });
  },

  // ── Helpers de domínio ──────────────────────────────────────────────────────

  /** Loga tentativa de autenticação (sem dados sensíveis). */
  auth(event, context = {}) {
    // Nunca loga senhas — apenas status e email parcial
    const safeContext = {
      ...context,
      category: 'auth',
      email: context.email ? `${context.email.split('@')[0][0]}***@${context.email.split('@')[1]}` : undefined,
    };
    delete safeContext.password;
    delete safeContext.secret;

    this.info(`[Auth] ${event}`, safeContext);
  },

  /** Loga operações de API (Supabase/Edge Functions). */
  api(method, resource, status, context = {}) {
    const level = status >= 400 ? 'error' : 'info';
    const message = `[API] ${method.toUpperCase()} ${resource} → ${status}`;

    if (level === 'error') {
      this.error(message, null, { ...context, category: 'api', status });
    } else {
      this.info(message, { ...context, category: 'api', status });
    }
  },
});

// ─── Exportação singleton ──────────────────────────────────────────────────────
export const logger = createLogger();

// ─── Exemplos de uso ──────────────────────────────────────────────────────────
// logger.auth('login_attempt', { email: 'user@test.com' });
// logger.auth('login_success', { userId: 'abc123', email: 'user@test.com' });
// logger.auth('login_failure', { email: 'user@test.com', reason: 'invalid_credentials' });
//
// logger.api('GET', '/pedidos', 200, { count: 5 });
// logger.api('POST', '/pedidos', 422, { error: 'Validation failed' });
//
// logger.info('Pedido criado com sucesso', { pedidoId: 'xyz', userId: 'abc' });
// logger.warn('Sessão próxima do vencimento', { expiresIn: '5min' });
// logger.error('Falha ao carregar pedidos', supabaseError, { userId: 'abc' });
