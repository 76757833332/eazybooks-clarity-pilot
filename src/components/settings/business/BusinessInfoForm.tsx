
import React from "react";
import { BasicBusinessInfo } from "./BasicBusinessInfo";
import { CountryCurrencySelector } from "./CountryCurrencySelector";
import { AddressFields } from "./AddressFields";
import { ContactFields } from "./ContactFields";
import { Business } from "@/contexts/auth/types";

interface BusinessInfoFormProps {
  formData: Partial<Business>;
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
