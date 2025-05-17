
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoUpload } from "@/components/settings/business/LogoUpload";
import { BusinessInfoForm } from "@/components/settings/business/BusinessInfoForm";
import { useBusinessSettingsForm } from "@/hooks/useBusinessSettingsForm";
import { useAuth } from "@/contexts/auth";
import { Spinner } from "@/components/ui/spinner";

const BusinessSettings = () => {
  const { loading: authLoading } = useAuth();
  const {
    formData,
    isLoading,
    logoPreview,
    handleChange,
    handleSelectChange,
    handleLogoChange,
    handleSubmit,
  } = useBusinessSettingsForm();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="text-center">
          <Spinner className="h-8 w-8 text-eazybooks-purple mx-auto mb-4" />
          <p>Loading business information...</p>
        </div>
      </div>
    );
  }

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
            <LogoUpload 
              initialLogo={logoPreview} 
              businessName={formData.name || ""} 
              onLogoChange={handleLogoChange} 
            />

            {/* Business Information Form */}
            <BusinessInfoForm 
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default BusinessSettings;
