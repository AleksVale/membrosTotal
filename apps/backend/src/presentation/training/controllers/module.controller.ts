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
import { CreateModuleDto } from '../../../application/training/dto/create-module.dto';
import { ModuleResponseDto } from '../../../application/training/dto/module-response.dto';
import { UpdateModuleDto } from '../../../application/training/dto/update-module.dto';
import { CreateModuleUseCase } from '../../../application/training/use-cases/create-module.use-case';
import { GetModuleUseCase } from '../../../application/training/use-cases/get-module.use-case';
import { GetModulesByTrainingUseCase } from '../../../application/training/use-cases/get-modules-by-training.use-case';
import { ReorderModuleUseCase } from '../../../application/training/use-cases/reorder-module.use-case';
import { SoftDeleteModuleUseCase } from '../../../application/training/use-cases/soft-delete-module.use-case';
import { SwapModuleOrdersUseCase } from '../../../application/training/use-cases/swap-module-orders.use-case';
import { UpdateModuleUseCase } from '../../../application/training/use-cases/update-module.use-case';
import {
  ApiAdminOnlyResponses,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '../../../common/decorators/api-responses.decorator';
import { CreateModuleRequestDto } from '../dto/create-module-request.dto';
import { ReorderRequestDto } from '../dto/reorder-request.dto';
import { SwapOrdersRequestDto } from '../dto/swap-orders-request.dto';
import { UpdateModuleRequestDto } from '../dto/update-module-request.dto';

@ApiTags('Training Modules')
@Controller()
export class ModuleController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly getModuleUseCase: GetModuleUseCase,
    private readonly getModulesByTrainingUseCase: GetModulesByTrainingUseCase,
    private readonly updateModuleUseCase: UpdateModuleUseCase,
    private readonly softDeleteModuleUseCase: SoftDeleteModuleUseCase,
    private readonly reorderModuleUseCase: ReorderModuleUseCase,
    private readonly swapModuleOrdersUseCase: SwapModuleOrdersUseCase,
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
  @ApiBadRequestResponse()
  @ApiConflictResponse(
    'A module with this order already exists in this training',
  )
  @ApiAdminOnlyResponses({
    notFoundResource: 'Training',
    notFoundMessage: 'Training with id "xxx" not found',
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
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
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
  @ApiAdminOnlyResponses({
    notFoundResource: 'Training',
    notFoundMessage: 'Training with id "xxx" not found',
  })
  async getModulesByTraining(
    @Param('trainingId') trainingId: string,
  ): Promise<ModuleResponseDto[]> {
    return this.getModulesByTrainingUseCase.execute(trainingId);
  }

  @Patch('modules/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update module (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Module updated successfully',
    type: ModuleResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse(
    'A module with this order already exists in this training',
  )
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
  })
  async updateModule(
    @Param('id') id: string,
    @Body() updateDto: UpdateModuleRequestDto,
  ): Promise<ModuleResponseDto> {
    const applicationDto = new UpdateModuleDto({
      title: updateDto.title,
      description: updateDto.description,
      order: updateDto.order,
    });

    return this.updateModuleUseCase.execute(id, applicationDto);
  }

  @Delete('modules/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete module (Admin only)',
    description:
      'Soft deletes a module and all its submodules and lessons. Records are marked as deleted but not removed from the database.',
  })
  @ApiResponse({
    status: 204,
    description: 'Module soft deleted successfully',
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
  })
  async softDeleteModule(@Param('id') id: string): Promise<void> {
    return this.softDeleteModuleUseCase.execute(id);
  }

  @Patch('modules/:id/reorder')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Reorder module (Admin only)',
    description:
      'Move a module to a specific order position within its training. Other modules in the same training will be shifted accordingly.',
  })
  @ApiResponse({
    status: 200,
    description: 'Module reordered successfully',
    type: ModuleResponseDto,
  })
  @ApiBadRequestResponse('Invalid order position')
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
  })
  async reorderModule(
    @Param('id') id: string,
    @Body() reorderDto: ReorderRequestDto,
  ): Promise<ModuleResponseDto> {
    return this.reorderModuleUseCase.execute(id, reorderDto.newOrder);
  }

  @Patch('modules/swap-orders')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Swap module orders (Admin only)',
    description:
      'Swap the order positions of two modules. Modules must belong to the same training.',
  })
  @ApiResponse({
    status: 200,
    description: 'Module orders swapped successfully',
    type: [ModuleResponseDto],
  })
  @ApiBadRequestResponse('Invalid module IDs')
  @ApiConflictResponse('Modules must belong to the same training')
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
  })
  async swapModuleOrders(
    @Body() swapDto: SwapOrdersRequestDto,
  ): Promise<[ModuleResponseDto, ModuleResponseDto]> {
    return this.swapModuleOrdersUseCase.execute(swapDto.id1, swapDto.id2);
  }
}
