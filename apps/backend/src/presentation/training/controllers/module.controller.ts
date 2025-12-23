import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { CreateModuleDto } from '../../../application/training/dto/create-module.dto';
import { ModuleResponseDto } from '../../../application/training/dto/module-response.dto';
import { CreateModuleUseCase } from '../../../application/training/use-cases/create-module.use-case';
import { GetModuleUseCase } from '../../../application/training/use-cases/get-module.use-case';
import { GetModulesByTrainingUseCase } from '../../../application/training/use-cases/get-modules-by-training.use-case';
import { CreateModuleRequestDto } from '../dto/create-module-request.dto';

@ApiTags('Training Modules')
@Controller()
export class ModuleController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly getModuleUseCase: GetModuleUseCase,
    private readonly getModulesByTrainingUseCase: GetModulesByTrainingUseCase,
  ) {}

  @Post('trainings/:trainingId/modules')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new module for a training (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Module created successfully',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Training not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Training with id "xxx" not found',
        },
      },
    },
  })
  async createModule(
    @Param('trainingId') trainingId: string,
    @Body() createDto: CreateModuleRequestDto,
  ): Promise<ModuleResponseDto> {
    const applicationDto = new CreateModuleDto({
      title: createDto.title,
      description: createDto.description,
      order: createDto.order,
      trainingId,
    });

    return this.createModuleUseCase.execute(trainingId, applicationDto);
  }

  @Get('modules/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get module by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Module retrieved successfully',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Module not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Module with id "xxx" not found' },
      },
    },
  })
  async getModule(@Param('id') id: string): Promise<ModuleResponseDto> {
    return this.getModuleUseCase.execute(id);
  }

  @Get('trainings/:trainingId/modules')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all modules for a training (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Modules retrieved successfully',
    type: [ModuleResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Training not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Training with id "xxx" not found',
        },
      },
    },
  })
  async getModulesByTraining(
    @Param('trainingId') trainingId: string,
  ): Promise<ModuleResponseDto[]> {
    return this.getModulesByTrainingUseCase.execute(trainingId);
  }
}
