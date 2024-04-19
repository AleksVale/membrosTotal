import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/admin/user/user.repository';
import { DateUtils } from 'src/utils/date';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findOne(id: number) {
    return this.userRepository.find({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(
      {
        ...updateUserDto,
        birthDate: updateUserDto.birthDate
          ? DateUtils.stringToDate(updateUserDto.birthDate)
          : undefined,
      },
      { id },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
