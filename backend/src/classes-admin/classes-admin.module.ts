import { Module } from '@nestjs/common';
import { ClassesAdminService } from './classes-admin.service';
import { ClassesAdminController } from './classes-admin.controller';

@Module({
  controllers: [ClassesAdminController],
  providers: [ClassesAdminService],
})
export class ClassesAdminModule {}
