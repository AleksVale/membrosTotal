import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSubModuleRequestDto {
  @ApiProperty({
    description: 'SubModule title',
    example: 'Getting Started',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'SubModule description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'SubModule order in module',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
