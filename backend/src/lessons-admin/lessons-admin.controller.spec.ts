import { Test, TestingModule } from '@nestjs/testing';
import { LessonsAdminController } from './lessons-admin.controller';
import { LessonsAdminService } from './lessons-admin.service';

describe('LessonsAdminController', () => {
  let controller: LessonsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsAdminController],
      providers: [LessonsAdminService],
    }).compile();

    controller = module.get<LessonsAdminController>(LessonsAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
