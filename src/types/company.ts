export interface CompanyDetails {
  siren: string;
  phone?: string;
  email?: string;
  website?: string;
  internal_notes?: string;
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