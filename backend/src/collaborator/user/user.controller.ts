import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { GetPictureResponse } from './dto/get-picture-response.dto';

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

  @Patch('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: SuccessResponse, status: HttpStatus.CREATED })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
  ) {
    await this.userService.createFile(file, user);

    return { success: true };
  }

  @ApiResponse({ type: GetPictureResponse, status: HttpStatus.OK })
  @Get(':id/picture')
  async getPicture(
    @CurrentUser() user: TokenPayload,
  ): Promise<GetPictureResponse> {
    return this.userService.getPicture(user.id);
  }
}
