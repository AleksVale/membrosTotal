import { TokenPayload } from 'src/auth/jwt.strategy';
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
import { CurrentUser } from 'src/auth/current-user-decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '../../utils/success-response.dto';
import { ApiOkResponsePaginated } from '../../common/decorators/apiResponseDecorator';
import { PaymentResponseDTO } from './dto/payment-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

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
    console.log(file);
    console.log(user);

    return { success: true };
  }

  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<SuccessResponse> {
    await this.paymentsService.create(createPaymentDto, user);
    return {
      success: true,
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
    console.log(user);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
