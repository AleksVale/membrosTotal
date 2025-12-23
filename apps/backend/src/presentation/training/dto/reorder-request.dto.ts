import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ReorderRequestDto {
  @ApiProperty({
    description: 'New order position (1-based)',
    example: 2,
  })
  @IsInt()
  @Min(1)
  newOrder: number;
}
