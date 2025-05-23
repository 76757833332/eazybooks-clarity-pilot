
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface LogoUploadProps {
  initialLogo: string | null;
  businessName: string;
  onLogoChange: (file: File | null, preview: string | null) => void;
}

export const LogoUpload = ({ initialLogo, businessName, onLogoChange }: LogoUploadProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update logo preview when initialLogo changes
  useEffect(() => {
    setLogoPreview(initialLogo);
  }, [initialLogo]);

  // Generate initials for the avatar fallback
  const getBusinessInitials = () => {
    if (!businessName) return "BIZ";
    return businessName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
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
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setLogoPreview(preview);
        onLogoChange(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    onLogoChange(null, null);
  };

  return (
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
  );
};
