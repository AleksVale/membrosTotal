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

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {}

  private async hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async create(createUserDTO: CreateUserDTO) {
    createUserDTO.document &&
      (await this.checkDuplicatedDocument(createUserDTO.document));

    const birthDate = DateUtils.stringToDate(createUserDTO.birthDate);
    await this.checkDuplicatedEmail(createUserDTO.email);
    const password = await this.hashPassword(createUserDTO.password);
    return this.userRepository.create({
      ...createUserDTO,
      birthDate,
      password,
    });
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

  async findOne(id: number) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    this.mailerService
      .sendMail({
        to: 'alexalexx3@gmail.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {
        console.log('aqio');
      })
      .catch((err) => {
        console.log(err);
      });
    return user;
  }

  async findOneAuthentication(email: string) {
    const user = await this.userRepository.find({ email });
    return user;
  }

  async findAll(options: { skip: number; take: number }) {
    return await this.userRepository.findAll({
      skip: options.skip,
      take: options.take,
      orderBy: { email: 'asc' },
      include: {
        Profile: true,
        UserMeeting: true,
      },
    });
  }
}
