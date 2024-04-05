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
    const token = this.jwt.sign({
      id: user.id,
      sub: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profile: user.Profile.name,
      },
    });
    return {
      token,
      id: user.id,
      profile: user.Profile.name,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
  }
}
