import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { PaymentsService } from './payments.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/payment-stats')
@Controller('collaborator/payment-stats')
export class PaymentStatsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('overview')
  @ApiOkResponse({ description: 'Estatísticas gerais dos pagamentos' })
  async getOverview(@CurrentUser() user: TokenPayload) {
    return this.paymentsService.getOverviewStats(user.id);
  }

  @Get('monthly')
  @ApiOkResponse({ description: 'Dados mensais dos pagamentos' })
  async getMonthlyData(
    @CurrentUser() user: TokenPayload,
    @Query('months') months: string = '6'
  ) {
    return this.paymentsService.getMonthlyStats(user.id, parseInt(months));
  }

  @Get('categories')
  @ApiOkResponse({ description: 'Distribuição por categorias' })
  async getCategoryData(@CurrentUser() user: TokenPayload) {
    return this.paymentsService.getCategoryStats(user.id);
  }
}
