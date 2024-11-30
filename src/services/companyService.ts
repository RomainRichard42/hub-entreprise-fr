import { supabase } from "@/integrations/supabase/client";
import { CompanyDetails } from "@/types/company";

interface SearchParams {
  query?: string;
  postalCode?: string;
  page?: number;
  perPage?: number;
}

export const searchCompanies = async ({ query, postalCode, page = 1, perPage = 10 }: SearchParams) => {
  const searchParams = new URLSearchParams();
  
  if (query) searchParams.append('q', query);
  if (postalCode) searchParams.append('code_postal', postalCode);
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

export const updateCompanyDetails = async (details: CompanyDetails) => {
  if (!details.siren) {
    throw new Error('SIREN is required');
  }

  console.log('Updating company details:', details);

  const { data, error } = await supabase
    .from('company_details')
    .upsert(
      { 
        siren: details.siren,
        phone: details.phone || null,
        email: details.email || null,
        website: details.website || null,
        internal_notes: details.internal_notes || null
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

  console.log('Update successful:', data);
  return data;
};