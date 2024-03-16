import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { ModuleDTO } from './dto/module-response.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('training-modules-admin')
export class TrainingModulesAdminController {
  constructor(
    private readonly trainingModulesAdminService: TrainingModulesAdminService,
  ) {}

  @Post()
  create(@Body() createTrainingModulesAdminDto: CreateModuleAdminDTO) {
    return this.trainingModulesAdminService.create(
      createTrainingModulesAdminDto,
    );
  }

  @ApiOkResponsePaginated(ModuleDTO)
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  @ApiQuery({ name: 'trainingId', required: true })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('trainingId', ParseIntPipe) trainingId: number,
    @Query('title') title?: string,
  ) {
    return this.trainingModulesAdminService.findAll({
      page,
      per_page,
      trainingId,
      title,
    });
  }

  @ApiResponse({ status: 200, type: ModuleDTO })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingModulesAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    return this.trainingModulesAdminService.update(
      +id,
      updateTrainingModulesAdminDto,
    );
  }
}
