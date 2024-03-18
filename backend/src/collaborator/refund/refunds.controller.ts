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
  HttpStatus,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentResponseDto } from 'src/payment-request-admin/dto/payment-request-response.dto';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreateRefundResponseDTO } from './dto/create-refund-response.dto';
import { CreateRefundCollaboratorDTO } from './dto/create-refund.dto';
import { UpdateRefundCollaboratorDTO } from './dto/update-refund.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Refunds')
@Controller('collaborator/refunds')
export class RefundsController {
  constructor(private readonly refundService: RefundsService) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.refundService.createFile(file, user, +id);

    return { success: true };
  }

  @ApiResponse({
    type: CreateRefundResponseDTO,
    status: HttpStatus.CREATED,
  })
  @Post()
  async create(
    @Body() createRefundsDto: CreateRefundCollaboratorDTO,
    @CurrentUser() user: TokenPayload,
  ): Promise<CreateRefundResponseDTO> {
    const refund = await this.refundService.create(createRefundsDto, user);
    return {
      id: refund.id,
      success: true,
    };
  }

  @ApiOkResponse({
    description: 'This action returns all paymentRequest for the user',
    type: PaymentResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: PaymentStatus,
  })
  @Get()
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.refundService.findAll({
      page,
      per_page,
      status,
      user: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundService.findOne(+id);
  }

  @ApiResponse({ type: SuccessResponse, status: 200 })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefundsDto: UpdateRefundCollaboratorDTO,
  ) {
    return this.refundService.update(+id, updateRefundsDto);
  }
}
