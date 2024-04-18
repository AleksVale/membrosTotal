import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ModuleRepository } from './modules.repository';
import { AddPermissionModuleAdminDTO } from './dto/add-permissions-module.dto';
import { AwsService } from 'src/aws/aws.service';

export interface TrainingModulesAdminQuery {
  title?: string;
  page: number;
  per_page: number;
  trainingId?: number;
}

// TODO: realizar validações de dados
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
    const photo = await this.awsService.getStoredObject(module.thumbnail as string);
    return { module, stream: photo };
  }

  update(
    id: number,
    updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    return this.moduleRepository.update(updateTrainingModulesAdminDto, { id });
  }

  addPermission(addPermissionModuleAdminDto: AddPermissionModuleAdminDTO) {
    return this.moduleRepository.addPermission(
      addPermissionModuleAdminDto.modules,
      addPermissionModuleAdminDto.users,
    );
  }
}
