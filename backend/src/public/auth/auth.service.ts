import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AwsService } from 'src/common/aws/aws.service';
import { UserService } from '../../admin/user/user.service';
import { AuthenticateDTO } from './dto/authenticate.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private awsService: AwsService,
  ) {}

  async authenticate(authenticateBody: AuthenticateDTO) {
    const { email, password } = authenticateBody;
    const user = await this.userService.findOneAuthentication(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Credenciais inválidas');
    }
    const token = this.jwt.sign({
      id: user.id,
      sub: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profile: user.Profile.name,
      },
    });
    const photo = user.photoKey
      ? await this.awsService.getStoredObject(user.photoKey)
      : null;
    return {
      token,
      id: user.id,
      profile: user.Profile.name,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      photo,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userService.findOneAuthentication(undefined, userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    
    const photo = user.photoKey
      ? await this.awsService.getStoredObject(user.photoKey)
      : null;
      
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.Profile.name,
      photo,
      avatar: photo,
    };
  }
}
