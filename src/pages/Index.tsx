import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { searchCompanies, updateCompanyDetails } from "../services/companyService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CompanyCard } from "@/components/company/CompanyCard";
import { SearchForm } from "@/components/search/SearchForm";
import { Company, CompanyDetails } from "@/types/company";

const Index = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["companies", page, searchQuery, postalCode],
    queryFn: () => searchCompanies({ 
      query: searchQuery || undefined,
      postalCode: postalCode || undefined,
      page,
      perPage: 10
    }),
    enabled: Boolean(searchQuery || postalCode)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery && !postalCode) {
      toast({
        title: "Erreur de recherche",
        description: "Veuillez entrer un terme de recherche ou un code postal",
        variant: "destructive"
      });
      return;
    }
    refetch();
  };

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Annuaire des Entreprises</h1>
          <p className="text-secondary text-lg">Recherchez et gérez les informations des entreprises françaises</p>
        </div>

        <SearchForm
          searchQuery={searchQuery}
          postalCode={postalCode}
          onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
          onPostalCodeChange={(e) => setPostalCode(e.target.value)}
          onSubmit={handleSearch}
        />

        {error && (
          <div className="text-center text-red-500">
            Une erreur est survenue lors de la recherche
          </div>
        )}

        {isLoading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.results && data.results.length > 0 ? (
                data.results.map((company: Company) => (
                  <CompanyCard 
                    key={company.siren}
                    company={company} 
                    onSave={handleSave}
                  />
                ))
              ) : (
                searchQuery || postalCode ? (
                  <div className="col-span-full text-center text-gray-500">
                    Aucune entreprise trouvée
                  </div>
                ) : null
              )}
            </div>

            {data?.results && data.results.length > 0 && (
              <div className="flex justify-center gap-4 items-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-secondary">
                  Page {page}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data?.results.length}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;