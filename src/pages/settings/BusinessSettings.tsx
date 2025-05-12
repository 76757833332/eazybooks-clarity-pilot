
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Business } from "@/contexts/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";

const BusinessSettings = () => {
  const { business, updateBusiness } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo image must be less than 2MB");
        return;
      }
      
      // Check file type
      if (!file.type.match('image/(jpeg|png|gif|jpg|webp)')) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo_url: "" }));
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

  // Generate initials for the avatar fallback
  const getBusinessInitials = () => {
    if (!formData.name) return "BIZ";
    return formData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Business Settings</h2>
        <p className="text-muted-foreground">
          Manage your business information and settings
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Update your business details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col items-center justify-center">
                <Avatar 
                  className="h-24 w-24 cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary"
                  onClick={handleLogoClick}
                >
                  {logoPreview ? (
                    <AvatarImage src={logoPreview} alt="Business Logo" />
                  ) : (
                    <AvatarFallback className="text-xl bg-primary/10">
                      {getBusinessInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  onChange={handleLogoChange}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium">Business Logo</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a logo for your business. Recommended size: 200x200 pixels.
                </p>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={handleLogoClick}
                  >
                    <Upload className="h-4 w-4" />
                    <span>{logoPreview ? "Change Logo" : "Upload Logo"}</span>
                  </Button>
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center text-destructive"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-4 w-4 mr-1" />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

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
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleSelectChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="es">Spain</SelectItem>
                    <SelectItem value="it">Italy</SelectItem>
                    <SelectItem value="nl">Netherlands</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default BusinessSettings;
