import { Controller, Get, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { HomeResponseDto } from './dto/home-response-dto';

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
}
