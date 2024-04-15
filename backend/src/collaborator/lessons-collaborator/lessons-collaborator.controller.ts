import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/jwt.strategy';
import { LessonCollaboratorService } from './lessons-collaborator.service';
import { LessonsCollaboratorResponseDto } from './dto/lessons-collaborator-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['employee'])
@ApiTags('Collaborator/Lessons-Collaborator')
@Controller('collaborator/lessons-collaborator')
export class LessonCollaboratorController {
  constructor(
    private readonly lessonCollaboratorService: LessonCollaboratorService,
  ) {}
  @ApiOkResponse({
    description: 'This action returns all lessons for the user',
    type: LessonsCollaboratorResponseDto,
  })
  @ApiQuery({ name: 'lessonId', required: false })
  @Get()
  findAll(
    @CurrentUser() user: TokenPayload,
    @Query('submoduleId') submoduleId?: number,
  ) {
    return this.lessonCollaboratorService.findAll(
      user,
      submoduleId ? +submoduleId : undefined,
    );
  }
}
