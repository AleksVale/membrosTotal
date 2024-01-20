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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //TODO CREATE THE REPSONSDE DTO TO THE DOCUMENTATION OF THE ROUTE
  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  //TODO CREATE THE REPSONSDE DTO TO THE DOCUMENTATION OF THE ROUTE
  @Patch(':id')
  update(
    @Body() updateUserDTO: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(id, updateUserDTO);
  }

  //TODO CREATE THE REPSONSDE DTO TO THE DOCUMENTATION OF THE ROUTE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  //TODO CREATE THE REPSONSDE DTO TO THE DOCUMENTATION OF THE ROUTE
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
