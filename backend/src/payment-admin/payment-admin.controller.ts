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
} from '@nestjs/common';
import { PaymentAdminService } from './payment-admin.service';
import { CreatePaymentAdminDTO } from './dto/create-payment-admin.dto';
import { UpdatePaymentAdminDto } from './dto/update-payment-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { PaymentStatus } from '@prisma/client';
import { PaymentResponseAdminDTO } from './dto/payment-response-admin.dto';
import { ApiOkResponsePaginated } from '../common/decorators/apiResponseDecorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@ApiTags('Payment-Admin')
@Controller('payment-admin')
export class PaymentAdminController {
  constructor(private readonly paymentAdminService: PaymentAdminService) {}

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentAdminService.remove(+id);
  }
}
