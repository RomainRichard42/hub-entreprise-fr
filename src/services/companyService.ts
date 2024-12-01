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

export const getModifiedCompanies = async () => {
  console.log('Fetching modified companies...');
  
  const { data: details, error } = await supabase
    .from('company_details')
    .select('*')
    .not('status', 'is', null);

  if (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }

  console.log('Found details:', details);

  // Process each company with retry logic
  const companies = await Promise.all(
    (details || []).map(async (detail) => {
      console.log('Fetching details for SIREN:', detail.siren);
      
      const maxRetries = 3;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Direct API call instead of Edge Function
          const response = await fetch(
            `https://recherche-entreprises.api.gouv.fr/search?q=${detail.siren}`,
            { headers: { 'Accept': 'application/json' }}
          );

          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }

          const data = await response.json();
          const companyData = data.results.find(c => c.siren === detail.siren);
          
          if (!companyData) {
            throw new Error('Company not found');
          }

          console.log('Company data received:', companyData);
          
          return {
            ...companyData,
            details: detail
          };
        } catch (error) {
          if (attempt === maxRetries - 1) {
            console.error(`Failed to fetch company ${detail.siren} after ${maxRetries} attempts:`, error);
            return null;
          }
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
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