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
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { TrainingModulesAdminService } from './training-modules-admin.service';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { GetModuleResponse, ModuleDTO } from './dto/module-response.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostResponse } from 'src/utils/post-response.dto';
import { AddPermissionAdminDTO } from 'src/sub-modules-admin/dto/add-permissions-subModule-training.dto';

@Controller('training-modules-admin')
export class TrainingModulesAdminController {
  constructor(
    private readonly trainingModulesAdminService: TrainingModulesAdminService,
  ) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.trainingModulesAdminService.createFile(file, +id);

    return { success: true };
  }

  @ApiResponse({ type: PostResponse, status: 201 })
  @Post()
  async create(@Body() createTrainingModulesAdminDto: CreateModuleAdminDTO) {
    const module = await this.trainingModulesAdminService.create(
      createTrainingModulesAdminDto,
    );
    return {
      id: module.id,
      success: true,
    };
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
    @Query('trainingId') trainingId: number,
    @Query('title') title?: string,
  ) {
    return this.trainingModulesAdminService.findAll({
      page,
      per_page,
      trainingId: trainingId ? +trainingId : undefined,
      title,
    });
  }

  @ApiResponse({ status: 200, type: GetModuleResponse })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingModulesAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    const entity = { ...updateTrainingModulesAdminDto, file: undefined };
    return this.trainingModulesAdminService.update(+id, entity);
  }

  @ApiResponse({ status: 200, type: SuccessResponse })
  @Patch('permissions/:id')
  async addPermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddPermissionAdminDTO,
  ): Promise<SuccessResponse> {
    await this.trainingModulesAdminService.addPermission(id, body);
    return { success: true };
  }
}
