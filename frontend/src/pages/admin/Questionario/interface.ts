export interface IQuestionario {
  id: number
  nome: string
  email: string
  whatsapp: string
  instagram: string
  experienciaEdicao: string // SIM ou NÃO
  experienciaMotionGraphics: string // SIM ou NÃO
  computador: string
  programaEdicao: string
  trabalhosAnteriores: string
  habilidades: string
  portfolio: string
  disponibilidadeImediata: string // SIM ou NÃO
  pretensaoSalarial: number
  disponibilidadeTempo: string
  createdAt: Date
  updatedAt: Date
}
