import { Controller, Get, UseGuards } from '@nestjs/common';
import { TrainingCollaboratorService } from './training-collaborator.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { TrainingCollaboratorResponseDto } from './dto/training-collaborator-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Training-Collaborator')
@Controller('collaborator/training-collaborator')
export class TrainingCollaboratorController {
  constructor(
    private readonly trainingCollaboratorService: TrainingCollaboratorService,
  ) {}
  @ApiOkResponse({
    description: 'This action returns all paymentRequest for the user',
    type: TrainingCollaboratorResponseDto,
  })
  @Get()
  findAll(@CurrentUser() user: TokenPayload) {
    return this.trainingCollaboratorService.findAll(user);
  }
}
