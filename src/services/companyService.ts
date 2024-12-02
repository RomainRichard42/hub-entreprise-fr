import { supabase } from "@/integrations/supabase/client";
import { CompanyDetails } from "@/types/company";

interface SearchParams {
  query?: string;
  postalCode?: string;
  nafCode?: string;
  page?: number;
  perPage?: number;
}

export const searchCompanies = async ({ query, postalCode, nafCode, page = 1, perPage = 10 }: SearchParams) => {
  const searchParams = new URLSearchParams();
  
  if (query) searchParams.append('q', query);
  if (postalCode) searchParams.append('code_postal', postalCode);
  if (nafCode) searchParams.append('activite_principale', nafCode);
  searchParams.append('page', page.toString());
  searchParams.append('per_page', perPage.toString());

  const { data: companiesData, error: searchError } = await supabase.functions.invoke('search-companies', {
    body: { searchParams: searchParams.toString() }
  });

  if (searchError) {
    console.error('Error searching companies:', searchError);
    throw searchError;
  }

  // Fetch company details from our database
  if (companiesData?.results) {
    const sirens = companiesData.results.map((company: any) => company.siren);
    const { data: details } = await supabase
      .from('company_details')
      .select('*')
      .in('siren', sirens);

    // Merge details with company data
    companiesData.results = companiesData.results.map((company: any) => ({
      ...company,
      details: details?.find(d => d.siren === company.siren)
    }));
  }

  return companiesData;
};

export const getModifiedCompanies = async () => {
  console.log('Fetching modified companies...');
  
  // Récupérer uniquement les entreprises qui ont un statut
  const { data: details, error } = await supabase
    .from('company_details')
    .select('*')
    .not('status', 'is', null);

  if (error) {
    console.error('Error fetching modified companies:', error);
    throw error;
  }

  console.log('Found details:', details);

  if (!details || details.length === 0) {
    console.log('No companies with status found');
    return [];
  }

  // Pour chaque entreprise avec des détails, récupérer les informations complètes
  const companies = await Promise.all(
    details.map(async (detail) => {
      console.log('Fetching details for SIREN:', detail.siren);
      
      const { data: companyData } = await supabase.functions.invoke('search-companies', {
        body: { searchParams: `siren=${detail.siren}` }
      });

      console.log('Company data received:', companyData);

      if (companyData?.results?.[0]) {
        return {
          ...companyData.results[0],
          details: detail
        };
      }
      return null;
    })
  );

  const validCompanies = companies.filter(Boolean);
  console.log('Final companies list:', validCompanies);

  return validCompanies;
};

export const updateCompanyDetails = async (details: CompanyDetails) => {
  if (!details.siren) {
    throw new Error('SIREN is required');
  }

  const { data, error } = await supabase
    .from('company_details')
    .upsert(
      { 
        siren: details.siren,
        phone: details.phone || null,
        email: details.email || null,
        website: details.website || null,
        internal_notes: details.internal_notes || null,
        status: details.status || null
      },
      { 
        onConflict: 'siren',
        ignoreDuplicates: false 
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data;
};