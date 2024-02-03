import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UserResponseDTO } from './dto/user-response.dto';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { ApiOkResponsePaginated } from 'src/common/decorators/apiResponseDecorator';

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
    status: 201,
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
  ) {
    return this.userService.findAll({
      page,
      per_page,
    });
  }
}
