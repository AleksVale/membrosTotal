import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/admin/user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDTO) {}
