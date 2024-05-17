import { Injectable } from '@nestjs/common';
import { CreateUtmParamDto } from './dto/create-utm-param.dto';
import {
  UtmParamFilter,
  UtmParamRepository,
} from 'src/repositories/utm-param.repository';
import { UtmParam } from '@prisma/client';

@Injectable()
export class UtmParamService {
  constructor(private readonly utmParamRepository: UtmParamRepository) {}
  async create(createUtmParamDto: CreateUtmParamDto): Promise<UtmParam> {
    return await this.utmParamRepository.create(createUtmParamDto);
  }

  findAll(params: UtmParamFilter) {
    return this.utmParamRepository.findAll(params);
  }

  findOne(id: number) {
    return `This action returns a #${id} utmParam`;
  }
}
