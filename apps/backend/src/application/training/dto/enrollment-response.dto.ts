import { TrainingResponseDto } from './training-response.dto';

export class EnrollmentResponseDto {
  id: string;
  userId: string;
  trainingId: string;
  enrolledAt: Date;
  training?: TrainingResponseDto;

  constructor(data: {
    id: string;
    userId: string;
    trainingId: string;
    enrolledAt: Date;
    training?: TrainingResponseDto;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.trainingId = data.trainingId;
    this.enrolledAt = data.enrolledAt;
    this.training = data.training;
  }
}
