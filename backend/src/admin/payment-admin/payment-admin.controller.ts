import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentAdminService } from './payment-admin.service';
import { CreatePaymentAdminDTO } from './dto/create-payment-admin.dto';
import { UpdatePaymentAdminDto } from './dto/update-payment-admin.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { PaymentResponseAdminDTO } from './dto/payment-response-admin.dto';
import { ApiOkResponsePaginated } from '../../common/decorators/apiResponseDecorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/utils/success-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@ApiTags('Payment-Admin')
@Controller('payment-admin')
export class PaymentAdminController {
  constructor(private readonly paymentAdminService: PaymentAdminService) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.paymentAdminService.createFile(file, user, +id);

    return { success: true };
  }
  @Post()
  create(
    @Body() createPaymentAdminDto: CreatePaymentAdminDTO,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.paymentAdminService.create(createPaymentAdminDto, user);
  }

  @Get()
  @ApiOkResponsePaginated(PaymentResponseAdminDTO)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('expert') expert?: number,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentAdminService.findAll({
      page,
      per_page,
      expert,
      status,
    });
  }

  @Get('signed_url/:id')
  getSignedURL(@Param('id') id: string) {
    return this.paymentAdminService.getSignedURL(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentAdminDto: UpdatePaymentAdminDto,
  ) {
    return this.paymentAdminService.update(+id, updatePaymentAdminDto);
  }

  @Patch(':id/finish')
  pay(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.paymentAdminService.pay(+id, user);
  }

  @Post(':id/finish/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFileFinish(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.paymentAdminService.createFileFinish(file, user, +id);

    return { success: true };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentAdminService.remove(+id);
  }
}
