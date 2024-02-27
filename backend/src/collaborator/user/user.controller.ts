import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
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
