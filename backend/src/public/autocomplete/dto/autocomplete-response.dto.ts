import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AutocompleteResponse {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  label!: string;
}

class UserAutocomplete {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  fullName!: string;
}

export class AutocompleteResponseDto {
  @ApiPropertyOptional({
    type: AutocompleteResponse,
    isArray: true,
  })
  profiles?: AutocompleteResponse[];

  @ApiPropertyOptional({
    type: UserAutocomplete,
    isArray: true,
  })
  users?: UserAutocomplete[];

  @ApiPropertyOptional({
    type: AutocompleteResponse,
    isArray: true,
  })
  paymentTypes?: AutocompleteResponse[];

  @ApiPropertyOptional({
    type: AutocompleteResponse,
    isArray: true,
  })
  paymentRequest?: AutocompleteResponse[];

  @ApiPropertyOptional({
    type: AutocompleteResponse,
    isArray: true,
  })
  refundTypes?: AutocompleteResponse[];

  @ApiPropertyOptional({
    type: AutocompleteResponse,
    isArray: true,
  })
  trainings?: AutocompleteResponse[];
}
