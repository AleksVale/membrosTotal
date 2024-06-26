import { Module } from '@nestjs/common';
import { ExpertRequestService } from './expert-request.service';
import { ExpertRequestController } from './expert-request.controller';
import { ExpertRequestRepository } from 'src/public/expert-request/expert-request.repository';

@Module({
  controllers: [ExpertRequestController],
  providers: [ExpertRequestService, ExpertRequestRepository],
})
export class ExpertRequestModule {}
