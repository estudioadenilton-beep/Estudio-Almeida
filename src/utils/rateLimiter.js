/**
 * src/utils/rateLimiter.js
 * Rate limiter client-side para proteger fluxos críticos.
 *
 * POR QUE client-side?
 * Este projeto não tem servidor Node próprio (usa Supabase BaaS).
 * O rate limiting client-side é a primeira linha de defesa:
 * - Previne cliques acidentais e loops de retry
 * - Bloqueia ataques de força bruta básicos via browser
 * - Complementado por Rate Limiting do Supabase (server-side, automático)
 *
 * IMPORTANTE: Rate limiting client-side é bypassável por atacantes avançados.
 * Para proteção real contra bots, usar Supabase Auth rate limits + CAPTCHA.
 *
 * Estratégia: sliding window com persistência em sessionStorage.
 * sessionStorage é limpo ao fechar a aba (mais seguro que localStorage).
 */

// ─── Configurações padrão ──────────────────────────────────────────────────────

/** @typedef {{ maxAttempts: number, windowMs: number, blockDurationMs: number }} RateLimitConfig */

/** @type {Record<string, RateLimitConfig>} */
export const RATE_LIMIT_CONFIGS = {
  // Login: máx 5 tentativas em 2 minutos, bloqueio por 10 minutos
  login: {
    maxAttempts: 5,
    windowMs: 2 * 60 * 1000,       // 2 min
    blockDurationMs: 10 * 60 * 1000, // 10 min
  },
  // Cadastro: máx 3 tentativas em 5 minutos
  cadastro: {
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000,
  },
  // Reset de senha: máx 3 tentativas em 10 minutos
  resetSenha: {
    maxAttempts: 3,
    windowMs: 10 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
  },
  // Admin: máx 3 tentativas em 5 minutos, bloqueio por 30 minutos
  adminVerify: {
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
  },
};

// ─── Internals ────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'rl_';

const getStorageKey = (action) => `${STORAGE_PREFIX}${action}`;

/** @returns {{ attempts: number[], blockedUntil: number|null }} */
const getState = (action) => {
  try {
    const raw = sessionStorage.getItem(getStorageKey(action));
    if (!raw) return { attempts: [], blockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { attempts: [], blockedUntil: null };
  }
};

const setState = (action, state) => {
  try {
    sessionStorage.setItem(getStorageKey(action), JSON.stringify(state));
  } catch {
    // sessionStorage pode estar cheio ou desabilitado (modo privado restrito)
  }
};

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Verifica se uma ação está bloqueada por rate limit.
 * @param {string} action - Identificador da ação ('login', 'cadastro', etc.)
 * @returns {{ blocked: boolean, remainingMs: number, remainingAttempts: number }}
 */
export const checkRateLimit = (action) => {
  const config = RATE_LIMIT_CONFIGS[action];
  if (!config) return { blocked: false, remainingMs: 0, remainingAttempts: Infinity };

  const now = Date.now();
  const state = getState(action);

  // Verifica bloqueio ativo
  if (state.blockedUntil && now < state.blockedUntil) {
    return {
      blocked: true,
      remainingMs: state.blockedUntil - now,
      remainingAttempts: 0,
    };
  }

  // Limpa bloqueio expirado
  if (state.blockedUntil && now >= state.blockedUntil) {
    setState(action, { attempts: [], blockedUntil: null });
    return { blocked: false, remainingMs: 0, remainingAttempts: config.maxAttempts };
  }

  // Filtra tentativas dentro da janela de tempo
  const windowStart = now - config.windowMs;
  const recentAttempts = state.attempts.filter(ts => ts > windowStart);

  return {
    blocked: false,
    remainingMs: 0,
    remainingAttempts: Math.max(0, config.maxAttempts - recentAttempts.length),
  };
};

/**
 * Registra uma tentativa de ação e atualiza o estado do rate limiter.
 * @param {string} action - Identificador da ação
 * @returns {{ blocked: boolean, remainingMs: number, remainingAttempts: number }}
 */
export const recordAttempt = (action) => {
  const config = RATE_LIMIT_CONFIGS[action];
  if (!config) return { blocked: false, remainingMs: 0, remainingAttempts: Infinity };

  const now = Date.now();
  const state = getState(action);

  // Verifica bloqueio ativo antes de registrar
  if (state.blockedUntil && now < state.blockedUntil) {
    return {
      blocked: true,
      remainingMs: state.blockedUntil - now,
      remainingAttempts: 0,
    };
  }

  // Filtra tentativas dentro da janela
  const windowStart = now - config.windowMs;
  const recentAttempts = state.attempts.filter(ts => ts > windowStart);
  recentAttempts.push(now);

  // Verifica se excedeu o limite
  if (recentAttempts.length >= config.maxAttempts) {
    const blockedUntil = now + config.blockDurationMs;
    setState(action, { attempts: recentAttempts, blockedUntil });
    return {
      blocked: true,
      remainingMs: config.blockDurationMs,
      remainingAttempts: 0,
    };
  }

  setState(action, { attempts: recentAttempts, blockedUntil: null });
  return {
    blocked: false,
    remainingMs: 0,
    remainingAttempts: config.maxAttempts - recentAttempts.length,
  };
};

/**
 * Reseta o rate limit de uma ação (usar após login bem-sucedido).
 * @param {string} action
 */
export const resetRateLimit = (action) => {
  try {
    sessionStorage.removeItem(getStorageKey(action));
  } catch { /* silencia */ }
};

/**
 * Formata o tempo restante de bloqueio em formato legível.
 * @param {number} ms - Milissegundos
 * @returns {string} Ex: "8 minutos e 30 segundos"
 */
export const formatRemainingTime = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
  if (seconds === 0) return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  return `${minutes} minuto${minutes !== 1 ? 's' : ''} e ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
};
