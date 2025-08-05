import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user-decorator';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { AuthenticateResponseDTO } from './dto/authenticate.response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenPayload } from './jwt.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiResponse({
    type: AuthenticateResponseDTO,
    status: 201,
    description: 'The user has been successfully authenticated.',
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @Post()
  authenticate(@Body() body: AuthenticateDTO) {
    return this.authService.authenticate(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna o perfil do usuário logado',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() currentUser: TokenPayload) {
    return this.authService.getProfile(currentUser.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    // Como usamos JWT stateless, o logout é feito no frontend removendo o token
    return { message: 'Logout realizado com sucesso' };
  }
}
