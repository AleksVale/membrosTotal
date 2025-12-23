import { ApiProperty } from '@nestjs/swagger';

export class ModuleResponseDto {
  @ApiProperty({
    description: 'Module unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Module title',
    example: 'Introduction to NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Module description',
    example: 'Learn the fundamentals of NestJS framework',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Module order in training',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Training ID this module belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  trainingId: string;

  @ApiProperty({
    description: 'Module creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Module last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    trainingId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.trainingId = data.trainingId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
