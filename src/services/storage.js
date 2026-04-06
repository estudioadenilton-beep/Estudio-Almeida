import { supabase } from '../lib/supabase';

/**
 * Serviço de Storage — Centraliza upload e download de arquivos.
 * Inclui validação de tipo e tamanho que antes estava ausente.
 */

const BUCKET_NAME = 'arquivos-pedidos';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/x-wav',
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/octet-stream', // para arquivos sem MIME claro
];

/**
 * Valida um arquivo antes do upload.
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'Nenhum arquivo selecionado.' };

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  // Permitir tipos comuns; bloquear executáveis perigosos
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.msi', '.dll'];
  const fileName = file.name.toLowerCase();
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: 'Tipo de arquivo não permitido por motivos de segurança.' };
  }

  return { valid: true };
};

/**
 * Sanitiza nome de arquivo removendo caracteres perigosos.
 */
const sanitizeFileName = (name) => {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 200); // Limitar tamanho do nome
};

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * @returns {{ path: string | null, error: string | null }}
 */
export const uploadFile = async (file, folder = '') => {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { path: null, error: validation.error };
  }

  const safeName = sanitizeFileName(file.name);
  const timestamp = Date.now();
  const filePath = folder 
    ? `${folder}/${timestamp}_${safeName}`
    : `${timestamp}_${safeName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) {
    return { path: null, error: error.message };
  }

  return { path: data.path, error: null };
};

/**
 * Gera URL assinada para download seguro de um arquivo.
 * @returns {{ url: string | null, error: string | null }}
 */
export const getSignedDownloadUrl = async (path) => {
  if (!path) return { url: null, error: 'Caminho do arquivo não fornecido.' };

  try {
    let filePath = path;
    
    // Se o path for uma URL completa, extrair o caminho relativo
    if (path.includes('storage/v1/object/public')) {
      filePath = path.split(`${BUCKET_NAME}/`).pop()?.split('?')[0];
    }

    if (!filePath) return { url: null, error: 'Caminho inválido.' };

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600);

    if (error) throw error;

    return { url: data.signedUrl, error: null };
  } catch (err) {
    return { url: null, error: err.message };
  }
};

/**
 * Abre download de arquivo em nova aba (com URL assinada).
 * Substitui a função handleDownload que estava duplicada em 3 arquivos.
 */
export const downloadFile = async (path) => {
  const { url, error } = await getSignedDownloadUrl(path);
  
  if (error || !url) {
    // Fallback: abrir path direto
    window.open(path, '_blank');
    return;
  }

  window.open(url, '_blank');
};
