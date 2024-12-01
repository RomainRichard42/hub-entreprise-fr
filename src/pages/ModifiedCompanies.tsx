import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getModifiedCompanies, updateCompanyDetails } from "../services/companyService";
import { useToast } from "@/components/ui/use-toast";
import { CompanyCard } from "@/components/company/CompanyCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CompanyDetails {
  siren: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  internal_notes?: string | null;
  status?: 'en_cours' | 'a_faire' | 'termine' | null;
  updated_at?: string;
}

interface Company extends CompanyDetails {
  siren: string;
}

type StatusFilter = 'all' | 'en_cours' | 'a_faire' | 'termine';

const ModifiedCompanies = () => {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: companies = [], isLoading, error, refetch } = useQuery<Company[]>({
    queryKey: ["modified-companies"],
    queryFn: getModifiedCompanies // Direct function call, no need for wrapper
  });

  const handleSave = async (company: Company, details: CompanyDetails) => {
    try {
      const response = await updateCompanyDetails(details);
      if (!response.ok) {
        throw new Error('Failed to update company');
      }
      
      toast({
        title: "Succès",
        description: "Les informations ont été mises à jour",
      });
      refetch();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive"
      });
    }
  };

  const filteredCompanies = companies.filter(company => 
    statusFilter === 'all' || company.details?.status === statusFilter
  );

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <RadioGroup
        defaultValue="all"
        onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        className="flex gap-4 mb-4"
      >
        <div>
          <RadioGroupItem value="all" id="all" />
          <label htmlFor="all">Tous</label>
        </div>
        <div>
          <RadioGroupItem value="en_cours" id="en_cours" />
          <label htmlFor="en_cours">En cours</label>
        </div>
        <div>
          <RadioGroupItem value="a_faire" id="a_faire" />
          <label htmlFor="a_faire">À faire</label>
        </div>
        <div>
          <RadioGroupItem value="termine" id="termine" />
          <label htmlFor="termine">Terminé</label>
        </div>
      </RadioGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map(company => (
          <CompanyCard
            key={company.siren}
            company={company}
            onSave={(details) => handleSave(company, details)}
          />
        ))}
        
        {filteredCompanies.length === 0 && (
          <div>Aucune entreprise trouvée</div>
        )}
      </div>
    </div>
  );
};

export default ModifiedCompanies;