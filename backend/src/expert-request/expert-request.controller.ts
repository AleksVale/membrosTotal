import { Body, Controller, Post } from '@nestjs/common';
import { ExpertRequestService } from './expert-request.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utils/success-response.dto';
import { CreateExpertAdminDTO } from './dto/create-expert-request-dto';

@ApiTags('Expert Request')
@Controller('expert-request')
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
}
