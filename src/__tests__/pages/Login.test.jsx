import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../pages/Login';
import { supabase } from '../../../lib/supabase';
import { AuthProvider } from '../../../contexts/AuthContext';

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    }
  }
}));

const renderWithRouter = (ui) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Login.jsx Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar os campos de email e senha', () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('deve validar e-mail incorreto usando Zod sem chamar Supabase', async () => {
    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'emailinvalido' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    });
    
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('deve autenticar corretamente com dados válidos', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ 
      data: { user: { id: 1 } }, 
      error: null 
    });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'test@estudio.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'Senha@123' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@estudio.com',
        password: 'Senha@123'
      });
    });
  });
});
