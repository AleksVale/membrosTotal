import { Injectable } from '@nestjs/common';
import { ExpertRequestRepository } from './expert-request.repository';
import { CreateExpertAdminDTO } from './dto/create-expert-request-dto';
import { CreateQuestionarioDTO } from './dto/create-questionario-dto';

@Injectable()
export class ExpertRequestService {
  constructor(
    private readonly expertRequestRepository: ExpertRequestRepository,
  ) {}
  async createExpertRequest(data: CreateExpertAdminDTO) {
    return await this.expertRequestRepository.create(data);
  }

  async createVideoJob(data: CreateQuestionarioDTO) {
    return await this.expertRequestRepository.createVideoJob(data);
  }
}
