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
} from '@nestjs/common';
import { SubModulesAdminService } from './sub-modules-admin.service';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { SubmoduleDTO } from './dto/sub-modules-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { AddPermissionSubModuleAdminDTO } from './dto/add-permissions-subModule-training.dto';

@Controller('sub-modules-admin')
export class SubModulesAdminController {
  constructor(
    private readonly subModulesAdminService: SubModulesAdminService,
  ) {}

  @Post()
  create(@Body() createSubModulesAdminDto: CreateSubModuleAdminDTO) {
    return this.subModulesAdminService.create(createSubModulesAdminDto);
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
    @Query('moduleId', ParseIntPipe) moduleId: number,
    @Query('title') title?: string,
  ) {
    return this.subModulesAdminService.findAll({
      moduleId,
      page,
      per_page,
      title,
    });
  }

  @ApiResponse({ status: 200, type: SubmoduleDTO })
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

  @ApiResponse({ status: 200, type: SuccessResponse })
  @Post(':id/permissions')
  async addPermission(
    @Param('id') id: string,
    @Body() body: AddPermissionSubModuleAdminDTO,
  ): Promise<SuccessResponse> {
    await this.subModulesAdminService.addPermission(+id, body);
    return { success: true };
  }
}
