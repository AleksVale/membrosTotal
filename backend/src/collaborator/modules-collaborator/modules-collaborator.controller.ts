import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ModuleCollaboratorService } from './modules-collaborator.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { ModuleCollaboratorResponseDto } from './dto/module-collaborator-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Modules-Collaborator')
@Controller('collaborator/module-collaborator')
export class ModuleCollaboratorController {
  constructor(
    private readonly moduleCollaboratorService: ModuleCollaboratorService,
  ) {}
  @ApiOkResponse({
    description: 'This action returns all paymentRequest for the user',
    type: ModuleCollaboratorResponseDto,
  })
  @ApiQuery({ name: 'trainingId', required: false })
  @Get()
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('trainingId') trainingId?: number,
  ) {
    return this.moduleCollaboratorService.findAll(
      user,
      trainingId ? +trainingId : undefined,
    );
  }
}
