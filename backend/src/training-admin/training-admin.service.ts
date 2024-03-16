import { Injectable } from '@nestjs/common';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { TrainingRepository } from './training.repository';

@Injectable()
export class TrainingAdminService {
  constructor(private readonly trainingRepository: TrainingRepository) {}

  create(createTrainingAdminDto: CreateTrainingAdminDTO) {
    return this.trainingRepository.create(createTrainingAdminDto);
  }

  findAll() {
    return `This action returns all trainingAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingAdmin`;
  }

  update(id: number, updateTrainingAdminDto: UpdateTrainingAdminDto) {
    return `This action updates a #${id} trainingAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingAdmin`;
  }
}
