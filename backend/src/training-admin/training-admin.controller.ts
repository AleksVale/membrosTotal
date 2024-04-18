import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { TrainingAdminService } from './training-admin.service';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { GetTrainingResponse, TrainingDTO } from './dto/training-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostResponse } from 'src/utils/post-response.dto';
import { AddPermissionAdminDTO } from 'src/sub-modules-admin/dto/add-permissions-subModule-training.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@ApiTags('Training-Admin')
@Controller('training-admin')
export class TrainingAdminController {
  constructor(private readonly trainingAdminService: TrainingAdminService) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.trainingAdminService.createFile(file, +id);

    return { success: true };
  }

  @ApiResponse({ type: PostResponse, status: 201 })
  @Post()
  async create(
    @Body() createTrainingAdminDto: CreateTrainingAdminDTO,
  ): Promise<PostResponse> {
    const training = await this.trainingAdminService.create(
      createTrainingAdminDto,
    );
    return {
      id: training.id,
      success: true,
    };
  }

  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  @ApiOkResponsePaginated(TrainingDTO)
  @Get()
  findAll(
    @Query('title') title: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
  ) {
    return this.trainingAdminService.findAll({
      title,
      page,
      per_page,
    });
  }

  @Get(':id')
  @ApiResponse({ type: GetTrainingResponse, status: 200 })
  findOne(@Param('id') id: string) {
    return this.trainingAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingAdminDto: UpdateTrainingAdminDto,
  ) {
    return this.trainingAdminService.update(+id, updateTrainingAdminDto);
  }

  @ApiResponse({ status: 200, type: SuccessResponse })
  @Patch('permissions/:id')
  async addPermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddPermissionAdminDTO,
  ): Promise<SuccessResponse> {
    await this.trainingAdminService.addPermission(id, body);
    return { success: true };
  }
}
