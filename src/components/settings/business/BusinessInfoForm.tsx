
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { africanCountries } from "@/lib/data/africa";
import { Globe } from "lucide-react";

interface BusinessInfoFormProps {
  formData: {
    name: string;
    legal_name: string;
    tax_id: string;
    industry: string;
    description: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    currency: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const BusinessInfoForm = ({
  formData,
  handleChange,
  handleSelectChange,
}: BusinessInfoFormProps) => {
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Business Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="legal_name">Legal Business Name</Label>
          <Input
            id="legal_name"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleChange}
            placeholder="Legal Business Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
          <Input
            id="tax_id"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            placeholder="Tax ID or VAT Number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleSelectChange("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accounting">Accounting</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="it">Information Technology</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your business"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Country
          </Label>
          <Select
            value={formData.country}
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
            value={formData.currency}
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

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street Address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State or Province"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="Postal Code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Business Phone Number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="business@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourbusiness.com"
          />
        </div>
      </div>
    </>
  );
};
