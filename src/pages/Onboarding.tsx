
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessType, UserRole } from "@/types/auth";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, updateOnboardingStep, completeOnboarding, createBusiness } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "sole_proprietor" as BusinessType,
    taxId: "",
    currency: "USD",
    defaultInvoiceTerms: "Payment due within 30 days",
    defaultTaxPercentage: 0,
  });

  useEffect(() => {
    if (profile?.onboarding_completed) {
      navigate("/dashboard");
    } else if (profile) {
      setCurrentStep(profile.onboarding_step);
    }
  }, [profile, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      await updateOnboardingStep(currentStep + 1);
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error("Error updating onboarding step:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBusiness = async () => {
    setIsLoading(true);
    try {
      await createBusiness({
        name: formData.businessName,
        business_type: formData.businessType,
        tax_id: formData.taxId || null,
        currency: formData.currency,
        default_invoice_terms: formData.defaultInvoiceTerms,
        default_tax_percentage: parseFloat(formData.defaultTaxPercentage.toString()) || 0,
      });
      
      await completeOnboarding();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating business:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBusinessOwnerOnboarding = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-md bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Let's set up your business profile. This information will be used across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your business name"
                  required
                  className="bg-secondary/20 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleSelectChange("businessType", value)}
                >
                  <SelectTrigger id="businessType" className="bg-secondary/20 border-border">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleNext}
                disabled={!formData.businessName || isLoading}
                className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
              >
                {isLoading ? "Processing..." : "Next"}
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>
                Configure your business financial details for invoicing and taxation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID/VAT Number (Optional)</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Enter your tax ID or VAT number"
                  className="bg-secondary/20 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange("currency", value)}
                >
                  <SelectTrigger id="currency" className="bg-secondary/20 border-border">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultInvoiceTerms">Default Invoice Terms</Label>
                <Textarea
                  id="defaultInvoiceTerms"
                  name="defaultInvoiceTerms"
                  value={formData.defaultInvoiceTerms}
                  onChange={handleInputChange}
                  placeholder="Payment terms for your invoices"
                  className="bg-secondary/20 border-border"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTaxPercentage">Default Tax Percentage (%)</Label>
                <Input
                  id="defaultTaxPercentage"
                  name="defaultTaxPercentage"
                  type="number"
                  value={formData.defaultTaxPercentage}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-secondary/20 border-border"
                />
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/2 border-border"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateBusiness}
                  disabled={isLoading}
                  className="w-1/2 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                >
                  {isLoading ? "Processing..." : "Complete Setup"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const renderEmployeeOnboarding = () => {
    return (
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Welcome, Employee!</CardTitle>
          <CardDescription>
            Your account has been set up. You'll be notified when your employer adds you to their workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once your employer approves your account, you'll have access to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Your assigned tasks and projects</li>
            <li>Time tracking tools</li>
            <li>Expense submission</li>
            <li>And more, depending on your role</li>
          </ul>
          <Button
            onClick={async () => {
              await completeOnboarding();
              navigate("/dashboard");
            }}
            disabled={isLoading}
            className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
          >
            {isLoading ? "Processing..." : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderClientOnboarding = () => {
    return (
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Welcome, Client!</CardTitle>
          <CardDescription>
            Your account has been created. You'll be able to work with businesses that add you as their client.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            As a client, you'll be able to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Submit job requests to businesses</li>
            <li>Track progress of your projects</li>
            <li>View and pay invoices</li>
            <li>Access your project history</li>
          </ul>
          <Button
            onClick={async () => {
              await completeOnboarding();
              navigate("/dashboard");
            }}
            disabled={isLoading}
            className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
          >
            {isLoading ? "Processing..." : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderOnboardingByRole = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'business_owner':
        return renderBusinessOwnerOnboarding();
      case 'employee':
        return renderEmployeeOnboarding();
      case 'client':
        return renderClientOnboarding();
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Complete Your Setup</h1>
        <p className="text-muted-foreground">
          {profile?.role === 'business_owner' && currentStep === 1 && "Let's set up your business profile"}
          {profile?.role === 'business_owner' && currentStep === 2 && "Configure financial settings"}
          {profile?.role === 'employee' && "Welcome to EazyBooks! Complete your employee profile"}
          {profile?.role === 'client' && "Welcome to EazyBooks! Complete your client profile"}
        </p>
      </div>

      {profile?.role === 'business_owner' && (
        <div className="mb-8 flex w-full max-w-md justify-center">
          <div className="flex w-full items-center">
            <div className={`h-2 w-1/2 ${currentStep >= 1 ? 'bg-eazybooks-purple' : 'bg-gray-300'}`}></div>
            <div className={`h-2 w-1/2 ${currentStep >= 2 ? 'bg-eazybooks-purple' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      )}

      {renderOnboardingByRole()}
    </div>
  );
};

export default Onboarding;
