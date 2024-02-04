import { PartialType } from '@nestjs/swagger';
import { CreateAutocompleteDto } from './create-autocomplete.dto';

export class UpdateAutocompleteDto extends PartialType(CreateAutocompleteDto) {}
