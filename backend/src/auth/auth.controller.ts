import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //TODO CREATE THE REPSONSDE DTO TO THE DOCUMENTATION OF THE ROUTE
  @Post()
  authenticate(@Body() body: AuthenticateDTO) {
    return this.authService.authenticate(body);
  }
}
