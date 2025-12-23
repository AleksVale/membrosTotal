import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { EnrollmentResponseDto } from '../../../application/training/dto/enrollment-response.dto';
import { BulkEnrollUsersUseCase } from '../../../application/training/use-cases/bulk-enroll-users.use-case';
import { BulkUnenrollUsersUseCase } from '../../../application/training/use-cases/bulk-unenroll-users.use-case';
import { DeleteEnrollmentUseCase } from '../../../application/training/use-cases/delete-enrollment.use-case';
import { ListAllEnrollmentsUseCase } from '../../../application/training/use-cases/list-all-enrollments.use-case';
import { ListTrainingEnrollmentsUseCase } from '../../../application/training/use-cases/list-training-enrollments.use-case';
import { ListUserEnrollmentsUseCase } from '../../../application/training/use-cases/list-user-enrollments.use-case';
import { UnenrollUserUseCase } from '../../../application/training/use-cases/unenroll-user.use-case';
import {
    ApiAdminOnlyResponses,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
} from '../../../common/decorators/api-responses.decorator';
import { BulkEnrollRequestDto } from '../dto/bulk-enroll-request.dto';
import { BulkUnenrollRequestDto } from '../dto/bulk-unenroll-request.dto';

@ApiTags('Enrollment Management')
@Controller()
export class EnrollmentController {
  constructor(
    private readonly listAllEnrollmentsUseCase: ListAllEnrollmentsUseCase,
    private readonly listTrainingEnrollmentsUseCase: ListTrainingEnrollmentsUseCase,
    private readonly listUserEnrollmentsUseCase: ListUserEnrollmentsUseCase,
    private readonly deleteEnrollmentUseCase: DeleteEnrollmentUseCase,
    private readonly unenrollUserUseCase: UnenrollUserUseCase,
    private readonly bulkEnrollUsersUseCase: BulkEnrollUsersUseCase,
    private readonly bulkUnenrollUsersUseCase: BulkUnenrollUsersUseCase,
  ) {}

  @Get('enrollments')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List all enrollments (Admin only)',
    description: 'Returns all enrollments across all users and trainings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
    type: [EnrollmentResponseDto],
  })
  @ApiAdminOnlyResponses({})
  async listAllEnrollments(): Promise<EnrollmentResponseDto[]> {
    return this.listAllEnrollmentsUseCase.execute();
  }

  @Get('trainings/:trainingId/enrollments')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List enrollments for a training (Admin only)',
    description: 'Returns all enrollments for a specific training.',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
    type: [EnrollmentResponseDto],
  })
  @ApiNotFoundResponse('Training', 'Training with id "xxx" not found')
  @ApiAdminOnlyResponses({})
  async listTrainingEnrollments(
    @Param('trainingId') trainingId: string,
  ): Promise<EnrollmentResponseDto[]> {
    return this.listTrainingEnrollmentsUseCase.execute(trainingId);
  }

  @Get('users/:userId/enrollments')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List enrollments for a user (Admin only)',
    description: 'Returns all enrollments for a specific user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
    type: [EnrollmentResponseDto],
  })
  @ApiAdminOnlyResponses({})
  async listUserEnrollments(
    @Param('userId') userId: string,
  ): Promise<EnrollmentResponseDto[]> {
    return this.listUserEnrollmentsUseCase.execute(userId);
  }

  @Delete('enrollments/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete enrollment by ID (Admin only)',
    description: 'Deletes an enrollment by its ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Enrollment deleted successfully',
  })
  @ApiNotFoundResponse('Enrollment', 'Enrollment with id "xxx" not found')
  @ApiAdminOnlyResponses({})
  async deleteEnrollment(@Param('id') id: string): Promise<void> {
    return this.deleteEnrollmentUseCase.execute(id);
  }

  @Delete('trainings/:trainingId/enrollments/:userId')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Unenroll user from training (Admin only)',
    description: 'Removes a user from a specific training.',
  })
  @ApiResponse({
    status: 204,
    description: 'User unenrolled successfully',
  })
  @ApiNotFoundResponse(
    'Training or Enrollment',
    'Training with id "xxx" not found or user is not enrolled',
  )
  @ApiAdminOnlyResponses({})
  async unenrollUser(
    @Param('trainingId') trainingId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.unenrollUserUseCase.execute(userId, trainingId);
  }

  @Post('trainings/:trainingId/enrollments/bulk')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Bulk enroll users (Admin only)',
    description:
      'Enrolls multiple users in a training. Already enrolled users are skipped (idempotent).',
  })
  @ApiResponse({
    status: 201,
    description: 'Users enrolled successfully',
    type: [EnrollmentResponseDto],
  })
  @ApiBadRequestResponse('Invalid user IDs')
  @ApiNotFoundResponse('Training', 'Training with id "xxx" not found')
  @ApiAdminOnlyResponses({})
  async bulkEnrollUsers(
    @Param('trainingId') trainingId: string,
    @Body() bulkEnrollDto: BulkEnrollRequestDto,
  ): Promise<EnrollmentResponseDto[]> {
    return this.bulkEnrollUsersUseCase.execute(
      trainingId,
      bulkEnrollDto.userIds,
    );
  }

  @Delete('trainings/:trainingId/enrollments/bulk')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk unenroll users (Admin only)',
    description:
      'Unenrolls multiple users from a training. Returns the count of deleted enrollments.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users unenrolled successfully',
    schema: {
      type: 'object',
      properties: {
        deletedCount: {
          type: 'number',
          description: 'Number of enrollments deleted',
          example: 5,
        },
      },
    },
  })
  @ApiBadRequestResponse('Invalid user IDs')
  @ApiNotFoundResponse('Training', 'Training with id "xxx" not found')
  @ApiAdminOnlyResponses({})
  async bulkUnenrollUsers(
    @Param('trainingId') trainingId: string,
    @Body() bulkUnenrollDto: BulkUnenrollRequestDto,
  ): Promise<{ deletedCount: number }> {
    const deletedCount = await this.bulkUnenrollUsersUseCase.execute(
      trainingId,
      bulkUnenrollDto.userIds,
    );
    return { deletedCount };
  }
}
