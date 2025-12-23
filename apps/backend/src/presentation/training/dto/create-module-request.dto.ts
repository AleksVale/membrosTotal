import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateModuleRequestDto {
  @ApiProperty({
    description: 'Module title',
    example: 'Introduction to NestJS',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Module description',
    required: false,
    example: 'Learn the fundamentals of NestJS framework',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Module order in training',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;
}
