
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Business } from "@/contexts/auth/types";
import { supabase } from "@/integrations/supabase/client";

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

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !business?.id) return null;
    
    try {
      // Generate a unique file name using current timestamp and random string
      const filePath = `businesses/${business.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${logoFile.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(filePath, logoFile);
      
      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded image
      const { data } = supabase.storage.from('business-logos').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If we have a logo file, upload it to Supabase storage
      let logoUrl = formData.logo_url;
      
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload logo. Other information will still be saved.");
        }
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
