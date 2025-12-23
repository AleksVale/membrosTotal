import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from 'class-validator';

export class UpdateLessonRequestDto {
  @ApiProperty({
    description: 'Lesson title',
    example: 'Introduction to NestJS',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Lesson description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Lesson order in submodule',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiProperty({
    description: 'Video URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({
    description: 'Video provider type',
    example: 'youtube',
    enum: ['s3', 'cloudflare', 'youtube', 'external'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['s3', 'cloudflare', 'youtube', 'external'])
  videoProvider?: string;

  @ApiProperty({
    description: 'Lesson duration in seconds',
    example: 3600,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;
}
