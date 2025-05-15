
import React from "react";
import { BasicBusinessInfo } from "./BasicBusinessInfo";
import { CountryCurrencySelector } from "./CountryCurrencySelector";
import { AddressFields } from "./AddressFields";
import { ContactFields } from "./ContactFields";

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
  return (
    <>
      <BasicBusinessInfo 
        formData={formData} 
        handleChange={handleChange} 
        handleSelectChange={handleSelectChange} 
      />

      <CountryCurrencySelector
        formData={formData}
        handleSelectChange={handleSelectChange}
      />

      <AddressFields
        formData={formData}
        handleChange={handleChange}
      />

      <ContactFields
        formData={formData}
        handleChange={handleChange}
      />
    </>
  );
};
