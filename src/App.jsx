/**
 * src/App.jsx — Roteamento principal com proteção Sentry ErrorBoundary.
 *
 * O ErrorBoundary do Sentry captura qualquer erro de render no React
 * e exibe uma UI de fallback ao invés de tela em branco.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import AboutContact from './pages/AboutContact';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import NovoPedido from './pages/NovoPedido';
import Pedido from './pages/Pedido';
import EsqueciSenha from './pages/EsqueciSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPedido from './pages/AdminPedido';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NotFound from './pages/NotFound';

// ─── Fallback de erro global ──────────────────────────────────────────────────
const ErrorFallback = ({ error, resetError }) => (
  <div
    role="alert"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: '#0f0f17',
      color: '#e5e5f0',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff6b6b' }}>
      Algo deu errado
    </h1>
    <p style={{ color: '#a0a0b0', marginBottom: '2rem', maxWidth: '400px' }}>
      Ocorreu um erro inesperado. Nossa equipe já foi notificada automaticamente.
    </p>
    {import.meta.env.DEV && (
      <pre style={{
        background: '#1a1a2e',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '0.75rem',
        color: '#ff6b6b',
        textAlign: 'left',
        maxWidth: '600px',
        overflow: 'auto',
        marginBottom: '2rem',
      }}>
        {error?.message}
      </pre>
    )}
    <button
      onClick={resetError}
      style={{
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      Tentar novamente
    </button>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      {/* ErrorBoundary do Sentry: captura erros de render e exibe fallback */}
      <Sentry.ErrorBoundary
        fallback={ErrorFallback}
        onError={(error, componentStack) => {
          // Log adicional em desenvolvimento
          if (import.meta.env.DEV) {
            console.error('[ErrorBoundary] Erro capturado:', error, componentStack);
          }
        }}
      >
        <Router>
          <Routes>
            {/* Rotas Públicas com Header e Footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/sobre-contato" element={<AboutContact />} />
            </Route>

            {/* Autenticação (Sem Header padrão) */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Rotas Protegidas (Dashboard do Cliente) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/novo-pedido" element={<NovoPedido />} />
              <Route path="/pedido/:id" element={<Pedido />} />
            </Route>

            {/* Rotas Protegidas (Painel do Estúdio / Admin) */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/pedido/:id" element={<AdminPedido />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Sentry.ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
