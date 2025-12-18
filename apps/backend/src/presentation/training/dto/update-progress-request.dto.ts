import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProgressRequestDto {
  @ApiProperty({
    description: 'Whether the lesson is completed',
    example: true,
  })
  @IsBoolean()
  isCompleted: boolean;
}
