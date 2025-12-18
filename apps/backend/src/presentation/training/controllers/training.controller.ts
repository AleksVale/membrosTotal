import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { CreateTrainingDto } from '../../../application/training/dto/create-training.dto';
import { EnrollmentResponseDto } from '../../../application/training/dto/enrollment-response.dto';
import {
  ProgressResponseDto,
  TrainingProgressResponseDto,
} from '../../../application/training/dto/progress-response.dto';
import { TrainingResponseDto } from '../../../application/training/dto/training-response.dto';
import { CreateTrainingUseCase } from '../../../application/training/use-cases/create-training.use-case';
import { EnrollInTrainingUseCase } from '../../../application/training/use-cases/enroll-in-training.use-case';
import { GetTrainingProgressUseCase } from '../../../application/training/use-cases/get-training-progress.use-case';
import { GetTrainingUseCase } from '../../../application/training/use-cases/get-training.use-case';
import { GetUserEnrollmentsUseCase } from '../../../application/training/use-cases/get-user-enrollments.use-case';
import { ListTrainingsUseCase } from '../../../application/training/use-cases/list-trainings.use-case';
import { UpdateLessonProgressUseCase } from '../../../application/training/use-cases/update-lesson-progress.use-case';
import { CreateTrainingRequestDto } from '../dto/create-training-request.dto';
import { UpdateProgressRequestDto } from '../dto/update-progress-request.dto';

@ApiTags('Training')
@Controller('trainings')
export class TrainingController {
  constructor(
    private readonly createTrainingUseCase: CreateTrainingUseCase,
    private readonly getTrainingUseCase: GetTrainingUseCase,
    private readonly listTrainingsUseCase: ListTrainingsUseCase,
    private readonly enrollInTrainingUseCase: EnrollInTrainingUseCase,
    private readonly getUserEnrollmentsUseCase: GetUserEnrollmentsUseCase,
    private readonly updateLessonProgressUseCase: UpdateLessonProgressUseCase,
    private readonly getTrainingProgressUseCase: GetTrainingProgressUseCase,
  ) {}

  @Post()
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new training (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Training created successfully',
    type: TrainingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 409,
    description: 'Training with this slug already exists',
  })
  async createTraining(
    @Body() createDto: CreateTrainingRequestDto,
  ): Promise<TrainingResponseDto> {
    const applicationDto = new CreateTrainingDto({
      title: createDto.title,
      description: createDto.description,
      slug: createDto.slug,
      imageUrl: createDto.imageUrl,
      published: createDto.published,
      order: createDto.order,
      modules: createDto.modules.map((m) => ({
        title: m.title,
        description: m.description,
        order: m.order,
        subModules: m.subModules.map((sm) => ({
          title: sm.title,
          description: sm.description,
          order: sm.order,
          lessons: sm.lessons.map((l) => ({
            title: l.title,
            description: l.description,
            order: l.order,
            videoUrl: l.videoUrl,
            videoProvider: l.videoProvider,
            duration: l.duration,
          })),
        })),
      })),
    });

    return this.createTrainingUseCase.execute(applicationDto);
  }

  @Get()
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all trainings (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of trainings',
    type: [TrainingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async listTrainings(): Promise<TrainingResponseDto[]> {
    return this.listTrainingsUseCase.execute();
  }

  @Get(':id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get training details (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Training details retrieved successfully',
    type: TrainingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Training not found' })
  async getTraining(
    @Param('id') id: string,
    @Query('includeHierarchy') includeHierarchy?: string,
  ): Promise<TrainingResponseDto> {
    const include = includeHierarchy === 'true';
    return this.getTrainingUseCase.execute(id, include);
  }

  @Post(':id/enroll')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enroll user in a training (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Successfully enrolled in training',
    type: EnrollmentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Training not found' })
  async enrollInTraining(
    @Param('id') trainingId: string,
    @Session() session: UserSession,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollInTrainingUseCase.execute(session.user.id, trainingId);
  }

  @Get('my/enrollments')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user enrollments (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User enrollments retrieved successfully',
    type: [EnrollmentResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getMyEnrollments(
    @Session() session: UserSession,
  ): Promise<EnrollmentResponseDto[]> {
    return this.getUserEnrollmentsUseCase.execute(session.user.id);
  }

  @Get(':id/progress')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user progress for a training (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Training progress retrieved successfully',
    type: TrainingProgressResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Training not found' })
  async getTrainingProgress(
    @Param('id') trainingId: string,
    @Session() session: UserSession,
  ): Promise<TrainingProgressResponseDto> {
    return this.getTrainingProgressUseCase.execute(session.user.id, trainingId);
  }

  @Patch('lessons/:lessonId/progress')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lesson progress (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress updated successfully',
    type: ProgressResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateLessonProgress(
    @Param('lessonId') lessonId: string,
    @Body() updateDto: UpdateProgressRequestDto,
    @Session() session: UserSession,
  ): Promise<ProgressResponseDto> {
    return this.updateLessonProgressUseCase.execute(
      session.user.id,
      lessonId,
      updateDto.isCompleted,
    );
  }
}
