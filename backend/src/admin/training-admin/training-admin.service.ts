import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { TrainingRepository } from './training.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { AddPermissionAdminDTO } from 'src/admin/sub-modules-admin/dto/add-permissions-subModule-training.dto';
import { ModuleRepository } from '../training-modules-admin/modules.repository';
import { SubModuleRepository } from '../sub-modules-admin/sub-modules.repository';

export interface TrainingQuery {
  title: string;
  page: number;
  per_page: number;
}

@Injectable()
export class TrainingAdminService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly awsService: AwsService,
    private readonly moduleRepository: ModuleRepository,
    private readonly submoduleRepository: SubModuleRepository,
  ) {}

  create(createTrainingAdminDto: CreateTrainingAdminDTO) {
    return this.trainingRepository.create(createTrainingAdminDto);
  }

  findAll(query: TrainingQuery) {
    return this.trainingRepository.findAll(query);
  }

  async findOne(id: number) {
    const training = await this.trainingRepository.find({ id });
    if (!training) throw new NotFoundException('ID inválido');
    const photo = await this.awsService.getStoredObject(
      training.thumbnail as string,
    );
    return { training, stream: photo };
  }

  update(id: number, updateTrainingAdminDto: UpdateTrainingAdminDto) {
    const entity = { ...updateTrainingAdminDto, file: undefined };

    return this.trainingRepository.update(entity, { id });
  }

  async delete(id: number) {
    await this.moduleRepository.removeByTrainingId(id);
    await this.submoduleRepository.removeByFK({
      where: {
        module: {
          trainingId: id,
        },
      },
    });
    return this.trainingRepository.remove({ id });
  }

  addPermission(
    trainingId: number,
    addPermissionTrainingAdminDto: AddPermissionAdminDTO,
  ) {
    return this.trainingRepository.addPermission(
      trainingId,
      addPermissionTrainingAdminDto.removedUsers,
      addPermissionTrainingAdminDto.addedUsers,
      addPermissionTrainingAdminDto.addRelatives,
    );
  }

  async createFile(file: Express.Multer.File, paymentId: number) {
    const training = await this.trainingRepository.find({ id: paymentId });
    const thumbnail = training?.thumbnail
      ? training.thumbnail
      : this.awsService.createPhotoKeyTraining(
          paymentId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, thumbnail);
    return this.trainingRepository.update({ thumbnail }, { id: paymentId });
  }
}
