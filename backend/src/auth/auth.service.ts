import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async authenticate(authenticateBody: AuthenticateDTO) {
    const { email, password } = authenticateBody;
    const user = await this.userService.findOneAuthentication(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.jwt.sign({
      id: user.id,
      sub: {
        name: user.name,
        email: user.email,
        profile: user.Profile.name,
      },
    });
  }
}
