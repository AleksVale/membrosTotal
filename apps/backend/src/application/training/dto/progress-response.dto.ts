import { ApiProperty } from '@nestjs/swagger';

export class ProgressResponseDto {
  @ApiProperty({
    description: 'Progress unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Lesson ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  lessonId: string;

  @ApiProperty({
    description: 'Whether the lesson is completed',
    example: true,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Last time the lesson was watched',
    example: '2024-01-01T00:00:00.000Z',
  })
  lastWatchedAt: Date;

  constructor(data: {
    id: string;
    userId: string;
    lessonId: string;
    isCompleted: boolean;
    lastWatchedAt: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.lessonId = data.lessonId;
    this.isCompleted = data.isCompleted;
    this.lastWatchedAt = data.lastWatchedAt;
  }
}

export class TrainingProgressResponseDto {
  @ApiProperty({
    description: 'Training ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  trainingId: string;

  @ApiProperty({
    description: 'Total number of lessons in the training',
    example: 10,
  })
  totalLessons: number;

  @ApiProperty({
    description: 'Number of completed lessons',
    example: 5,
  })
  completedLessons: number;

  @ApiProperty({
    description: 'Completion percentage (0-100)',
    example: 50,
  })
  completionPercentage: number;

  @ApiProperty({
    description: 'List of progress records for all lessons in the training',
    type: [ProgressResponseDto],
  })
  progress: ProgressResponseDto[];

  constructor(data: {
    trainingId: string;
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
    progress: ProgressResponseDto[];
  }) {
    this.trainingId = data.trainingId;
    this.totalLessons = data.totalLessons;
    this.completedLessons = data.completedLessons;
    this.completionPercentage = data.completionPercentage;
    this.progress = data.progress;
  }
}
