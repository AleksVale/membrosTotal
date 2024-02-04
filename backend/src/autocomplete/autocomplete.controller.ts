import { Controller, Get, Query } from '@nestjs/common';
import { AutocompleteService } from './autocomplete.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autocomplete')
@Controller('autocomplete')
export class AutocompleteController {
  constructor(private readonly autocompleteService: AutocompleteService) {}

  @Get()
  findAll(@Query('fields') fields?: string) {
    return this.autocompleteService.findAll(fields);
  }
}
