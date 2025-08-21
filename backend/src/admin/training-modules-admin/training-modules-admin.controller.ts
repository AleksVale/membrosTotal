import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AddPermissionAdminDTO } from 'src/admin/sub-modules-admin/dto/add-permissions-subModule-training.dto';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { PostResponse } from 'src/utils/post-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { GetModuleResponse, ModuleDTO } from './dto/module-response.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { TrainingModulesAdminService } from './training-modules-admin.service';

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
    console.log('[DEBUG] Received module creation data:', createTrainingModulesAdminDto);
    console.log('[DEBUG] Data types:', {
      title: typeof createTrainingModulesAdminDto.title,
      description: typeof createTrainingModulesAdminDto.description,
      trainingId: typeof createTrainingModulesAdminDto.trainingId,
      order: typeof createTrainingModulesAdminDto.order,
    });
    
    try {
      const module = await this.trainingModulesAdminService.create(
        createTrainingModulesAdminDto,
      );
      return {
        id: module.id,
        success: true,
      };
    } catch (error) {
      console.error('[ERROR] Module creation failed:', error);
      throw error;
    }
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

  @ApiResponse({ status: 200 })
  @Get(':id/permissions')
  async getPermissions(@Param('id', ParseIntPipe) id: number) {
    return this.trainingModulesAdminService.getPermissions(id);
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

  @ApiResponse({ status: 200, type: SuccessResponse })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingModulesAdminService.delete(+id);
  }
}
