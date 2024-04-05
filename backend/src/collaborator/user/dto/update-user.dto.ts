import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDTO) {}
