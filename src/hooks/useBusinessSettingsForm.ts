
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Business } from "@/contexts/auth/types";
import { supabase } from "@/integrations/supabase/client";

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

  const ensureStorageBucketExists = async () => {
    try {
      // First, try to get the bucket to see if it exists
      const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket('business-logos');
      
      if (existingBucket) {
        console.log('Bucket business-logos already exists');
        return true;
      }

      // If bucket doesn't exist, create it
      if (getBucketError?.message?.includes('not found') || getBucketError?.message?.includes('does not exist')) {
        console.log('Creating business-logos bucket...');
        const { error: createError } = await supabase.storage.createBucket('business-logos', { 
          public: true,
          fileSizeLimit: 5242880, // 5MB in bytes
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          return false;
        }
        
        console.log('Bucket business-logos created successfully');
        return true;
      }
      
      console.error("Error checking bucket:", getBucketError);
      return false;
    } catch (error) {
      console.error("Error in ensureStorageBucketExists:", error);
      return false;
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    try {
      console.log('Starting logo upload process...');
      
      // Ensure the bucket exists
      const bucketReady = await ensureStorageBucketExists();
      
      if (!bucketReady) {
        console.error("Could not prepare storage bucket for logo upload");
        toast.error("Could not prepare storage for logo upload");
        return null;
      }
      
      // Generate a unique file name
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `businesses/${fileName}`;
      
      console.log('Uploading file to path:', filePath);
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Failed to upload logo: ${uploadError.message}`);
        return null;
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('business-logos')
        .getPublicUrl(filePath);
      
      console.log('Generated public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo due to an unexpected error');
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
      console.log('Starting business information save...');
      
      // If we have a logo file, upload it to Supabase storage
      let logoUrl = formData.logo_url;
      
      if (logoFile) {
        console.log('Uploading new logo...');
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
          console.log('Logo uploaded successfully:', logoUrl);
          // Immediately reflect the uploaded URL in local state so it "sticks"
          setFormData((prev) => ({ ...prev, logo_url: logoUrl || "" }));
          setLogoPreview(logoUrl);
        } else {
          toast.error("Failed to upload logo. Other information will still be saved.");
        }
      }
      
      const updatedBusinessData = {
        ...formData,
        logo_url: logoUrl,
      };
      
      console.log('Saving business data:', updatedBusinessData);
      
      if (business?.id) {
        // Update existing business
        await updateBusiness(updatedBusinessData);
      } else if (user) {
        // Create new business
        await createBusiness(updatedBusinessData);
      }
      
      // Clear the logo file after successful save
      setLogoFile(null);
      
      console.log('Business information saved successfully');
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
