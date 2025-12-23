import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepositoryInterface } from '../../../domain/training/repositories/enrollment.repository.interface';

@Injectable()
export class DeleteEnrollmentUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id "${id}" not found`);
    }

    await this.enrollmentRepository.delete(id);
  }
}
