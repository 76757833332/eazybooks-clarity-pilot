
import React from "react";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { africanCountries } from "@/lib/data/africa";
import { Business } from "@/contexts/auth/types";

interface CountryCurrencySelectorProps {
  formData: Partial<Business>;
  handleSelectChange: (name: string, value: string) => void;
}

export const CountryCurrencySelector = ({
  formData,
  handleSelectChange,
}: CountryCurrencySelectorProps) => {
  // Get selected country data
  const selectedCountry = africanCountries.find(
    country => country.code === formData.country
  );

  // When country changes, update currency if it's not already set
  const handleCountryChange = (code: string) => {
    handleSelectChange("country", code);
    const country = africanCountries.find(c => c.code === code);
    if (country && (!formData.currency || formData.currency === "")) {
      handleSelectChange("currency", country.currency.code);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          Country
        </Label>
        <Select
          value={formData.country || ""}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {africanCountries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={formData.currency || ""}
          onValueChange={(value) => handleSelectChange("currency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {africanCountries.map((country) => (
              <SelectItem key={country.currency.code} value={country.currency.code}>
                {country.currency.name} ({country.currency.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCountry && (
          <p className="text-xs text-muted-foreground mt-1">
            Default currency for {selectedCountry.name}: {selectedCountry.currency.name} ({selectedCountry.currency.symbol})
          </p>
        )}
      </div>
    </div>
  );
};
