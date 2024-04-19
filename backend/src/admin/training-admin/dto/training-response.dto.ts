// training.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ModuleDTO } from 'src/admin/training-modules-admin/dto/module-response.dto';

export class TrainingDTO {
  @ApiProperty({ type: Number, description: 'Training ID' })
  id!: number;

  @ApiProperty({ type: String, description: 'Training title' })
  title!: string;

  @ApiProperty({ type: String, description: 'Training description' })
  description!: string;

  @ApiProperty({ type: String, description: 'Tutor name' })
  tutor!: string;

  @ApiProperty({ type: String, description: 'Thumbnail URL', required: false })
  thumbnail?: string;

  @ApiProperty({ type: Date, description: 'Date and time of creation' })
  createdAt!: Date;

  @ApiProperty({ type: Date, description: 'Date and time of last update' })
  updatedAt!: Date;

  @ApiProperty({ type: [ModuleDTO], description: 'List of modules' })
  modules!: ModuleDTO[];
}

export class GetTrainingResponse {
  training!: TrainingDTO;
  stream!: ArrayBuffer;
}
