import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from 'class-validator';

export class CreateLessonRequestDto {
  @ApiProperty({
    description: 'Lesson title',
    example: 'Introduction to NestJS',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Lesson description',
    required: false,
    example: 'Learn the basics of NestJS framework',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Lesson order in submodule',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    description: 'Video URL for the lesson',
    required: false,
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({
    description: 'Video provider type',
    example: 'youtube',
    enum: ['s3', 'cloudflare', 'youtube', 'external'],
  })
  @IsEnum(['s3', 'cloudflare', 'youtube', 'external'])
  videoProvider: string;

  @ApiProperty({
    description: 'Lesson duration in seconds',
    example: 3600,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  duration: number;
}
