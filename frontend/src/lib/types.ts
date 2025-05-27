import { LucideIcon } from "lucide-react";

/**
 * Define um tipo para ícones que podem ser usados como componentes React
 * Isso permite passar ícones como props para componentes de UI
 */
export type IconType = LucideIcon;

/**
 * Interface para estatísticas genéricas com valores numéricos
 */
export interface StatData {
  title: string;
  value: number;
  icon: IconType;
}

/**
 * Tipos de status que podem ser usados na interface
 */
export type Status = "success" | "warning" | "error" | "info" | "default";

/**
 * Nomes para tamanhos de componentes e elementos
 */
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";