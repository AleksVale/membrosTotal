import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';

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

  @Get()
  findAll() {
    return this.trainingModulesAdminService.findAll();
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingModulesAdminService.remove(+id);
  }
}
