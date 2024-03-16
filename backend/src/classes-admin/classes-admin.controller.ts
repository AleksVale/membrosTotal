import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassesAdminService } from './classes-admin.service';
import { CreateClassesAdminDto } from './dto/create-classes-admin.dto';
import { UpdateClassesAdminDto } from './dto/update-classes-admin.dto';

@Controller('classes-admin')
export class ClassesAdminController {
  constructor(private readonly classesAdminService: ClassesAdminService) {}

  @Post()
  create(@Body() createClassesAdminDto: CreateClassesAdminDto) {
    return this.classesAdminService.create(createClassesAdminDto);
  }

  @Get()
  findAll() {
    return this.classesAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassesAdminDto: UpdateClassesAdminDto) {
    return this.classesAdminService.update(+id, updateClassesAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesAdminService.remove(+id);
  }
}
