import { Test, TestingModule } from '@nestjs/testing';
import { TrainingModulesAdminController } from './training-modules-admin.controller';
import { TrainingModulesAdminService } from './training-modules-admin.service';

describe('TrainingModulesAdminController', () => {
  let controller: TrainingModulesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingModulesAdminController],
      providers: [TrainingModulesAdminService],
    }).compile();

    controller = module.get<TrainingModulesAdminController>(TrainingModulesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
