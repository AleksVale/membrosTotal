import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { CreateLessonDto } from '../../../application/training/dto/create-lesson.dto';
import { LessonResponseDto } from '../../../application/training/dto/lesson-response.dto';
import { CreateLessonUseCase } from '../../../application/training/use-cases/create-lesson.use-case';
import { GetLessonUseCase } from '../../../application/training/use-cases/get-lesson.use-case';
import { GetLessonsBySubModuleUseCase } from '../../../application/training/use-cases/get-lessons-by-sub-module.use-case';
import {
    ApiAdminOnlyResponses,
    ApiBadRequestResponse,
    ApiConflictResponse,
} from '../../../common/decorators/api-responses.decorator';
import { CreateLessonRequestDto } from '../dto/create-lesson-request.dto';

@ApiTags('Training Lessons')
@Controller()
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly getLessonUseCase: GetLessonUseCase,
    private readonly getLessonsBySubModuleUseCase: GetLessonsBySubModuleUseCase,
  ) {}

  @Post('submodules/:subModuleId/lessons')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new lesson for a submodule (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Lesson created successfully',
    type: LessonResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse(
    'A lesson with this order already exists in this submodule',
  )
  @ApiAdminOnlyResponses({
    notFoundResource: 'SubModule',
    notFoundMessage: 'SubModule with id "xxx" not found',
  })
  async createLesson(
    @Param('subModuleId') subModuleId: string,
    @Body() createDto: CreateLessonRequestDto,
  ): Promise<LessonResponseDto> {
    const applicationDto = new CreateLessonDto({
      title: createDto.title,
      description: createDto.description,
      order: createDto.order,
      videoUrl: createDto.videoUrl,
      videoProvider: createDto.videoProvider,
      duration: createDto.duration,
      subModuleId,
    });

    return this.createLessonUseCase.execute(subModuleId, applicationDto);
  }

  @Get('lessons/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get lesson by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lesson retrieved successfully',
    type: LessonResponseDto,
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'Lesson',
    notFoundMessage: 'Lesson with id "xxx" not found',
  })
  async getLesson(@Param('id') id: string): Promise<LessonResponseDto> {
    return this.getLessonUseCase.execute(id);
  }

  @Get('submodules/:subModuleId/lessons')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all lessons for a submodule (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lessons retrieved successfully',
    type: [LessonResponseDto],
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'SubModule',
    notFoundMessage: 'SubModule with id "xxx" not found',
  })
  async getLessonsBySubModule(
    @Param('subModuleId') subModuleId: string,
  ): Promise<LessonResponseDto[]> {
    return this.getLessonsBySubModuleUseCase.execute(subModuleId);
  }
}
