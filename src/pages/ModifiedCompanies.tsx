import { useQuery } from "@tanstack/react-query";
import { getModifiedCompanies, updateCompanyDetails } from "../services/companyService";
import { useToast } from "@/components/ui/use-toast";
import { CompanyCard } from "@/components/company/CompanyCard";
import { Company, CompanyDetails } from "@/types/company";

const ModifiedCompanies = () => {
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["modified-companies"],
    queryFn: () => getModifiedCompanies()
  });

  const handleSave = async (company: Company, details: CompanyDetails) => {
    try {
      await updateCompanyDetails(details);
      toast({
        title: "Succès",
        description: "Les informations ont été mises à jour",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Une erreur est survenue lors du chargement des entreprises
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Entreprises Modifiées</h1>
        <p className="text-secondary text-lg">Liste des entreprises avec un statut assigné</p>
      </div>

      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data && data.length > 0 ? (
            data.map((company: Company) => (
              <CompanyCard 
                key={company.siren}
                company={company} 
                onSave={handleSave}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              Aucune entreprise modifiée trouvée
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ModifiedCompanies;