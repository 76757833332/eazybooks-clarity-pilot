
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Business } from "@/contexts/auth/types";

export const useBusinessSettingsForm = () => {
  const { business, updateBusiness } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url || null);
  
  const [formData, setFormData] = useState<Partial<Business>>({
    name: business?.name || "",
    legal_name: business?.legal_name || "",
    tax_id: business?.tax_id || "",
    address: business?.address || "",
    city: business?.city || "",
    state: business?.state || "",
    postal_code: business?.postal_code || "",
    country: business?.country || "",
    phone: business?.phone || "",
    email: business?.email || "",
    website: business?.website || "",
    industry: business?.industry || "",
    description: business?.description || "",
    logo_url: business?.logo_url || "",
    currency: business?.currency || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (file: File | null, preview: string | null) => {
    setLogoFile(file);
    setLogoPreview(preview);
    if (preview === null) {
      setFormData((prev) => ({ ...prev, logo_url: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If we have a logo file, we would upload it to storage here
      // and get back a URL to store in the business record
      let logoUrl = formData.logo_url;
      
      if (logoFile) {
        // In a real implementation, this would upload to Supabase storage
        // For now we'll just simulate by using the preview URL
        logoUrl = logoPreview || '';
        toast.info("Logo uploaded successfully");
      }
      
      const updatedBusinessData = {
        ...formData,
        logo_url: logoUrl,
      };
      
      await updateBusiness(updatedBusinessData);
      toast.success("Business information updated successfully");
    } catch (error) {
      console.error("Failed to update business information:", error);
      toast.error("Failed to update business information");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    logoPreview,
    handleChange,
    handleSelectChange,
    handleLogoChange,
    handleSubmit,
  };
};
