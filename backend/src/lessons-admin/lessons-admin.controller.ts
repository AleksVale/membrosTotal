import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonsAdminService } from './lessons-admin.service';
import { CreateLessonsAdminDto } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';

@Controller('lessons-admin')
export class LessonsAdminController {
  constructor(private readonly lessonsAdminService: LessonsAdminService) {}

  @Post()
  create(@Body() createLessonsAdminDto: CreateLessonsAdminDto) {
    return this.lessonsAdminService.create(createLessonsAdminDto);
  }

  @Get()
  findAll() {
    return this.lessonsAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonsAdminDto: UpdateLessonsAdminDto) {
    return this.lessonsAdminService.update(+id, updateLessonsAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsAdminService.remove(+id);
  }
}
