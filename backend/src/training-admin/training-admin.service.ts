import { Injectable } from '@nestjs/common';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';

@Injectable()
export class TrainingAdminService {
  create(createTrainingAdminDto: CreateTrainingAdminDTO) {
    return 'This action adds a new trainingAdmin';
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
