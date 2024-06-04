import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { SubmoduleCollaboratorResponseDto } from './dto/submodule-collaborator-response.dto';
import { SubmoduleCollaboratorService } from './submodules-collaborator.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Submodules-Collaborator')
@Controller('collaborator/submodules-collaborator')
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
    @Query('moduleId') moduleId?: number,
  ) {
    return this.submoduleCollaboratorService.findAll(
      user,
      moduleId ? +moduleId : undefined,
    );
  }
}
