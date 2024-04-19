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
  Delete,
} from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';
import { CreatePaymentRequestCollaboratorDTO } from './dto/create-payment-request.dto';
import { UpdatePaymentRequestCollaboratorDTO } from './dto/update-payment-request.dto';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentResponseDto } from 'src/admin/payment-request-admin/dto/payment-request-response.dto';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePaymentRequestResponseDTO } from './dto/create-payment-request-response.dto';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/PaymentRequests')
@Controller('collaborator/payment_requests')
export class PaymentRequestController {
  constructor(private readonly paymentRequestService: PaymentRequestService) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.paymentRequestService.createFile(file, user, +id);

    return { success: true };
  }

  @ApiResponse({
    type: CreatePaymentRequestResponseDTO,
    status: HttpStatus.CREATED,
  })
  @Post()
  async create(
    @Body() createPaymentRequestDto: CreatePaymentRequestCollaboratorDTO,
    @CurrentUser() user: TokenPayload,
  ): Promise<CreatePaymentRequestResponseDTO> {
    const paymentRequest = await this.paymentRequestService.create(
      createPaymentRequestDto,
      user,
    );
    return {
      id: paymentRequest.id,
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
  @ApiQuery({ name: 'paymentRequestTypeId', required: false, type: Number })
  @Get()
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status?: PaymentStatus,
    @Query('paymentRequestTypeId') paymentRequestTypeId?: number,
  ) {
    return this.paymentRequestService.findAll({
      page,
      per_page,
      status,
      user: user.id,
      paymentRequestTypeId: paymentRequestTypeId
        ? +paymentRequestTypeId
        : undefined,
    });
  }

  @ApiResponse({ type: SuccessResponse, status: 200 })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentRequestDto: UpdatePaymentRequestCollaboratorDTO,
  ) {
    return this.paymentRequestService.update(+id, updatePaymentRequestDto);
  }

  @ApiOkResponse({ type: SuccessResponse })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.paymentRequestService.remove(+id);
    return { success: true };
  }
}
