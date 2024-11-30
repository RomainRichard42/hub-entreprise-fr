export interface SearchFormProps {
  searchQuery: string;
  postalCode: string;
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}