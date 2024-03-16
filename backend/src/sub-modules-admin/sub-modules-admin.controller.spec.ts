import { Test, TestingModule } from '@nestjs/testing';
import { SubModulesAdminController } from './sub-modules-admin.controller';
import { SubModulesAdminService } from './sub-modules-admin.service';

describe('SubModulesAdminController', () => {
  let controller: SubModulesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubModulesAdminController],
      providers: [SubModulesAdminService],
    }).compile();

    controller = module.get<SubModulesAdminController>(SubModulesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
