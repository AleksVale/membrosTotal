import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ModuleResponseDto } from '../../../application/training/dto/module-response.dto';
import { TrainingResponseDto } from '../../../application/training/dto/training-response.dto';
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
}
