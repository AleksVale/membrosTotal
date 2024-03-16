import { Injectable } from '@nestjs/common';
import { CreateClassesAdminDto } from './dto/create-classes-admin.dto';
import { UpdateClassesAdminDto } from './dto/update-classes-admin.dto';

@Injectable()
export class ClassesAdminService {
  create(createClassesAdminDto: CreateClassesAdminDto) {
    return 'This action adds a new classesAdmin';
  }

  findAll() {
    return `This action returns all classesAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classesAdmin`;
  }

  update(id: number, updateClassesAdminDto: UpdateClassesAdminDto) {
    return `This action updates a #${id} classesAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} classesAdmin`;
  }
}
