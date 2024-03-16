import { Injectable } from '@nestjs/common';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ModuleRepository } from './modules.repository';

export interface TrainingModulesAdminQuery {
  title?: string;
  page: number;
  per_page: number;
  trainingId: number;
}

// TODO: realizar validações de dados
@Injectable()
export class TrainingModulesAdminService {
  constructor(private readonly moduleRepository: ModuleRepository) {}
  async create(createTrainingModulesAdminDto: CreateModuleAdminDTO) {
    return this.moduleRepository.create(createTrainingModulesAdminDto);
  }

  findAll(query: TrainingModulesAdminQuery) {
    return this.moduleRepository.findAll(query);
  }

  findOne(id: number) {
    return this.moduleRepository.find({ id });
  }

  update(
    id: number,
    updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    return this.moduleRepository.update(updateTrainingModulesAdminDto, { id });
  }
}
