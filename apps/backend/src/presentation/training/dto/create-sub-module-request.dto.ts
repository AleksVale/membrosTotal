import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSubModuleRequestDto {
  @ApiProperty({
    description: 'SubModule title',
    example: 'Advanced NestJS Concepts',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'SubModule description',
    required: false,
    example: 'Learn advanced patterns and techniques',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'SubModule order in module',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;
}
