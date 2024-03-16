import { Injectable } from '@nestjs/common';
import { CreateTrainingModulesAdminDto } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';

@Injectable()
export class TrainingModulesAdminService {
  create(createTrainingModulesAdminDto: CreateTrainingModulesAdminDto) {
    return 'This action adds a new trainingModulesAdmin';
  }

  findAll() {
    return `This action returns all trainingModulesAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingModulesAdmin`;
  }

  update(id: number, updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto) {
    return `This action updates a #${id} trainingModulesAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingModulesAdmin`;
  }
}
