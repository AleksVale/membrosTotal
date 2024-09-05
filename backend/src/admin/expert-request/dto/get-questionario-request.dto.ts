import { ApiProperty } from '@nestjs/swagger';

export class QuestionarioResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'John Doe' })
  nome!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: '+5511999999999' })
  whatsapp!: string;

  @ApiProperty({ example: '@johndoe' })
  instagram!: string;

  @ApiProperty({ example: 'SIM' })
  experienciaEdicao!: string; // SIM ou NÃO

  @ApiProperty({ example: 'NÃO' })
  experienciaMotionGraphics!: string; // SIM ou NÃO

  @ApiProperty({ example: 'MacBook Pro' })
  computador!: string;

  @ApiProperty({ example: 'Adobe Premiere' })
  programaEdicao!: string;

  @ApiProperty({ example: 'Trabalhos anteriores em edição de vídeo' })
  trabalhosAnteriores!: string;

  @ApiProperty({ example: 'Edição de vídeo, Motion Graphics' })
  habilidades!: string;

  @ApiProperty({ example: 'https://portfolio.com/johndoe' })
  portfolio!: string;

  @ApiProperty({ example: 'SIM' })
  disponibilidadeImediata!: string; // SIM ou NÃO

  @ApiProperty({ example: 5000.0 })
  pretensaoSalarial!: number;

  @ApiProperty({ example: '40 horas por semana' })
  disponibilidadeTempo!: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  updatedAt!: Date;
}
