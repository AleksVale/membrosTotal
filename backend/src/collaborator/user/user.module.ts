import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/admin/user/user.repository';
import { AwsService } from 'src/common/aws/aws.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, AwsService],
})
export class UserModule {}
