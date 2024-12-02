import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchFormProps } from "@/types/search";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

export const SearchForm = ({ 
  searchQuery, 
  postalCode,
  nafCode,
  onSearchQueryChange, 
  onPostalCodeChange,
  onNafCodeChange,
  onSubmit 
}: SearchFormProps) => {
  const [localNafCode, setLocalNafCode] = useState(nafCode);

  // Debounced NAF code change handler
  const debouncedNafChange = debounce((value: string) => {
    onNafCodeChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  }, 300);

  useEffect(() => {
    setLocalNafCode(nafCode);
  }, [nafCode]);

  const handleNafCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalNafCode(value);
    debouncedNafChange(value);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto animate-fade-in">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary" size={20} />
        <Input
          type="text"
          placeholder="Rechercher par nom, activité..."
          className="pl-10 input-focus"
          value={searchQuery}
          onChange={onSearchQueryChange}
        />
      </div>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Code postal"
          className="input-focus"
          value={postalCode}
          onChange={onPostalCodeChange}
        />
      </div>
      <div className="relative flex-1 group">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary" size={20} />
        <Input
          type="text"
          placeholder="Code NAF"
          className="pl-10 input-focus"
          value={localNafCode}
          onChange={handleNafCodeChange}
        />
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90 transition-colors">
        Rechercher
      </Button>
    </form>
  );
};