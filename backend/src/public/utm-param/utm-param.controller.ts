import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UtmParamService } from './utm-param.service';
import { CreateUtmParamDto } from './dto/create-utm-param.dto';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { UtmParamResponse } from './dto/utm-param-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';

@ApiTags('Public/UtmParam')
@Controller('public/utm-param')
export class UtmParamController {
  constructor(private readonly utmParamService: UtmParamService) {}

  @ApiResponse({ type: SuccessResponse })
  @Post()
  async create(@Body() createUtmParamDto: CreateUtmParamDto) {
    await this.utmParamService.create(createUtmParamDto);
    return { success: true };
  }

  @ApiOkResponsePaginated(UtmParamResponse)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
  ) {
    return this.utmParamService.findAll({ page, per_page });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utmParamService.findOne(+id);
  }
}
