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
  const [nafCode, setNafCode] = useState("");
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["companies", page, searchQuery, postalCode, nafCode],
    queryFn: () => searchCompanies({ 
      query: searchQuery || undefined,
      postalCode: postalCode || undefined,
      nafCode: nafCode || undefined,
      page,
      perPage: 10
    }),
    enabled: Boolean(searchQuery || postalCode || nafCode)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery && !postalCode && !nafCode) {
      toast({
        title: "Erreur de recherche",
        description: "Veuillez entrer au moins un critère de recherche",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-float">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Annuaire des Entreprises
          </h1>
          <p className="text-secondary text-lg">
            Recherchez et gérez les informations des entreprises françaises
          </p>
        </div>

        <SearchForm
          searchQuery={searchQuery}
          postalCode={postalCode}
          nafCode={nafCode}
          onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
          onPostalCodeChange={(e) => setPostalCode(e.target.value)}
          onNafCodeChange={(e) => setNafCode(e.target.value)}
          onSubmit={handleSearch}
        />

        {error && (
          <div className="text-center text-red-500 animate-fade-in">
            Une erreur est survenue lors de la recherche
          </div>
        )}

        {isLoading ? (
          <div className="text-center animate-pulse">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.results && data.results.length > 0 ? (
                data.results.map((company: Company) => (
                  <div key={company.siren} className="card-hover">
                    <CompanyCard 
                      company={company} 
                      onSave={handleSave}
                    />
                  </div>
                ))
              ) : (
                searchQuery || postalCode || nafCode ? (
                  <div className="col-span-full text-center text-gray-500 animate-fade-in">
                    Aucune entreprise trouvée
                  </div>
                ) : null
              )}
            </div>

            {data?.results && data.results.length > 0 && (
              <div className="flex justify-center gap-4 items-center mt-8 animate-fade-in">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="transition-transform hover:-translate-x-1"
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
                  className="transition-transform hover:translate-x-1"
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