import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ModuleRepository } from './modules.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { AddPermissionAdminDTO } from 'src/sub-modules-admin/dto/add-permissions-subModule-training.dto';

export interface TrainingModulesAdminQuery {
  title?: string;
  page: number;
  per_page: number;
  trainingId?: number;
}

@Injectable()
export class TrainingModulesAdminService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly awsService: AwsService,
  ) {}

  async create(createTrainingModulesAdminDto: CreateModuleAdminDTO) {
    return this.moduleRepository.create(createTrainingModulesAdminDto);
  }

  async createFile(file: Express.Multer.File, moduleId: number) {
    const module = await this.moduleRepository.find({ id: moduleId });
    const thumbnail = module?.thumbnail
      ? module.thumbnail
      : this.awsService.createPhotoKeyModule(
          moduleId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, thumbnail);
    return this.moduleRepository.update({ thumbnail }, { id: moduleId });
  }

  findAll(query: TrainingModulesAdminQuery) {
    return this.moduleRepository.findAll(query);
  }

  async findOne(id: number) {
    const module = await this.moduleRepository.find({ id });
    if (!module) throw new NotFoundException('ID inválido');
    const photo = await this.awsService.getStoredObject(
      module.thumbnail as string,
    );
    return { module, stream: photo };
  }

  update(
    id: number,
    updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    return this.moduleRepository.update(updateTrainingModulesAdminDto, { id });
  }

  addPermission(
    moduleId: number,
    addPermissionModuleAdminDto: AddPermissionAdminDTO,
  ) {
    return this.moduleRepository.addPermission(
      moduleId,
      addPermissionModuleAdminDto.removedUsers,
      addPermissionModuleAdminDto.addedUsers,
      addPermissionModuleAdminDto.addRelatives,
    );
  }
}
