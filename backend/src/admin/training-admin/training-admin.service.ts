import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPermissionAdminDTO } from 'src/admin/sub-modules-admin/dto/add-permissions-subModule-training.dto';
import { AwsService } from 'src/common/aws/aws.service';
import { SubModuleRepository } from '../sub-modules-admin/sub-modules.repository';
import { ModuleRepository } from '../training-modules-admin/modules.repository';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import {
  TrainingDetailStatsDto,
  TrainingStatsDto,
} from './dto/training-stats.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { TrainingRepository } from './training.repository';

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
    await this.submoduleRepository.removeByFK({
      where: {
        module: {
          trainingId: id,
        },
      },
    });
    await this.moduleRepository.removeByTrainingId(id);

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

  async getPermissions(id: number) {
    const training = await this.trainingRepository.find({ id });
    if (!training) throw new NotFoundException('ID inválido');

    const users = await this.trainingRepository.getUsersWithPermission(id);
    const totalUsers = users.length;

    console.log(`[DEBUG] Training permissions for ID ${id}:`, {
      users,
      totalUsers,
    });

    return {
      users,
      totalUsers,
    };
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

  async getGlobalStats(): Promise<TrainingStatsDto> {
    return this.trainingRepository.getGlobalStats();
  }

  async getTrainingStats(id: number): Promise<TrainingDetailStatsDto> {
    try {
      return await this.trainingRepository.getTrainingStats(id);
    } catch (error) {
      throw new NotFoundException(`Stats for training with ID ${id} not found`);
    }
  }

  async getPermissionsStats() {
    // Get total users count
    const totalUsers = await this.trainingRepository.countUsers();

    // Get trainings count
    const totalTrainings = await this.trainingRepository.countTrainings();

    // Get modules count
    const totalModules = await this.moduleRepository.countModules();

    // Get submodules count
    const totalSubmodules = await this.submoduleRepository.countSubmodules();

    // Get active permissions count (total of all permissions)
    const activePermissions =
      await this.trainingRepository.countActivePermissions();

    // Get recent changes (permissions created or modified in the last 24 hours)
    const recentChanges =
      await this.trainingRepository.countRecentPermissionChanges();

    return {
      totalUsers,
      totalTrainings,
      totalModules,
      totalSubmodules,
      activePermissions,
      pendingPermissions: 0, // Not implemented yet
      recentChanges,
    };
  }

  async getUsersWithPermission(trainingId: number) {
    return this.trainingRepository.getUsersWithPermission(trainingId);
  }

  async getHierarchy() {
    return this.trainingRepository.getHierarchy();
  }
}
