import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { CreateSubModuleDto } from '../../../application/training/dto/create-sub-module.dto';
import { SubModuleResponseDto } from '../../../application/training/dto/sub-module-response.dto';
import { UpdateSubModuleDto } from '../../../application/training/dto/update-sub-module.dto';
import { CreateSubModuleUseCase } from '../../../application/training/use-cases/create-sub-module.use-case';
import { GetSubModuleUseCase } from '../../../application/training/use-cases/get-sub-module.use-case';
import { GetSubModulesByModuleUseCase } from '../../../application/training/use-cases/get-sub-modules-by-module.use-case';
import { SoftDeleteSubModuleUseCase } from '../../../application/training/use-cases/soft-delete-sub-module.use-case';
import { UpdateSubModuleUseCase } from '../../../application/training/use-cases/update-sub-module.use-case';
import {
  ApiAdminOnlyResponses,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '../../../common/decorators/api-responses.decorator';
import { CreateSubModuleRequestDto } from '../dto/create-sub-module-request.dto';
import { UpdateSubModuleRequestDto } from '../dto/update-sub-module-request.dto';

@ApiTags('Training SubModules')
@Controller()
export class SubModuleController {
  constructor(
    private readonly createSubModuleUseCase: CreateSubModuleUseCase,
    private readonly getSubModuleUseCase: GetSubModuleUseCase,
    private readonly getSubModulesByModuleUseCase: GetSubModulesByModuleUseCase,
    private readonly updateSubModuleUseCase: UpdateSubModuleUseCase,
    private readonly softDeleteSubModuleUseCase: SoftDeleteSubModuleUseCase,
  ) {}

  @Post('modules/:moduleId/submodules')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new submodule for a module (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'SubModule created successfully',
    type: SubModuleResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse(
    'A submodule with this order already exists in this module',
  )
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
  })
  async createSubModule(
    @Param('moduleId') moduleId: string,
    @Body() createDto: CreateSubModuleRequestDto,
  ): Promise<SubModuleResponseDto> {
    const applicationDto = new CreateSubModuleDto({
      title: createDto.title,
      description: createDto.description,
      order: createDto.order,
      moduleId,
    });

    return this.createSubModuleUseCase.execute(moduleId, applicationDto);
  }

  @Get('submodules/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get submodule by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'SubModule retrieved successfully',
    type: SubModuleResponseDto,
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'SubModule',
    notFoundMessage: 'SubModule with id "xxx" not found',
  })
  async getSubModule(@Param('id') id: string): Promise<SubModuleResponseDto> {
    return this.getSubModuleUseCase.execute(id);
  }

  @Get('modules/:moduleId/submodules')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all submodules for a module (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'SubModules retrieved successfully',
    type: [SubModuleResponseDto],
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'Module',
    notFoundMessage: 'Module with id "xxx" not found',
  })
  async getSubModulesByModule(
    @Param('moduleId') moduleId: string,
  ): Promise<SubModuleResponseDto[]> {
    return this.getSubModulesByModuleUseCase.execute(moduleId);
  }

  @Patch('submodules/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update submodule (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'SubModule updated successfully',
    type: SubModuleResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse(
    'A submodule with this order already exists in this module',
  )
  @ApiAdminOnlyResponses({
    notFoundResource: 'SubModule',
    notFoundMessage: 'SubModule with id "xxx" not found',
  })
  async updateSubModule(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubModuleRequestDto,
  ): Promise<SubModuleResponseDto> {
    const applicationDto = new UpdateSubModuleDto({
      title: updateDto.title,
      description: updateDto.description,
      order: updateDto.order,
    });

    return this.updateSubModuleUseCase.execute(id, applicationDto);
  }

  @Delete('submodules/:id')
  @Roles(['admin'])
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete submodule (Admin only)',
    description:
      'Soft deletes a submodule and all its lessons. Records are marked as deleted but not removed from the database.',
  })
  @ApiResponse({
    status: 204,
    description: 'SubModule soft deleted successfully',
  })
  @ApiAdminOnlyResponses({
    notFoundResource: 'SubModule',
    notFoundMessage: 'SubModule with id "xxx" not found',
  })
  async softDeleteSubModule(@Param('id') id: string): Promise<void> {
    return this.softDeleteSubModuleUseCase.execute(id);
  }
}
