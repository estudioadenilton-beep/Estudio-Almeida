import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NovoPedido from '../../../pages/NovoPedido';
import { AuthProvider } from '../../../contexts/AuthContext';
import * as pedidosService from '../../../services/pedidos';

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 1 } } } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    }
  }
}));

vi.mock('../../../services/pedidos', () => ({
  createPedido: vi.fn().mockResolvedValue({ data: { id: 123 }, error: null }),
  updatePedido: vi.fn(),
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

describe('NovoPedido.jsx Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar validações Zod no envio incompleto do projeto', async () => {
    renderWithRouter(<NovoPedido />);
    
    // Tentando submeter sem título do projeto
    fireEvent.submit(screen.getByRole('button', { name: /solicitar proposta/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Dê um título ao seu projeto')).toBeInTheDocument();
    });
    
    expect(pedidosService.createPedido).not.toHaveBeenCalled();
  });
  
  it('deve submeter o pedido corretamente quando campos válidos e preenchidos', async () => {
    renderWithRouter(<NovoPedido />);
    
    fireEvent.change(screen.getByPlaceholderText(/Ex: Comercial Supermercado Verão 2024/), { target: { value: 'Comercial Teste' } });
    
    // Submetendo
    fireEvent.submit(screen.getByRole('button', { name: /solicitar proposta/i }));
    
    await waitFor(() => {
      expect(pedidosService.createPedido).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: 'Comercial Teste',
          servico: 'Voice-Over', // Default
        })
      );
    });
  });
});
