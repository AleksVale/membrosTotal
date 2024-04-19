import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';
import { SubModuleRepository } from './sub-modules.repository';
import { AddPermissionAdminDTO } from './dto/add-permissions-subModule-training.dto';
import { AwsService } from 'src/aws/aws.service';

export interface SubModulesQuery {
  title?: string;
  page: number;
  per_page: number;
  moduleId?: number;
}

@Injectable()
export class SubModulesAdminService {
  constructor(
    private readonly subModulesRepository: SubModuleRepository,
    private readonly awsService: AwsService,
  ) {}
  create(createSubModulesAdminDto: CreateSubModuleAdminDTO) {
    return this.subModulesRepository.create(createSubModulesAdminDto);
  }

  async createFile(file: Express.Multer.File, paymentId: number) {
    const subModule = await this.subModulesRepository.find({ id: paymentId });
    const thumbnail = subModule?.thumbnail
      ? subModule.thumbnail
      : this.awsService.createPhotoKeySubModule(
          paymentId,
          file.mimetype.split('/')[1],
        );
    await this.awsService.updatePhoto(file, thumbnail);
    return this.subModulesRepository.update({ thumbnail }, { id: paymentId });
  }

  findAll(query: SubModulesQuery) {
    return this.subModulesRepository.findAll(query);
  }

  async findOne(id: number) {
    const submodule = await this.subModulesRepository.find({ id });
    if (!submodule) throw new NotFoundException('ID inválido');
    const photo = await this.awsService.getStoredObject(
      submodule.thumbnail as string,
    );
    return { submodule, stream: photo };
  }

  update(id: number, updateSubModulesAdminDto: UpdateSubModulesAdminDto) {
    const entity = { ...updateSubModulesAdminDto, file: undefined };
    return this.subModulesRepository.update(entity, { id });
  }

  async addPermission(
    submoduleId: number,
    addPermissionSubModuleAdminDto: AddPermissionAdminDTO,
  ) {
    const subModule = await this.subModulesRepository.find({ id: submoduleId });
    if (!subModule) throw new NotFoundException('ID inválido');

    return this.subModulesRepository.addPermission(
      submoduleId,
      addPermissionSubModuleAdminDto.removedUsers,
      addPermissionSubModuleAdminDto.addedUsers,
      addPermissionSubModuleAdminDto.addRelatives,
    );
  }
}
