import { Body, Controller, Post } from '@nestjs/common';
import { ExpertRequestService } from './public-expert-request.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { CreateExpertAdminDTO } from './dto/create-expert-request-dto';
import { CreateQuestionarioDTO } from './dto/create-questionario-dto';

@ApiTags('Expert Request')
@Controller('public/expert-request')
export class ExpertRequestController {
  constructor(private readonly expertRequestService: ExpertRequestService) {}
  @ApiResponse({
    status: 201,
    description: 'Expert request created',
    type: SuccessResponse,
  })
  @Post()
  async createExpertRequest(@Body() data: CreateExpertAdminDTO) {
    await this.expertRequestService.createExpertRequest(data);
    return { success: true };
  }

  @ApiResponse({
    status: 201,
    description: 'Job request created',
    type: SuccessResponse,
  })
  @Post('video-job')
  async createVideoJob(@Body() data: CreateQuestionarioDTO) {
    await this.expertRequestService.createVideoJob(data);
    return { success: true };
  }
}
