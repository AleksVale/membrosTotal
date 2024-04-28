import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  UseGuards,
  Post,
  UseInterceptors,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { PaymentRequestAdminService } from './payment-request-admin.service';
import { UpdatePaymentRequestAdminDTO } from './dto/update-payment-request-admin.dto';
import { PaymentStatus } from '@prisma/client';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentResponseDto } from './dto/payment-request-response.dto';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@ApiTags('PaymentRequests')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@Controller('payment-request-admin')
export class PaymentRequestAdminController {
  constructor(
    private readonly paymentRequestAdminService: PaymentRequestAdminService,
  ) {}

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: PaymentStatus,
  })
  @ApiQuery({ name: 'user', required: false, type: Number })
  @ApiQuery({ name: 'paymentRequestTypeId', required: false, type: Number })
  @ApiOkResponse({
    description: 'This action returns all paymentRequest for the user',
    type: PaymentResponseDto,
  })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
    @Query('user') user?: number,
    @Query('paymentRequestTypeId') paymentRequestTypeId?: number,
  ) {
    return this.paymentRequestAdminService.findAll({
      page,
      per_page,
      paymentRequestTypeId,
      status,
      user,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentRequestAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentRequestAdminDto: UpdatePaymentRequestAdminDTO,
  ) {
    return this.paymentRequestAdminService.update(
      +id,
      updatePaymentRequestAdminDto,
    );
  }

  @Get('signed_url/:id')
  getSignedURL(@Param('id') id: string) {
    return this.paymentRequestAdminService.getSignedURL(+id);
  }

  @Post(':id/finish/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFileFinish(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.paymentRequestAdminService.createFileFinish(file, user, +id);

    return { success: true };
  }
}
