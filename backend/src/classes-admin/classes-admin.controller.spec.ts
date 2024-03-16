import { Test, TestingModule } from '@nestjs/testing';
import { ClassesAdminController } from './classes-admin.controller';
import { ClassesAdminService } from './classes-admin.service';

describe('ClassesAdminController', () => {
  let controller: ClassesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesAdminController],
      providers: [ClassesAdminService],
    }).compile();

    controller = module.get<ClassesAdminController>(ClassesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
