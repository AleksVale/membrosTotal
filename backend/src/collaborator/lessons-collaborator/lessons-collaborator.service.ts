import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { AwsService } from 'src/common/aws/aws.service';
import { LessonCollaboratorRepository } from './lessons-collaborator.repository';

@Injectable()
export class LessonCollaboratorService {
  constructor(
    private readonly lessonCollaboratorRepository: LessonCollaboratorRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAll(user: TokenPayload, moduleId?: number) {
    const result = await this.lessonCollaboratorRepository.findAll(
      user,
      moduleId,
    );
    const lessons = await Promise.all(
      result.map(async (lesson) => {
        if (lesson.thumbnail) {
          // const photo = await this.awsService.getStoredObject(lesson.thumbnail);
          return { ...lesson, thumbnail: undefined };
        }
        return lesson;
      }),
    );
    return lessons;
  }
}
