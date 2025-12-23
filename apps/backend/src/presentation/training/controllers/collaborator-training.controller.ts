import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { LessonResponseDto } from '../../../application/training/dto/lesson-response.dto';
import { ModuleResponseDto } from '../../../application/training/dto/module-response.dto';
import { SubModuleResponseDto } from '../../../application/training/dto/sub-module-response.dto';
import { TrainingResponseDto } from '../../../application/training/dto/training-response.dto';
import { GetEnrolledModuleSubModulesUseCase } from '../../../application/training/use-cases/get-enrolled-module-sub-modules.use-case';
import { GetEnrolledSubModuleLessonsUseCase } from '../../../application/training/use-cases/get-enrolled-sub-module-lessons.use-case';
import { GetEnrolledTrainingModulesUseCase } from '../../../application/training/use-cases/get-enrolled-training-modules.use-case';
import { GetEnrolledTrainingsUseCase } from '../../../application/training/use-cases/get-enrolled-trainings.use-case';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '../../../common/decorators/api-responses.decorator';

@ApiTags('Collaborator Training')
@Controller('collaborator')
export class CollaboratorTrainingController {
  constructor(
    private readonly getEnrolledTrainingsUseCase: GetEnrolledTrainingsUseCase,
    private readonly getEnrolledTrainingModulesUseCase: GetEnrolledTrainingModulesUseCase,
    private readonly getEnrolledModuleSubModulesUseCase: GetEnrolledModuleSubModulesUseCase,
    private readonly getEnrolledSubModuleLessonsUseCase: GetEnrolledSubModuleLessonsUseCase,
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
}
