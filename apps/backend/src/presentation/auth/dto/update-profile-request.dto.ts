import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name?: string;

  @ApiProperty({
    description: 'User profile image URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string | null;
}
