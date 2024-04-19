import { Module } from '@nestjs/common';
import { ExpertRequestService } from './public-expert-request.service';
import { ExpertRequestController } from './public-expert-request.controller';
import { ExpertRequestRepository } from './expert-request.repository';

@Module({
  controllers: [ExpertRequestController],
  providers: [ExpertRequestService, ExpertRequestRepository],
})
export class PublicExpertRequestModule {}
