import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { CreateLessonDto } from '../../../application/training/dto/create-lesson.dto';
import { LessonResponseDto } from '../../../application/training/dto/lesson-response.dto';
import { UpdateLessonDto } from '../../../application/training/dto/update-lesson.dto';
import { CreateLessonUseCase } from '../../../application/training/use-cases/create-lesson.use-case';
import { GetLessonUseCase } from '../../../application/training/use-cases/get-lesson.use-case';
import { GetLessonsBySubModuleUseCase } from '../../../application/training/use-cases/get-lessons-by-sub-module.use-case';
import { ReorderLessonUseCase } from '../../../application/training/use-cases/reorder-lesson.use-case';
import { SoftDeleteLessonUseCase } from '../../../application/training/use-cases/soft-delete-lesson.use-case';
import { SwapLessonOrdersUseCase } from '../../../application/training/use-cases/swap-lesson-orders.use-case';
import { UpdateLessonUseCase } from '../../../application/training/use-cases/update-lesson.use-case';
import {
  ApiAdminOnlyResponses,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '../../../common/decorators/api-responses.decorator';
import { CreateLessonRequestDto } from '../dto/create-lesson-request.dto';
import { ReorderRequestDto } from '../dto/reorder-request.dto';
import { SwapOrdersRequestDto } from '../dto/swap-orders-request.dto';
import { UpdateLessonRequestDto } from '../dto/update-lesson-request.dto';

@ApiTags('Training Lessons')
@Controller()
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly getLessonUseCase: GetLessonUseCase,
    private readonly getLessonsBySubModuleUseCase: GetLessonsBySubModuleUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
    private readonly softDeleteLessonUseCase: SoftDeleteLessonUseCase,
    private readonly reorderLessonUseCase: ReorderLessonUseCase,
    private readonly swapLessonOrdersUseCase: SwapLessonOrdersUseCase,
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

  @Patch('lessons/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update lesson (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lesson updated successfully',
    type: LessonResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse(
    'A lesson with this order already exists in this submodule',
  )
  @ApiAdminOnlyResponses({
    notFoundResource: 'Lesson',
    notFoundMessage: 'Lesson with id "xxx" not found',
  })
  async updateLesson(
    @Param('id') id: string,
    @Body() updateDto: UpdateLessonRequestDto,
  ): Promise<LessonResponseDto> {
    const applicationDto = new UpdateLessonDto({
      title: updateDto.title,
      description: updateDto.description,
      order: updateDto.order,
      videoUrl: updateDto.videoUrl,
      videoProvider: updateDto.videoProvider,
      duration: updateDto.duration,
    });

    return this.updateLessonUseCase.execute(id, applicationDto);
  }

  @Delete('lessons/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete lesson (Admin only)',
    description:
      'Soft deletes a lesson. The record is marked as deleted but not removed from the database.',
  })
  @ApiResponse({
    status: 204,
    description: 'Lesson soft deleted successfully',
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'Lesson',
    notFoundMessage: 'Lesson with id "xxx" not found',
  })
  async softDeleteLesson(@Param('id') id: string): Promise<void> {
    return this.softDeleteLessonUseCase.execute(id);
  }

  @Patch('lessons/:id/reorder')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Reorder lesson (Admin only)',
    description:
      'Move a lesson to a specific order position within its submodule. Other lessons in the same submodule will be shifted accordingly.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson reordered successfully',
    type: LessonResponseDto,
  })
  @ApiBadRequestResponse('Invalid order position')
  @ApiAdminOnlyResponses({
    notFoundResource: 'Lesson',
    notFoundMessage: 'Lesson with id "xxx" not found',
  })
  async reorderLesson(
    @Param('id') id: string,
    @Body() reorderDto: ReorderRequestDto,
  ): Promise<LessonResponseDto> {
    return this.reorderLessonUseCase.execute(id, reorderDto.newOrder);
  }

  @Patch('lessons/swap-orders')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Swap lesson orders (Admin only)',
    description:
      'Swap the order positions of two lessons. Lessons must belong to the same submodule.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson orders swapped successfully',
    type: [LessonResponseDto],
  })
  @ApiBadRequestResponse('Invalid lesson IDs')
  @ApiConflictResponse('Lessons must belong to the same submodule')
  @ApiAdminOnlyResponses({
    notFoundResource: 'Lesson',
    notFoundMessage: 'Lesson with id "xxx" not found',
  })
  async swapLessonOrders(
    @Body() swapDto: SwapOrdersRequestDto,
  ): Promise<[LessonResponseDto, LessonResponseDto]> {
    return this.swapLessonOrdersUseCase.execute(swapDto.id1, swapDto.id2);
  }
}
