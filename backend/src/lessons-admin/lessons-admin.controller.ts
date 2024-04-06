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
  UseInterceptors,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { LessonsAdminService } from './lessons-admin.service';
import { CreateLessonAdminDTO } from './dto/create-lessons-admin.dto';
import { UpdateLessonsAdminDto } from './dto/update-lessons-admin.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { PostResponse } from 'src/utils/post-response.dto';
import { GetLessonResponse } from './dto/lessons-response.dto';

@Controller('lessons-admin')
export class LessonsAdminController {
  constructor(private readonly lessonsAdminService: LessonsAdminService) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.lessonsAdminService.createFile(file, +id);

    return { success: true };
  }

  @ApiResponse({ type: PostResponse, status: 201 })
  @Post()
  async create(
    @Body() createLessonsAdminDto: CreateLessonAdminDTO,
  ): Promise<PostResponse> {
    const lesson = await this.lessonsAdminService.create(createLessonsAdminDto);
    return {
      id: lesson.id,
      success: true,
    };
  }

  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'subModuleId', required: true, type: Number })
  @Get()
  findAll(
    @Query('subModuleId') subModuleId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('title') title?: string,
  ) {
    return this.lessonsAdminService.findAll({
      page,
      per_page,
      subModuleId: subModuleId ? +subModuleId : undefined,
      title,
    });
  }

  @ApiResponse({ type: GetLessonResponse, status: 200 })
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
