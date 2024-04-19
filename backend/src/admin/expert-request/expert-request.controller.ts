import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpertRequestService } from './expert-request.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { ExpertResponseDto } from './dto/get-expert-request.dto';

@ApiTags('Expert Request')
@Roles(['admin'])
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('expert-request')
export class ExpertRequestController {
  constructor(private readonly expertRequestService: ExpertRequestService) {}
  @ApiOkResponsePaginated(ExpertResponseDto)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
  ) {
    const response = await this.expertRequestService.findAll(page, per_page);
    return response;
  }
}
