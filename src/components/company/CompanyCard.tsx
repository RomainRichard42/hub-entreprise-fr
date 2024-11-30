import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanyCardProps } from "@/types/company";

export const CompanyCard = ({ company, onSave }: CompanyCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const details = {
      siren: company.siren,
      phone: formData.get("phone") as string || null,
      email: formData.get("email") as string || null,
      website: formData.get("website") as string || null,
      internal_notes: formData.get("internal_notes") as string || null,
    };
    
    try {
      await onSave(company, details);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving company details:", error);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-semibold">{company.nom_complet}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                name="phone"
                defaultValue={company.details?.phone || ""}
                placeholder="Téléphone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                defaultValue={company.details?.email || ""}
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Site web</label>
              <Input
                name="website"
                type="url"
                defaultValue={company.details?.website || ""}
                placeholder="Site web"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes internes</label>
              <Textarea
                name="internal_notes"
                defaultValue={company.details?.internal_notes || ""}
                placeholder="Notes internes"
              />
            </div>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </form>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">SIREN:</span> {company.siren}</p>
            <p><span className="font-medium">Dirigeant:</span> {company.dirigeants?.[0]?.nom} {company.dirigeants?.[0]?.prenoms}</p>
            <p><span className="font-medium">Adresse:</span> {company.siege.adresse}</p>
            <p><span className="font-medium">Code postal:</span> {company.siege.code_postal}</p>
            <p><span className="font-medium">Ville:</span> {company.siege.commune}</p>
            <p><span className="font-medium">Activité:</span> {company.siege.activite_principale}</p>
            {company.details && (
              <>
                {company.details.phone && <p><span className="font-medium">Téléphone:</span> {company.details.phone}</p>}
                {company.details.email && <p><span className="font-medium">Email:</span> {company.details.email}</p>}
                {company.details.website && (
                  <p>
                    <span className="font-medium">Site web:</span>{" "}
                    <a href={company.details.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.details.website}
                    </a>
                  </p>
                )}
                {company.details.internal_notes && (
                  <p><span className="font-medium">Notes:</span> {company.details.internal_notes}</p>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};