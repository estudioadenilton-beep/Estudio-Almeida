/**
 * src/utils/validation.js
 * Schemas Zod centralizados para todos os formulários do Estúdio Almeida.
 *
 * Centralizar schemas aqui garante que:
 * - Validações são consistentes entre cliente e (futuro) servidor
 * - Mudanças nas regras de negócio têm um único ponto de edição
 * - Zod já está no package.json como dependência de produção
 *
 * Zod v4 API: https://zod.dev
 */

import { z } from 'zod';

// ─── Primitivos reutilizáveis ──────────────────────────────────────────────────

const emailSchema = z
  .string({ required_error: 'E-mail é obrigatório' })
  .email('Formato de e-mail inválido')
  .toLowerCase()
  .trim();

const senhaSchema = z
  .string({ required_error: 'Senha é obrigatória' })
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');

const senhaSimples = z
  .string({ required_error: 'Senha é obrigatória' })
  .min(6, 'Senha deve ter no mínimo 6 caracteres');

const nomeSchema = z
  .string({ required_error: 'Nome é obrigatório' })
  .min(2, 'Nome deve ter no mínimo 2 caracteres')
  .max(100, 'Nome muito longo')
  .trim();

// ─── 1. Login ─────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailSchema,
  senha: senhaSimples,
});

/** @typedef {z.infer<typeof loginSchema>} LoginFormData */

// ─── 2. Cadastro ──────────────────────────────────────────────────────────────
export const cadastroSchema = z
  .object({
    nome: nomeSchema,
    telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)'),
    email: emailSchema,
    senha: senhaSchema,
    confirmarSenha: z.string({ required_error: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

/** @typedef {z.infer<typeof cadastroSchema>} CadastroFormData */

// ─── 3. Esqueci Senha ─────────────────────────────────────────────────────────
export const esqueciSenhaSchema = z.object({
  email: emailSchema,
});

// ─── 4. Redefinir Senha ───────────────────────────────────────────────────────
export const redefinirSenhaSchema = z
  .object({
    novaSenha: senhaSchema,
    confirmarNovaSenha: z.string({ required_error: 'Confirmação é obrigatória' }),
  })
  .refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarNovaSenha'],
  });

// ─── 5. Admin Login (secret) ──────────────────────────────────────────────────
export const adminSecretSchema = z.object({
  secret: z
    .string({ required_error: 'Secret é obrigatória' })
    .min(8, 'Secret inválida')
    .max(512, 'Secret muito longa'),
});

// ─── 6. Novo Pedido ───────────────────────────────────────────────────────────
export const novoPedidoSchema = z.object({
  titulo: z.string().min(3, 'Dê um título ao seu projeto').max(200, 'Título muito longo'),
  servico: z.string().min(1, 'Selecione um serviço'),
  estilo_voz: z.string().optional(),
  texto_roteiro: z.string().optional(),
  texto_guia: z.string().optional(),
  descricao_producao: z.string().optional(),
  estilo_audio: z.string().optional(),
  observacoes_producao: z.string().optional(),
});

/** @typedef {z.infer<typeof novoPedidoSchema>} NovoPedidoFormData */

// ─── 7. Mensagem (chat) ───────────────────────────────────────────────────────
export const mensagemSchema = z.object({
  conteudo: z
    .string({ required_error: 'Mensagem não pode ser vazia' })
    .min(1, 'Mensagem não pode ser vazia')
    .max(2000, 'Mensagem muito longa (máximo 2000 caracteres)')
    .trim(),
});

// ─── 8. Atualização de Pedido (admin) ────────────────────────────────────────
export const updatePedidoSchema = z.object({
  status: z
    .enum(['aguardando', 'em produção', 'concluído'], {
      errorMap: () => ({ message: 'Status inválido' }),
    })
    .optional(),

  comentario_admin: z
    .string()
    .max(2000, 'Comentário muito longo')
    .optional()
    .nullable(),
});

// ─── Helper: validar e retornar erros formatados ──────────────────────────────
/**
 * Valida dados com um schema Zod e retorna resultado padronizado.
 * @param {z.ZodSchema} schema
 * @param {unknown} data
 * @returns {{ success: boolean, data?: object, errors?: Record<string, string> }}
 */
export const validate = (schema, data) => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Formata erros como { campo: 'mensagem' }
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join('.');
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
};
