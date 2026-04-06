/**
 * src/main.jsx — Entry point da aplicação.
 *
 * Ordem crítica:
 * 1. Sentry DEVE ser inicializado ANTES do React para capturar erros de boot
 * 2. AuthProvider envolve toda a árvore de componentes
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { initSentry } from './lib/sentry.js';
import './index.css';

// ─── Sentry — inicializa antes do React ──────────────────────────────────────
initSentry();

// ─── Renderização ─────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
