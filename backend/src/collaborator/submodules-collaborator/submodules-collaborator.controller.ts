import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { SubmoduleCollaboratorResponseDto } from './dto/submodule-collaborator-response.dto';
import { SubmoduleCollaboratorService } from './submodules-collaborator.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Submodules-Collaborator')
@Controller('collaborator/submodule-collaborator')
export class SubmoduleCollaboratorController {
  constructor(
    private readonly submoduleCollaboratorService: SubmoduleCollaboratorService,
  ) {}
  @ApiOkResponse({
    description: 'This action returns all subsubmodules for the user',
    type: SubmoduleCollaboratorResponseDto,
  })
  @ApiQuery({ name: 'submoduleId', required: false })
  @Get()
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('submoduleId') submoduleId?: number,
  ) {
    return this.submoduleCollaboratorService.findAll(
      user,
      submoduleId ? +submoduleId : undefined,
    );
  }
}
