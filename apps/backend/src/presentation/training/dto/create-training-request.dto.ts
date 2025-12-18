import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested
} from 'class-validator';

export class LessonRequestDto {
  @ApiProperty({ description: 'Lesson title', example: 'Introduction to NestJS' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Lesson description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Lesson order in submodule', example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'Video URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({
    description: 'Video provider',
    enum: ['s3', 'cloudflare', 'youtube', 'external'],
    default: 'external',
    required: false,
  })
  @IsOptional()
  @IsString()
  videoProvider?: string;

  @ApiProperty({ description: 'Duration in seconds', default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;
}

export class SubModuleRequestDto {
  @ApiProperty({ description: 'SubModule title', example: 'Getting Started' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'SubModule description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'SubModule order in module', example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'Lessons in this submodule', type: [LessonRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonRequestDto)
  lessons: LessonRequestDto[];
}

export class ModuleRequestDto {
  @ApiProperty({ description: 'Module title', example: 'Fundamentals' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Module description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Module order in training', example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'SubModules in this module', type: [SubModuleRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubModuleRequestDto)
  subModules: SubModuleRequestDto[];
}

export class CreateTrainingRequestDto {
  @ApiProperty({ description: 'Training title', example: 'Complete NestJS Course' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Training description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'complete-nestjs-course',
  })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ description: 'Is published', default: false, required: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ description: 'Order for sorting', default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({ description: 'Modules in this training', type: [ModuleRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleRequestDto)
  modules: ModuleRequestDto[];
}
