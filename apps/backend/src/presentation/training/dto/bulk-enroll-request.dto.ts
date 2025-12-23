import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class BulkEnrollRequestDto {
  @ApiProperty({
    description: 'Array of user IDs to enroll',
    type: [String],
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  userIds: string[];
}
