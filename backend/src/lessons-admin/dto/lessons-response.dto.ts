// lesson.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class LessonResponseDTO {
  @ApiProperty({ type: Number, description: 'Lesson ID' })
  id!: number;

  @ApiProperty({ type: String, description: 'Lesson title' })
  title!: string;

  @ApiProperty({
    type: String,
    description: 'Lesson description',
    required: false,
  })
  description?: string;

  @ApiProperty({ type: String, description: 'Content URL' })
  content!: string;

  @ApiProperty({ type: String, description: 'Thumbnail URL', required: false })
  thumbnail?: string;

  submoduleId!: number;
}

export class GetLessonResponse {
  @ApiProperty({ type: LessonResponseDTO })
  lesson!: LessonResponseDTO;
  @ApiProperty()
  stream!: string;
}
