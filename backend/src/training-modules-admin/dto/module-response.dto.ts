// module.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { SubmoduleDTO } from 'src/sub-modules-admin/dto/sub-modules-response.dto';

export class ModuleDTO {
  @ApiProperty({ type: Number, description: 'Module ID' })
  id!: number;

  @ApiProperty({ type: String, description: 'Module title' })
  title!: string;

  @ApiProperty({
    type: String,
    description: 'Module description',
    required: false,
  })
  description?: string;

  @ApiProperty({ type: String, description: 'Thumbnail URL', required: false })
  thumbnail?: string;

  @ApiProperty({
    type: [SubmoduleDTO],
    isArray: true,
    description: 'List of submodules',
  })
  submodules!: SubmoduleDTO[];
}

export class GetModuleResponse {
  @ApiProperty({
    type: ModuleDTO,
  })
  module!: ModuleDTO;

  @ApiProperty({ type: String })
  stream!: string;
}
