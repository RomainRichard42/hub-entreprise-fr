export interface CompanyDetails {
  siren: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  internal_notes?: string | null;
  status?: 'en_cours' | 'a_faire' | 'termine' | null;
  updated_at?: string;
}

export interface Company {
  siren: string;
  nom_complet: string;
  dirigeants?: Array<{
    nom?: string;
    prenoms?: string;
  }>;
  siege: {
    adresse: string;
    code_postal: string;
    commune: string;
    activite_principale: string;
    tranche_effectif_salarie_etablissement_libelle: string;
  };
  details?: CompanyDetails;
}

export interface CompanyCardProps {
  company: Company;
  onSave: (company: Company, details: CompanyDetails) => Promise<void>;
}