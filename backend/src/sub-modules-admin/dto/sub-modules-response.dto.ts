import { ApiProperty } from '@nestjs/swagger';
import { LessonResponseDTO } from 'src/lessons-admin/dto/lessos-response.dto';

export class SubmoduleDTO {
  @ApiProperty({ type: Number, description: 'Submodule ID' })
  id!: number;

  @ApiProperty({ type: String, description: 'Submodule title' })
  title!: string;

  @ApiProperty({
    type: String,
    description: 'Submodule description',
    required: false,
  })
  description?: string;

  @ApiProperty({ type: String, description: 'Thumbnail URL', required: false })
  thumbnail?: string;

  @ApiProperty({
    type: [LessonResponseDTO],
    description: 'Lessons in the submodule',
    required: false,
    isArray: true,
  })
  lessons!: LessonResponseDTO[];

  @ApiProperty({ type: Number, description: 'Module id' })
  moduleId!: number;
}
