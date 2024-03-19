import { Injectable } from '@nestjs/common';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';
import { SubModuleRepository } from './sub-modules.repository';
import { AddPermissionSubModuleAdminDTO } from './dto/add-permissions-subModule-training.dto';

export interface SubModulesQuery {
  title?: string;
  page: number;
  per_page: number;
  moduleId: number;
}

@Injectable()
export class SubModulesAdminService {
  constructor(private readonly subModulesRepository: SubModuleRepository) {}
  create(createSubModulesAdminDto: CreateSubModuleAdminDTO) {
    return this.subModulesRepository.create(createSubModulesAdminDto);
  }

  findAll(query: SubModulesQuery) {
    return this.subModulesRepository.findAll(query);
  }

  findOne(id: number) {
    return this.subModulesRepository.find({ id });
  }

  update(id: number, updateSubModulesAdminDto: UpdateSubModulesAdminDto) {
    return this.subModulesRepository.update(updateSubModulesAdminDto, { id });
  }

  addPermission(
    id: number,
    addPermissionSubModuleAdminDto: AddPermissionSubModuleAdminDTO,
  ) {
    return this.subModulesRepository.addPermission(
      id,
      addPermissionSubModuleAdminDto.users,
    );
  }
}
