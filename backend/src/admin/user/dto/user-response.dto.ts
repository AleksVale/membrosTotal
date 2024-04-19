import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from './profile.dto';

export class UserResponseDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  document!: string;

  @ApiProperty()
  birthDate!: Date;

  @ApiProperty()
  instagram!: string;

  @ApiProperty()
  pixKey!: string;

  @ApiProperty()
  photoKey!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  profileId!: number;

  @ApiProperty({ type: () => ProfileDTO })
  Profile!: ProfileDTO;
}
