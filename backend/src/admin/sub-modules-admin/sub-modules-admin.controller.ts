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
  UploadedFile,
  HttpStatus,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { SubModulesAdminService } from './sub-modules-admin.service';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import {
  GetSubModuleResponse,
  SubmoduleDTO,
} from './dto/sub-modules-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { AddPermissionAdminDTO } from './dto/add-permissions-subModule-training.dto';
import { PostResponse } from 'src/utils/post-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sub-modules-admin')
export class SubModulesAdminController {
  constructor(
    private readonly subModulesAdminService: SubModulesAdminService,
  ) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.subModulesAdminService.createFile(file, +id);

    return { success: true };
  }

  @ApiResponse({ type: PostResponse, status: 201 })
  @Post()
  async create(
    @Body() createSubModulesAdminDto: CreateSubModuleAdminDTO,
  ): Promise<PostResponse> {
    const subModule = await this.subModulesAdminService.create(
      createSubModulesAdminDto,
    );
    return {
      id: subModule.id,
      success: true,
    };
  }

  @ApiOkResponsePaginated(SubmoduleDTO)
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  @ApiQuery({ name: 'moduleId', required: true })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('moduleId') moduleId: number,
    @Query('title') title?: string,
  ) {
    return this.subModulesAdminService.findAll({
      moduleId: moduleId ? +moduleId : undefined,
      page,
      per_page,
      title,
    });
  }

  @ApiResponse({ status: 200, type: GetSubModuleResponse })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subModulesAdminService.findOne(+id);
  }

  @ApiResponse({ type: SuccessResponse })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubModulesAdminDto: UpdateSubModulesAdminDto,
  ) {
    return this.subModulesAdminService.update(+id, updateSubModulesAdminDto);
  }

  //create delete route
  @ApiResponse({ status: 200, type: SuccessResponse })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    await this.subModulesAdminService.delete(id);
    return { success: true };
  }

  @ApiResponse({ status: 200, type: SuccessResponse })
  @Patch('permissions/:id')
  async addPermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddPermissionAdminDTO,
  ): Promise<SuccessResponse> {
    await this.subModulesAdminService.addPermission(id, body);
    return { success: true };
  }
}
