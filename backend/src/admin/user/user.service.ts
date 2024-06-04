import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { DateUtils } from 'src/utils/date';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserStatus } from '@prisma/client';
// import { MailerService } from '@nestjs-modules/mailer';

export interface UserFilter {
  email?: string;
  name?: string;
  phone?: string;
  profile?: string;
  page: number;
  per_page: number;
}
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private mailerService: MailerService,
  ) {}
  private async hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  private normalize(value?: string) {
    if (!value) {
      return undefined;
    }
    return value?.replace(/\D/g, '');
  }

  async create(createUserDTO: CreateUserDTO) {
    createUserDTO.document &&
      (await this.checkDuplicatedDocument(createUserDTO.document));

    const birthDate = DateUtils.stringToDate(createUserDTO.birthDate);
    await this.checkDuplicatedEmail(createUserDTO.email);
    const password = await this.hashPassword(createUserDTO.password);
    const user = await this.userRepository.create({
      ...createUserDTO,
      birthDate,
      password,
      document: this.normalize(createUserDTO.document),
      phone: this.normalize(createUserDTO.phone),
    });
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        from: 'vitor@vtn.business', // sender address
        subject: 'Bem vindo ao membros', // Subject line
        text: 'Bem vindo', // plaintext body
        html: '<b>Bem vindo ao membros vai la fazer login</b>', // HTML body content
      })
      .then(() => {
        console.log('aqio');
      })
      .catch((err) => {
        console.log(err);
      });
    return user;
  }

  private async checkDuplicatedEmail(email: string, id?: number) {
    const user = await this.userRepository.find({ email });
    if (user && user.id !== id)
      throw new BadRequestException('E-mail já cadastrado.');
  }

  private async checkDuplicatedDocument(document: string, id?: number) {
    const user = await this.userRepository.find({ document });
    if (user && user.id !== id)
      throw new BadRequestException('CPF já cadastrado.');
  }

  async update(id: number, updateUserDTO: UpdateUserDto) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    updateUserDTO.document &&
      (await this.checkDuplicatedDocument(updateUserDTO.document, id));

    const birthDate = DateUtils.stringToDate(
      updateUserDTO.birthDate || user.birthDate,
    );
    updateUserDTO.email &&
      (await this.checkDuplicatedEmail(updateUserDTO.email, id));

    const password = updateUserDTO.password
      ? await this.hashPassword(updateUserDTO.password)
      : undefined;
    return await this.userRepository.update(
      { ...updateUserDTO, birthDate, password },
      { id },
    );
  }

  async updatePassword(id: number, password: string) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const newPassword = await this.hashPassword(password);
    return await this.userRepository.update({ password: newPassword }, { id });
  }

  async findOne(id: number) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findOneAuthentication(email: string) {
    const user = await this.userRepository.find({
      email,
      status: UserStatus.ACTIVE,
    });
    return user;
  }

  async findAll(options: UserFilter) {
    return await this.userRepository.findAll(options);
  }

  async remove(id: number) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return await this.userRepository.update(
      { status: UserStatus.INACTIVE },
      { id },
    );
  }
}
