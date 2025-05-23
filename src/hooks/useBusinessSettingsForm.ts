
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Business } from "@/contexts/auth/types";
import { supabase } from "@/integrations/supabase";

export const useBusinessSettingsForm = () => {
  const { business, updateBusiness, createBusiness, user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Business>>({
    name: "",
    legal_name: "",
    tax_id: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    industry: "",
    description: "",
    logo_url: "",
    currency: "USD",
  });

  // Update form data when business information changes
  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        legal_name: business.legal_name || "",
        tax_id: business.tax_id || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        postal_code: business.postal_code || "",
        country: business.country || "",
        phone: business.phone || "",
        email: business.email || "",
        website: business.website || "",
        industry: business.industry || "",
        description: business.description || "",
        logo_url: business.logo_url || "",
        currency: business.currency || "USD",
      });
      setLogoPreview(business.logo_url || null);
    }
  }, [business]);

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

  const createStorageBucketIfNeeded = async () => {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'business-logos');
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('business-logos', { 
          public: true,
          fileSizeLimit: 2097152 // 2MB in bytes
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error checking/creating bucket:", error);
      return false;
    }
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    try {
      // Create business-logos bucket if it doesn't exist
      const bucketReady = await createStorageBucketIfNeeded();
      
      if (!bucketReady) {
        throw new Error("Could not prepare storage for logo upload");
      }
      
      // Generate a unique file name using current timestamp and random string
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `businesses/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });
      
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
    
    if (!formData.name) {
      toast.error("Business name is required");
      return;
    }
    
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
      
      if (business?.id) {
        // Update existing business
        await updateBusiness(updatedBusinessData);
      } else if (user) {
        // Create new business
        await createBusiness(updatedBusinessData);
      }
      
      // No need for toast here as the functions have their own toast calls
    } catch (error) {
      console.error("Failed to save business information:", error);
      toast.error("Failed to save business information");
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
