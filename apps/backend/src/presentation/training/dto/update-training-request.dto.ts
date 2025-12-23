import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdateTrainingRequestDto {
  @ApiProperty({
    description: 'Training title',
    example: 'Complete NestJS Course',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Training description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'complete-nestjs-course',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: 'Cover image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'Is published',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({
    description: 'Order for sorting',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
