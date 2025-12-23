import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { LessonResponseDto } from '../../../application/training/dto/lesson-response.dto';
import { ModuleResponseDto } from '../../../application/training/dto/module-response.dto';
import {
  ProgressResponseDto,
  TrainingProgressResponseDto,
} from '../../../application/training/dto/progress-response.dto';
import { SubModuleResponseDto } from '../../../application/training/dto/sub-module-response.dto';
import { TrainingResponseDto } from '../../../application/training/dto/training-response.dto';
import { GetEnrolledLessonProgressUseCase } from '../../../application/training/use-cases/get-enrolled-lesson-progress.use-case';
import { GetEnrolledLessonUseCase } from '../../../application/training/use-cases/get-enrolled-lesson.use-case';
import { GetEnrolledModuleSubModulesUseCase } from '../../../application/training/use-cases/get-enrolled-module-sub-modules.use-case';
import { GetEnrolledSubModuleLessonsUseCase } from '../../../application/training/use-cases/get-enrolled-sub-module-lessons.use-case';
import { GetEnrolledTrainingModulesUseCase } from '../../../application/training/use-cases/get-enrolled-training-modules.use-case';
import { GetEnrolledTrainingProgressUseCase } from '../../../application/training/use-cases/get-enrolled-training-progress.use-case';
import { GetEnrolledTrainingsUseCase } from '../../../application/training/use-cases/get-enrolled-trainings.use-case';
import { UpdateEnrolledLessonProgressUseCase } from '../../../application/training/use-cases/update-enrolled-lesson-progress.use-case';
import { WatchEnrolledLessonUseCase } from '../../../application/training/use-cases/watch-enrolled-lesson.use-case';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '../../../common/decorators/api-responses.decorator';
import { UpdateProgressRequestDto } from '../dto/update-progress-request.dto';

@ApiTags('Collaborator Training')
@Controller('collaborator')
export class CollaboratorTrainingController {
  constructor(
    private readonly getEnrolledTrainingsUseCase: GetEnrolledTrainingsUseCase,
    private readonly getEnrolledTrainingModulesUseCase: GetEnrolledTrainingModulesUseCase,
    private readonly getEnrolledModuleSubModulesUseCase: GetEnrolledModuleSubModulesUseCase,
    private readonly getEnrolledSubModuleLessonsUseCase: GetEnrolledSubModuleLessonsUseCase,
    private readonly getEnrolledLessonUseCase: GetEnrolledLessonUseCase,
    private readonly updateEnrolledLessonProgressUseCase: UpdateEnrolledLessonProgressUseCase,
    private readonly watchEnrolledLessonUseCase: WatchEnrolledLessonUseCase,
    private readonly getEnrolledLessonProgressUseCase: GetEnrolledLessonProgressUseCase,
    private readonly getEnrolledTrainingProgressUseCase: GetEnrolledTrainingProgressUseCase,
  ) {}

