import { Injectable } from '@nestjs/common';
import { CreateSubModulesAdminDto } from './dto/create-sub-modules-admin.dto';
import { UpdateSubModulesAdminDto } from './dto/update-sub-modules-admin.dto';

@Injectable()
export class SubModulesAdminService {
  create(createSubModulesAdminDto: CreateSubModulesAdminDto) {
    return 'This action adds a new subModulesAdmin';
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
