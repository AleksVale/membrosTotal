import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubModulesAdminService } from './sub-modules-admin.service';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';

@Controller('sub-modules-admin')
export class SubModulesAdminController {
  constructor(
    private readonly subModulesAdminService: SubModulesAdminService,
  ) {}

  @Post()
  create(@Body() createSubModulesAdminDto: CreateSubModuleAdminDTO) {
    return this.subModulesAdminService.create(createSubModulesAdminDto);
  }

  @Get()
  findAll() {
    return this.subModulesAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subModulesAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubModulesAdminDto: UpdateSubModulesAdminDto,
  ) {
    return this.subModulesAdminService.update(+id, updateSubModulesAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subModulesAdminService.remove(+id);
  }
}
