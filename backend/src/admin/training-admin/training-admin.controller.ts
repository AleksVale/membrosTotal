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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddPermissionAdminDTO } from 'src/admin/sub-modules-admin/dto/add-permissions-subModule-training.dto';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { PostResponse } from 'src/utils/post-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { GetTrainingResponse, TrainingDTO } from './dto/training-response.dto';
import {
  TrainingDetailStatsDto,
  TrainingStatsDto,
} from './dto/training-stats.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { TrainingAdminService } from './training-admin.service';

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
    console.log(`[DEBUG] Updating permissions for training ID: ${id}`, body);
    try {
      await this.trainingAdminService.addPermission(id, body);
      console.log(
        `[DEBUG] Permissions updated successfully for training ${id}`,
      );
      return { success: true };
    } catch (error) {
      console.error(
        `[ERROR] Error updating permissions for training ${id}:`,
        error,
      );
      throw error;
    }
  }

  @ApiResponse({ status: 200, type: SuccessResponse })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    await this.trainingAdminService.delete(id);
    return { success: true };
  }

  @Get('stats')
  @ApiResponse({ status: 200, type: TrainingStatsDto })
  async getGlobalStats() {
    return this.trainingAdminService.getGlobalStats();
  }

  @Get('hierarchy')
  @ApiResponse({ status: 200 })
  async getHierarchy() {
    return this.trainingAdminService.getHierarchy();
  }

  @ApiResponse({ status: 200 })
  @Get('permissions-stats')
  async getPermissionsStats() {
    return this.trainingAdminService.getPermissionsStats();
  }

  @Get(':id/stats')
  @ApiResponse({ status: 200, type: TrainingDetailStatsDto })
  async getTrainingStats(@Param('id', ParseIntPipe) id: number) {
    return this.trainingAdminService.getTrainingStats(id);
  }

  @Get(':id')
  @ApiResponse({ type: GetTrainingResponse, status: 200 })
  findOne(@Param('id') id: string) {
    return this.trainingAdminService.findOne(+id);
  }

  @ApiResponse({ status: 200 })
  @Get('permissions/:id')
  async getPermissions(@Param('id', ParseIntPipe) id: number) {
    console.log(`[DEBUG] Route /:id/permissions called with ID: ${id}`);
    console.log(`[DEBUG] Getting permissions for training ID: ${id}`);
    try {
      const result = await this.trainingAdminService.getPermissions(id);
      console.log(`[DEBUG] Permissions result:`, result);
      return result;
    } catch (error) {
      console.error(
        `[ERROR] Error getting permissions for training ${id}:`,
        error,
      );
      throw error;
    }
  }
}
