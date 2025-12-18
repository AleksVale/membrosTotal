export class ProgressResponseDto {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
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
  trainingId: string;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
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
