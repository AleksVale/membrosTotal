import { Injectable } from '@nestjs/common';
import { ExpertRequestRepository } from './expert-request.repository';
import { CreateExpertAdminDTO } from './dto/create-expert-request-dto';

@Injectable()
export class ExpertRequestService {
  constructor(
    private readonly expertRequestRepository: ExpertRequestRepository,
  ) {}
  async createExpertRequest(data: CreateExpertAdminDTO) {
    return await this.expertRequestRepository.create(data);
  }
}
