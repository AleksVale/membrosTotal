import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RefundAdminService } from './refund-admin.service';
import { UpdatePaymentRequestAdminDTO } from 'src/admin/payment-request-admin/dto/update-payment-request-admin.dto';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { PaymentResponseDto } from 'src/admin/payment-request-admin/dto/payment-request-response.dto';
import { PaymentStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { SuccessResponse } from 'src/utils/success-response.dto';

@ApiTags('Refunds')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@Controller('refund-admin')
export class RefundAdminController {
  constructor(private readonly refundAdminService: RefundAdminService) {}

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: PaymentStatus,
  })
  @ApiQuery({ name: 'user', required: false, type: Number })
  @ApiQuery({ name: 'refundTypeId', required: false, type: Number })
  @ApiOkResponse({
    description: 'This action returns all refunds',
    type: PaymentResponseDto,
  })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
    @Query('user') user?: number,
    @Query('refundTypeId') refundTypeId?: number,
  ) {
    return this.refundAdminService.findAll({
      page,
      per_page,
      status,
      user: user ? +user : undefined,
      refundTypeId: refundTypeId ? +refundTypeId : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefundAdminDto: UpdatePaymentRequestAdminDTO,
  ) {
    return this.refundAdminService.update(+id, updateRefundAdminDto);
  }

  @Get('signed_url/:id')
  getSignedURL(@Param('id') id: string) {
    return this.refundAdminService.getSignedURL(+id);
  }

  @Post(':id/finish/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFileFinish(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.refundAdminService.createFileFinish(file, user, +id);

    return { success: true };
  }
}
