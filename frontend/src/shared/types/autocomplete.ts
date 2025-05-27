
export interface AutocompleteItem {
  id: number;
  label?: string;
  name?: string;
}

export interface UserAutocompleteItem extends AutocompleteItem {
  fullName: string;
}

export interface AutocompleteResponse {
  profiles?: AutocompleteItem[];
  users?: UserAutocompleteItem[];
  paymentTypes?: AutocompleteItem[];
  paymentRequest?: AutocompleteItem[];
  refundTypes?: AutocompleteItem[];
  experts?: UserAutocompleteItem[];
  trainings?: AutocompleteItem[];
  modules?: AutocompleteItem[];
  submodules?: AutocompleteItem[];
}