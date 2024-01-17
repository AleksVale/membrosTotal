import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { DateUtils } from 'src/utils/date';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDTO: CreateUserDTO) {
    createUserDTO.document &&
      (await this.checkDuplicatedDocument(createUserDTO.document));

    const birthDate = DateUtils.stringToDate(createUserDTO.birthDate);
    await this.checkDuplicatedEmail(createUserDTO.email);
    return this.userRepository.create({ ...createUserDTO, birthDate });
  }

  private async checkDuplicatedEmail(email: string) {
    const user = await this.userRepository.find({ email });
    if (user) throw new BadRequestException('E-mail já cadastrado.');
  }

  private async checkDuplicatedDocument(document: string) {
    const user = await this.userRepository.find({ document });
    if (user) throw new BadRequestException('CPF já cadastrado.');
  }
}
