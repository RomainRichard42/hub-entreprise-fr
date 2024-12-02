export interface SearchFormProps {
  searchQuery: string;
  postalCode: string;
  nafCode: string;
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNafCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}