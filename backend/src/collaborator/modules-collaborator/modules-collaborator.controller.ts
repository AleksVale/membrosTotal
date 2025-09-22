import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/public/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/public/auth/jwt-auth.guard';
import { TokenPayload } from 'src/public/auth/jwt.strategy';
import { RoleGuard } from 'src/public/auth/role/role.guard';
import { Roles } from 'src/public/auth/roles/roles.decorator';
import { ModuleCollaboratorResponseDto } from './dto/module-collaborator-response.dto';
import { ModuleCollaboratorService } from './modules-collaborator.service';

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
    console.log(`[DEBUG] Controller: Finding modules for user:`, user, `trainingId: ${trainingId}`);
    return this.moduleCollaboratorService.findAll(
      user,
      trainingId ? +trainingId : undefined,
    );
  }
}
