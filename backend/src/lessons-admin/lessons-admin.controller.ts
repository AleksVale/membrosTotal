import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { LessonsAdminService } from './lessons-admin.service';
import { CreateLessonAdminDTO } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('lessons-admin')
export class LessonsAdminController {
  constructor(private readonly lessonsAdminService: LessonsAdminService) {}

  @Post()
  create(@Body() createLessonsAdminDto: CreateLessonAdminDTO) {
    return this.lessonsAdminService.create(createLessonsAdminDto);
  }

  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'subModuleId', required: true, type: Number })
  @Get()
  findAll(
    @Query('subModuleId', ParseIntPipe) subModuleId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('title') title?: string,
  ) {
    return this.lessonsAdminService.findAll({
      page,
      per_page,
      subModuleId,
      title,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonsAdminDto: UpdateLessonsAdminDto,
  ) {
    return this.lessonsAdminService.update(+id, updateLessonsAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsAdminService.remove(+id);
  }
}
