/**
 * src/__tests__/utils/calcularStats.test.js
 * Testes unitários da função calcularStats do serviço de pedidos.
 *
 * Por que: função pura — ideal para cobertura completa de branches.
 */

import { describe, it, expect } from 'vitest';
import { calcularStats } from '@/services/pedidos';

describe('calcularStats()', () => {
  it('retorna zeros quando a lista está vazia', () => {
    const result = calcularStats([]);

    expect(result).toEqual({
      total: 0,
      aguardando: 0,
      producao: 0,
      concluido: 0,
    });
  });

  it('conta corretamente pedidos por status', () => {
    const pedidos = [
      { status: 'aguardando' },
      { status: 'aguardando' },
      { status: 'em produção' },
      { status: 'concluído' },
    ];

    const result = calcularStats(pedidos);

    expect(result.total).toBe(4);
    expect(result.aguardando).toBe(2);
    expect(result.producao).toBe(1);
    expect(result.concluido).toBe(1);
  });

  it('ignora pedidos com status desconhecido na contagem individual', () => {
    const pedidos = [
      { status: 'aguardando' },
      { status: 'cancelado' }, // status não mapeado
      { status: 'desconhecido' },
    ];

    const result = calcularStats(pedidos);

    // Total ainda conta todos os pedidos
    expect(result.total).toBe(3);
    // Mas os status desconhecidos não somam em nenhuma categoria específica
    expect(result.aguardando).toBe(1);
    expect(result.producao).toBe(0);
    expect(result.concluido).toBe(0);
  });

  it('trata corretamente lista com um único pedido de cada status', () => {
    const pedidos = [
      { status: 'aguardando' },
      { status: 'em produção' },
      { status: 'concluído' },
    ];

    const result = calcularStats(pedidos);

    expect(result).toEqual({
      total: 3,
      aguardando: 1,
      producao: 1,
      concluido: 1,
    });
  });

  it('é uma função pura — não muta o array de entrada', () => {
    const pedidos = [{ status: 'aguardando' }];
    const original = [...pedidos];

    calcularStats(pedidos);

    expect(pedidos).toEqual(original);
  });
});
