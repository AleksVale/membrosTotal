import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  authenticate(@Body() body: AuthenticateDTO) {
    return this.authService.authenticate(body);
  }
}
