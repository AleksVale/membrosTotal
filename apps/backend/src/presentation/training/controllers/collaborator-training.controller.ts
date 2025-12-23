import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { TrainingResponseDto } from '../../../application/training/dto/training-response.dto';
import { GetEnrolledTrainingsUseCase } from '../../../application/training/use-cases/get-enrolled-trainings.use-case';
import { ApiUnauthorizedResponse } from '../../../common/decorators/api-responses.decorator';

@ApiTags('Collaborator Training')
@Controller('collaborator')
export class CollaboratorTrainingController {
  constructor(
    private readonly getEnrolledTrainingsUseCase: GetEnrolledTrainingsUseCase,
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
}
