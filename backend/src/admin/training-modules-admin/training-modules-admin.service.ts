import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPermissionAdminDTO } from 'src/admin/sub-modules-admin/dto/add-permissions-subModule-training.dto';
import { AwsService } from 'src/common/aws/aws.service';
import { SubModuleRepository } from '../sub-modules-admin/sub-modules.repository';
import { CreateModuleAdminDTO } from './dto/create-training-modules-admin.dto';
import { UpdateTrainingModulesAdminDto } from './dto/update-training-modules-admin.dto';
import { ModuleRepository } from './modules.repository';

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
    private readonly submoduleRepository: SubModuleRepository,
  ) {}

  async create(createTrainingModulesAdminDto: CreateModuleAdminDTO) {
    console.log('Creating module with data:', createTrainingModulesAdminDto);
    return this.moduleRepository.create(createTrainingModulesAdminDto);
  }

  async createFile(file: Express.Multer.File, moduleId: number) {
    console.log('Creating file for module with ID:', moduleId);
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
    console.log(`[DEBUG] Finding module with ID: ${id}`);
    const module = await this.moduleRepository.find({ id });

    if (!module) {
      console.log(`[DEBUG] Module with ID ${id} not found`);
      throw new NotFoundException('ID inválido');
    }

    console.log(`[DEBUG] Module found:`, module);

    let photo: string | null = null;
    try {
      if (module.thumbnail) {
        console.log(`[DEBUG] Getting photo for thumbnail: ${module.thumbnail}`);
        photo = await this.awsService.getStoredObject(module.thumbnail);
      } else {
        console.log(`[DEBUG] No thumbnail found for module ${id}`);
      }
    } catch (error) {
      console.error(`[ERROR] Error getting photo for module ${id}:`, error);
      // Continue without the photo instead of failing completely
    }

    return { module, stream: photo };
  }

  update(
    id: number,
    updateTrainingModulesAdminDto: UpdateTrainingModulesAdminDto,
  ) {
    return this.moduleRepository.update(updateTrainingModulesAdminDto, { id });
  }

  async delete(id: number) {
    await this.submoduleRepository.removeByFK({
      where: {
        moduleId: id,
      },
    });
    return this.moduleRepository.remove({ id });
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

  async getPermissions(id: number) {
    const module = await this.moduleRepository.find({ id });
    if (!module) throw new NotFoundException('ID inválido');

    const users = await this.moduleRepository.getUsersWithPermission(id);
    const totalUsers = users.length;

    console.log(`[DEBUG] Module permissions for ID ${id}:`, {
      users,
      totalUsers,
    });

    return {
      users,
      totalUsers,
    };
  }
}
