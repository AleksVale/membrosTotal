import { ApiProperty } from '@nestjs/swagger';

export class LessonResponseDto {
  @ApiProperty({
    description: 'Lesson unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Lesson title',
    example: 'Introduction to NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Lesson description',
    example: 'Learn the basics of NestJS framework',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Lesson order in submodule',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Video URL for the lesson',
    example: 'https://example.com/video.mp4',
    nullable: true,
  })
  videoUrl: string | null;

  @ApiProperty({
    description: 'Video provider type',
    example: 'youtube',
    enum: ['s3', 'cloudflare', 'youtube', 'external'],
  })
  videoProvider: string;

  @ApiProperty({
    description: 'Lesson duration in seconds',
    example: 3600,
  })
  duration: number;

  @ApiProperty({
    description: 'SubModule ID this lesson belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  subModuleId: string;

  @ApiProperty({
    description: 'Lesson creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Lesson last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    videoUrl: string | null;
    videoProvider: string;
    duration: number;
    subModuleId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.videoUrl = data.videoUrl;
    this.videoProvider = data.videoProvider;
    this.duration = data.duration;
    this.subModuleId = data.subModuleId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
