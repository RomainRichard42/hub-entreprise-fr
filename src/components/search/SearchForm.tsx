import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchFormProps } from "@/types/search";

export const SearchForm = ({ 
  searchQuery, 
  postalCode, 
  nafCode,
  onSearchQueryChange, 
  onPostalCodeChange, 
  onNafCodeChange, 
  onSubmit 
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Rechercher par nom, activité..."
          className="pl-10"
          value={searchQuery}
          onChange={onSearchQueryChange}
        />
      </div>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Code postal"
          value={postalCode}
          onChange={onPostalCodeChange}
        />
      </div>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Code NAF"
          value={nafCode}
          onChange={onNafCodeChange}
        />
      </div>
      <Button type="submit">Rechercher</Button>
    </form>
  );
};