import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { DashboardStatsResponseDto, HomeResponseDto } from './dto/home-response-dto';
import { HomeService } from './home.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/home')
@Controller('collaborator/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @ApiResponse({ type: HomeResponseDto })
  @Get()
  async getInitialData(@CurrentUser() currentUser: TokenPayload) {
    return await this.homeService.getInitialData(currentUser);
  }

  @ApiResponse({ type: DashboardStatsResponseDto })
  @Get('stats')
  async getDashboardStats(@CurrentUser() currentUser: TokenPayload) {
    return await this.homeService.getDashboardStats(currentUser);
  }

  @ApiResponse({ description: 'Dados de progresso mensal dos últimos 6 meses' })
  @Get('monthly-progress')
  async getMonthlyProgress(@CurrentUser() currentUser: TokenPayload) {
    return await this.homeService.getMonthlyProgressData(currentUser);
  }

  @ApiResponse({ description: 'Atividades recentes do colaborador' })
  @Get('recent-activities')
  async getRecentActivities(@CurrentUser() currentUser: TokenPayload) {
    return await this.homeService.getRecentActivities(currentUser);
  }

  @ApiResponse({ description: 'Progresso semanal do colaborador' })
  @Get('weekly-progress')
  async getWeeklyProgress(@CurrentUser() currentUser: TokenPayload) {
    return await this.homeService.getWeeklyProgress(currentUser);
  }
}
