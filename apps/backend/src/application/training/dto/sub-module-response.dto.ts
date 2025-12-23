import { ApiProperty } from '@nestjs/swagger';

export class SubModuleResponseDto {
  @ApiProperty({
    description: 'SubModule unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'SubModule title',
    example: 'Advanced NestJS Concepts',
  })
  title: string;

  @ApiProperty({
    description: 'SubModule description',
    example: 'Learn advanced patterns and techniques',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'SubModule order in module',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Module ID this submodule belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  moduleId: string;

  @ApiProperty({
    description: 'SubModule creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'SubModule last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    moduleId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.moduleId = data.moduleId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
