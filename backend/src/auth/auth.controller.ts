import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { AuthService } from './auth.service';
import { AuthenticateResponseDTO } from './dto/authenticate.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //TODO CREATE THE REPSONSDE DTO TO THE DOCUMENTATION OF THE ROUTE
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
}
