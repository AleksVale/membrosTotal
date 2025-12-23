import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateModuleRequestDto {
  @ApiProperty({
    description: 'Module title',
    example: 'Fundamentals',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Module description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Module order in training',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
