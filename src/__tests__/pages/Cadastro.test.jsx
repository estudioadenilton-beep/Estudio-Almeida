import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cadastro from '../../pages/Cadastro';
import { supabase } from '../../lib/supabase';
import { AuthProvider } from '../../contexts/AuthContext';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
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

describe('Cadastro.jsx Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar validações Zod no submit de cadastro (senha forte e senhas iguais)', async () => {
    renderWithRouter(<Cadastro />);
    
    fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), { target: { value: 'João' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: 11988887777'), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'joao@test.com' } });
    
    // Senha fraca
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: '123' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: '123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrando|finalizar/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Senha deve ter no mínimo 8 caracteres')).toBeInTheDocument();
    });

    // Senhas diferentes
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: 'SenhaForte123' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: 'SenhaDiferente1' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrando|finalizar/i }));
    
    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });
    
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });
});
