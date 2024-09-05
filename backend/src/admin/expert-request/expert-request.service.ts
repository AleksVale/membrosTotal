import { Injectable } from '@nestjs/common';
import { ExpertRequestRepository } from 'src/public/expert-request/expert-request.repository';

@Injectable()
export class ExpertRequestService {
  constructor(
    private readonly expertRequestRepository: ExpertRequestRepository,
  ) {}
  async findAll(page: number, per_page: number) {
    return await this.expertRequestRepository.findAll({ page, per_page });
  }

  async findAllVideo(page: number, per_page: number) {
    return await this.expertRequestRepository.findAllVideoJob({
      page,
      per_page,
    });
  }
}
