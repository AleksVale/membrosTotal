import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { ApiTags } from '@nestjs/swagger';

@Controller('collaborator/user')
@Roles(['employee'])
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Collaborator/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@CurrentUser() user: TokenPayload) {
    return this.userService.findOne(user.id);
  }

  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: TokenPayload,
  ) {
    await this.userService.update(user.id, updateUserDto);
    return { success: true };
  }
}
