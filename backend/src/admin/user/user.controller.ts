import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { JwtAuthGuard } from '../../public/auth/jwt-auth.guard';
import { RoleGuard } from '../../public/auth/role/role.guard';
import { Roles } from '../../public/auth/roles/roles.decorator';
import { CreateUserDTO } from './dto/create-user.dto';
import { CreateNewPasswordDTO } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
@Roles(['admin'])
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    type: SuccessResponse,
    status: 201,
    description: 'The user has been successfully created.',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<SuccessResponse> {
    await this.userService.create(createUserDto);
    return {
      success: true,
    };
  }

  @ApiResponse({
    type: SuccessResponse,
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @Patch(':id')
  async update(
    @Body() updateUserDTO: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    await this.userService.update(id, updateUserDTO);
    return {
      success: true,
    };
  }

  @ApiResponse({
    type: SuccessResponse,
    status: 200,
    description: 'The user password has been successfully updated.',
  })
  @Patch('password/:id')
  async updatePassword(
    @Body() updateUserDTO: CreateNewPasswordDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    await this.userService.updatePassword(id, updateUserDTO.password);
    return {
      success: true,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully returned.',
    type: UserResponseDTO,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  @ApiOkResponsePaginated(UserResponseDTO)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('per_page', new DefaultValuePipe(10), ParseIntPipe) per_page: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('profile') profile?: string,
  ) {
    return this.userService.findAll({
      page,
      per_page,
      name,
      email,
      profile,
    });
  }
  
  @ApiResponse({
    status: 200,
    description: 'The user permissions have been successfully returned.',
  })
  @Get(':id/permissions')
  getUserPermissions(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserPermissions(id);
  }

  @Delete(':id')
  @ApiResponse({
    type: SuccessResponse,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    await this.userService.remove(id);
    return {
      success: true,
    };
  }
}
