import { Module } from '@nestjs/common';
import { UtmParamService } from './utm-param.service';
import { UtmParamController } from './utm-param.controller';
import { UtmParamRepository } from 'src/repositories/utm-param.repository';

@Module({
  controllers: [UtmParamController],
  providers: [UtmParamService, UtmParamRepository],
})
export class UtmParamModule {}
