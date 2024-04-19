import { Module } from '@nestjs/common';

import { AwsService } from 'src/common/aws/aws.service';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { RefundsRepository } from './refunds.repository';

@Module({
  controllers: [RefundsController],
  providers: [RefundsService, RefundsRepository, AwsService],
})
export class RefundsModule {}
