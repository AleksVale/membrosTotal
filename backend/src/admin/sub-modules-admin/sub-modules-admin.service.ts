import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsService } from 'src/common/aws/aws.service';
import { AddPermissionAdminDTO } from './dto/add-permissions-subModule-training.dto';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';
import { SubModuleRepository } from './sub-modules.repository';

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
    const photo = submodule.thumbnail
      ? await this.awsService.getStoredObject(submodule.thumbnail)
      : undefined;
    return { submodule, stream: photo };
  }

  async getPermissions(id: number) {
    const submodule = await this.subModulesRepository.find({ id });
    if (!submodule) throw new NotFoundException('ID inválido');
    
    const users = await this.subModulesRepository.getUsersWithPermission(id);
    const totalUsers = users.length;
    
    console.log(`[DEBUG] Submodule permissions for ID ${id}:`, { users, totalUsers });
    
    return {
      users,
      totalUsers,
    };
  }

  update(id: number, updateSubModulesAdminDto: UpdateSubModulesAdminDto) {
    const entity = { ...updateSubModulesAdminDto, file: undefined };
    return this.subModulesRepository.update(entity, { id });
  }

  delete(id: number) {
    return this.subModulesRepository.remove({ id });
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
