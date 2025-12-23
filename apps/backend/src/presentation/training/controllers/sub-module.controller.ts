import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { CreateSubModuleDto } from '../../../application/training/dto/create-sub-module.dto';
import { SubModuleResponseDto } from '../../../application/training/dto/sub-module-response.dto';
import { CreateSubModuleUseCase } from '../../../application/training/use-cases/create-sub-module.use-case';
import { GetSubModuleUseCase } from '../../../application/training/use-cases/get-sub-module.use-case';
import { GetSubModulesByModuleUseCase } from '../../../application/training/use-cases/get-sub-modules-by-module.use-case';
import {
  ApiAdminOnlyResponses,
  ApiBadRequestResponse,
} from '../../../common/decorators/api-responses.decorator';
import { CreateSubModuleRequestDto } from '../dto/create-sub-module-request.dto';

@ApiTags('Training SubModules')
@Controller()
export class SubModuleController {
  constructor(
    private readonly createSubModuleUseCase: CreateSubModuleUseCase,
    private readonly getSubModuleUseCase: GetSubModuleUseCase,
    private readonly getSubModulesByModuleUseCase: GetSubModulesByModuleUseCase,
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
}
