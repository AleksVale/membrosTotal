import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { ApiProperty } from '@nestjs/swagger';

// Schema Zod para validação
const trainingStatsSchema = z.object({
  total: z.number({
    required_error: 'O total de treinamentos é obrigatório',
  }),
  students: z.number({
    required_error: 'O total de alunos é obrigatório',
  }),
  active: z.number({
    required_error: 'O total de treinamentos ativos é obrigatório',
  }),
  draft: z.number({
    required_error: 'O total de treinamentos em rascunho é obrigatório',
  }),
  archived: z.number({
    required_error: 'O total de treinamentos arquivados é obrigatório',
  }),
});

// DTO para resposta da API
export class TrainingStatsDto extends createZodDto(trainingStatsSchema) {
  @ApiProperty({ description: 'Número total de treinamentos' })
  total!: number;

  @ApiProperty({ description: 'Número total de estudantes matriculados em todos treinamentos' })
  students!: number;

  @ApiProperty({ description: 'Número de treinamentos ativos' })
  active!: number;

  @ApiProperty({ description: 'Número de treinamentos em rascunho' })
  draft!: number;

  @ApiProperty({ description: 'Número de treinamentos arquivados' })
  archived!: number;
}

// Schema Zod para estatísticas detalhadas de um treinamento específico
const trainingDetailStatsSchema = z.object({
  modules: z.number({
    required_error: 'O número de módulos é obrigatório',
  }),
  students: z.number({
    required_error: 'O número de alunos é obrigatório',
  }),
  completions: z.number({
    required_error: 'O número de conclusões é obrigatório',
  }),
  averageCompletionTime: z.number().optional(),
  completionRate: z.number().optional(),
});

// DTO para resposta detalhada de um treinamento específico
export class TrainingDetailStatsDto extends createZodDto(trainingDetailStatsSchema) {
  @ApiProperty({ description: 'Número total de módulos no treinamento' })
  modules!: number;

  @ApiProperty({ description: 'Número total de estudantes matriculados no treinamento' })
  students!: number;

  @ApiProperty({ description: 'Número de estudantes que concluíram o treinamento' })
  completions!: number;

  @ApiProperty({ description: 'Tempo médio de conclusão em dias', required: false })
  averageCompletionTime?: number;

  @ApiProperty({ description: 'Porcentagem de alunos que concluíram o treinamento', required: false })
  completionRate?: number;
}