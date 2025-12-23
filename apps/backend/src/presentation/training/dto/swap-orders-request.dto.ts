import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class SwapOrdersRequestDto {
  @ApiProperty({
    description: 'First item ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  id1: string;

  @ApiProperty({
    description: 'Second item ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsUUID()
  id2: string;
}
