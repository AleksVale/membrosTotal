import { TokenPayload } from 'src/public/auth/jwt.strategy';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from '../../common/decorators/apiResponseDecorator';
import { PaymentResponseDTO } from './dto/payment-response.dto';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { CreatePaymentResponseDTO } from './dto/create-payment-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { DeletePaymentDto } from './dto/delete-payment.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/payments')
@Controller('collaborator/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.paymentsService.createFile(file, user, +id);

    return { success: true };
  }

  @ApiResponse({ type: CreatePaymentResponseDTO, status: HttpStatus.CREATED })
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<CreatePaymentResponseDTO> {
    const payment = await this.paymentsService.create(createPaymentDto, user);
    return {
      success: true,
      id: payment.id,
    };
  }

  @Get()
  @ApiOkResponsePaginated(PaymentResponseDTO)
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('status') status: string,
  ) {
    return this.paymentsService.findAll({
      page,
      per_page,
      userId: user.id,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @ApiOkResponse({ type: SuccessResponse })
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() data: DeletePaymentDto) {
    await this.paymentsService.remove(+id, data);
    return { success: true };
  }
}