  @Get('trainings')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get enrolled trainings',
    description:
      'Returns list of trainings the current user is enrolled in (only published trainings)',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrolled trainings retrieved successfully',
    type: [TrainingResponseDto],
  })
  @ApiUnauthorizedResponse()
  async getEnrolledTrainings(
    @Session() session: UserSession,
  ): Promise<TrainingResponseDto[]> {
    return this.getEnrolledTrainingsUseCase.execute(session.user.id);
  }

  @Get('trainings/:trainingId/modules')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get modules for an enrolled training',
    description:
      'Returns list of modules for a training the current user is enrolled in. Requires enrollment and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Modules retrieved successfully',
    type: [ModuleResponseDto],
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse('Training', 'Training with id "xxx" not found')
  async getEnrolledTrainingModules(
    @Param('trainingId') trainingId: string,
    @Session() session: UserSession,
  ): Promise<ModuleResponseDto[]> {
    return this.getEnrolledTrainingModulesUseCase.execute(
      session.user.id,
      trainingId,
    );
  }

  @Get('modules/:moduleId/submodules')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get submodules for a module',
    description:
      'Returns list of submodules for a module. User must be enrolled in the training that contains this module, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Submodules retrieved successfully',
    type: [SubModuleResponseDto],
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse(
    'Module or Training',
    'Module with id "xxx" not found or Training not found',
  )
  async getEnrolledModuleSubModules(
    @Param('moduleId') moduleId: string,
    @Session() session: UserSession,
  ): Promise<SubModuleResponseDto[]> {
    return this.getEnrolledModuleSubModulesUseCase.execute(
      session.user.id,
      moduleId,
    );
  }

  @Get('submodules/:subModuleId/lessons')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get lessons for a submodule',
    description:
      'Returns list of lessons for a submodule. User must be enrolled in the training that contains this submodule, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lessons retrieved successfully',
    type: [LessonResponseDto],
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse(
    'SubModule, Module, or Training',
    'SubModule with id "xxx" not found, Module not found, or Training not found',
  )
  async getEnrolledSubModuleLessons(
    @Param('subModuleId') subModuleId: string,
    @Session() session: UserSession,
  ): Promise<LessonResponseDto[]> {
    return this.getEnrolledSubModuleLessonsUseCase.execute(
      session.user.id,
      subModuleId,
    );
  }

  @Get('lessons/:lessonId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get lesson details',
    description:
      'Get details for a specific lesson. User must be enrolled in the training containing this lesson, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson retrieved successfully',
    type: LessonResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse(
    'Lesson, SubModule, Module, or Training',
    'Lesson with id "xxx" not found, SubModule not found, Module not found, or Training not found',
  )
  async getEnrolledLesson(
    @Param('lessonId') lessonId: string,
    @Session() session: UserSession,
  ): Promise<LessonResponseDto> {
    return this.getEnrolledLessonUseCase.execute(
      session.user.id,
      lessonId,
    );
  }

  @Patch('lessons/:lessonId/progress')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update lesson progress',
    description:
      'Update lesson completion status. User must be enrolled in the training containing this lesson, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress updated successfully',
    type: ProgressResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse(
    'Lesson, SubModule, Module, or Training',
    'Lesson with id "xxx" not found, SubModule not found, Module not found, or Training not found',
  )
  async updateEnrolledLessonProgress(
    @Param('lessonId') lessonId: string,
    @Body() updateDto: UpdateProgressRequestDto,
    @Session() session: UserSession,
  ): Promise<ProgressResponseDto> {
    return this.updateEnrolledLessonProgressUseCase.execute(
      session.user.id,
      lessonId,
      updateDto.isCompleted,
    );
  }

  @Patch('lessons/:lessonId/watch')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Watch a lesson',
    description:
      'Track lesson viewing. Updates lastWatchedAt timestamp. Creates progress record if it does not exist. User must be enrolled in the training containing this lesson, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson watch tracked successfully',
    type: ProgressResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse(
    'Lesson, SubModule, Module, or Training',
    'Lesson with id "xxx" not found, SubModule not found, Module not found, or Training not found',
  )
  async watchEnrolledLesson(
    @Param('lessonId') lessonId: string,
    @Session() session: UserSession,
  ): Promise<ProgressResponseDto> {
    return this.watchEnrolledLessonUseCase.execute(
      session.user.id,
      lessonId,
    );
  }

  @Get('lessons/:lessonId/progress')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get progress for a lesson',
    description:
      'Get progress for a specific lesson. Returns null if no progress exists yet. User must be enrolled in the training containing this lesson, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lesson progress retrieved successfully. Returns null if no progress exists yet.',
    type: ProgressResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse(
    'Lesson, SubModule, Module, or Training',
    'Lesson with id "xxx" not found, SubModule not found, Module not found, or Training not found',
  )
  async getEnrolledLessonProgress(
    @Param('lessonId') lessonId: string,
    @Session() session: UserSession,
  ): Promise<ProgressResponseDto | null> {
    return this.getEnrolledLessonProgressUseCase.execute(
      session.user.id,
      lessonId,
    );
  }

  @Get('trainings/:trainingId/progress')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get progress for a training',
    description:
      'Get progress for all lessons in a training. Includes completion statistics. User must be enrolled in the training, and training must be published.',
  })
  @ApiResponse({
    status: 200,
    description: 'Training progress retrieved successfully',
    type: TrainingProgressResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse(
    'User is not enrolled in this training or training is not published',
  )
  @ApiNotFoundResponse('Training', 'Training with id "xxx" not found')
  async getEnrolledTrainingProgress(
    @Param('trainingId') trainingId: string,
    @Session() session: UserSession,
  ): Promise<TrainingProgressResponseDto> {
    return this.getEnrolledTrainingProgressUseCase.execute(
      session.user.id,
      trainingId,
    );
  }
}
