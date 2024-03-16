import { Injectable } from '@nestjs/common';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ModuleRepository } from './modules.repository';

// TODO: realizar validações de dados
@Injectable()
export class TrainingModulesAdminService {
  constructor(private readonly moduleRepository: ModuleRepository) {}
  async create(createTrainingModulesAdminDto: CreateModuleAdminDTO) {
    return this.moduleRepository.create(createTrainingModulesAdminDto);
  }

  findAll() {
    return `This action returns all trainingModulesAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingModulesAdmin`;
  }

  update(
    id: number,
    updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    return `This action updates a #${id} trainingModulesAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingModulesAdmin`;
  }
}
