import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { LessonCollaboratorRepository } from './lessons-collaborator.repository';

@Injectable()
export class LessonCollaboratorService {
  constructor(
    private readonly lessonCollaboratorRepository: LessonCollaboratorRepository,
  ) {}

  async findAll(user: TokenPayload, moduleId?: number) {
    const result = await this.lessonCollaboratorRepository.findAll(
      user,
      moduleId,
    );
    return result;
  }
  async viewLesson(user: TokenPayload, lessonId: number) {
    const result = await this.lessonCollaboratorRepository.viewLesson(
      user,
      lessonId,
    );
    return result;
  }
}
