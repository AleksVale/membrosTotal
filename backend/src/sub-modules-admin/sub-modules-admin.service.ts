import { Injectable } from '@nestjs/common';
import { CreateSubModuleAdminDTO } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';
import { SubModuleRepository } from './sub-modules.repository';

@Injectable()
export class SubModulesAdminService {
  constructor(private readonly subModulesRepository: SubModuleRepository) {}
  create(createSubModulesAdminDto: CreateSubModuleAdminDTO) {
    return this.subModulesRepository.create(createSubModulesAdminDto);
  }

  findAll() {
    return `This action returns all subModulesAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subModulesAdmin`;
  }

  update(id: number, updateSubModulesAdminDto: UpdateSubModulesAdminDto) {
    return `This action updates a #${id} subModulesAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} subModulesAdmin`;
  }
}
