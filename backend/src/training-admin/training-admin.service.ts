import { Injectable } from '@nestjs/common';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { TrainingRepository } from './training.repository';

export interface TrainingQuery {
  title: string;
  page: number;
  per_page: number;
}

@Injectable()
export class TrainingAdminService {
  constructor(private readonly trainingRepository: TrainingRepository) {}

  create(createTrainingAdminDto: CreateTrainingAdminDTO) {
    return this.trainingRepository.create(createTrainingAdminDto);
  }

  findAll(query: TrainingQuery) {
    return this.trainingRepository.findAll(query);
  }

  findOne(id: number) {
    return this.trainingRepository.find({ id });
  }

  update(id: number, updateTrainingAdminDto: UpdateTrainingAdminDto) {
    return this.trainingRepository.update(updateTrainingAdminDto, { id });
  }
}
