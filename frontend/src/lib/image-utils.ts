/**
 * Utilitário para gerenciar URLs de imagens no Cloudflare R2
 */

// Configuração base do bucket R2
const R2_BASE_URL = "https://pub-5d54aa14d19d48d4bac5298564dde31b.r2.dev";
const R2_BUCKET_PATH = "membros";

/**
 * Tipo de recurso para determinar o prefixo de caminho
 */
export type ImageResourceType =
  | "training"
  | "module"
  | "submodule"
  | "lesson"
  | "user"
  | "payment"
  | "refund"
  | "paymentRequest";

export function getImageUrl(
  path?: string | null,
  fallbackUrl?: string
): string | null {
  if (!path) return fallbackUrl || null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${R2_BASE_URL}/${R2_BUCKET_PATH}/${path}`;
}

/**
 * Gera uma URL para um recurso específico com base no tipo e ID
 *
 * @param resourceType - Tipo de recurso (training, module, etc)
 * @param id - ID do recurso
 * @param filename - Nome do arquivo (opcional)
 * @returns URL completa para o recurso
 */
export function getResourceImageUrl(
  resourceType: ImageResourceType,
  id: number | string,
  filename?: string
): string {
  const path = filename || `${resourceType}-${id}`;
  return getImageUrl(path)!;
}
