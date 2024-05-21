import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/admin/user/user.repository';
import { DateUtils } from 'src/utils/date';
import { AwsService } from 'src/common/aws/aws.service';
import { TokenPayload } from 'src/public/auth/jwt.strategy';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsService: AwsService,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new BadRequestException('Usuário não encontrado');
    if (!user.photoKey) return { user, photo: null };
    const photo = await this.awsService.getStoredObject(user.photoKey);
    return { user, photo };
  }

  async getPicture(id: number) {
    const user = await this.userRepository.find({ id });
    if (!user) throw new BadRequestException('Usuário não encontrado');
    if (!user.photoKey) return { picture: null };
    const picture = await this.awsService.getStoredObject(user.photoKey);
    return { picture };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const entity = {
      ...updateUserDto,
      birthDate: updateUserDto.birthDate
        ? DateUtils.stringToDate(updateUserDto.birthDate)
        : undefined,
      file: undefined,
    };
    await this.userRepository.update(entity, { id });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createFile(file: Express.Multer.File, currentUser: TokenPayload) {
    const user = await this.userRepository.find({ id: currentUser.id });
    const photoKey = user?.photoKey
      ? user.photoKey
      : this.awsService.createPhotoKeyUser(
          currentUser.id,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, photoKey);
    return this.userRepository.update({ photoKey }, { id: currentUser.id });
  }
}
