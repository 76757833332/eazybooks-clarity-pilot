
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BusinessType } from "@/types/auth";

const businessTypes = [
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "corporation", label: "Corporation" },
  { value: "freelancer", label: "Freelancer" },
  { value: "other", label: "Other" },
];

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
];

const BusinessSettings = () => {
  const { business, user } = useAuth();
  
  const [businessName, setBusinessName] = useState(business?.name || "");
  const [businessType, setBusinessType] = useState<BusinessType>(business?.business_type || "sole_proprietor");
  const [taxId, setTaxId] = useState(business?.tax_id || "");
  const [currency, setCurrency] = useState(business?.currency || "USD");
  const [defaultTaxPercentage, setDefaultTaxPercentage] = useState(String(business?.default_tax_percentage || 0));
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here we would call an API to update the business settings
      toast.success("Business details updated successfully");
    } catch (error: any) {
      toast.error("Failed to update business details: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium">Business Name</label>
              <Input 
                id="businessName" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business Name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessType" className="text-sm font-medium">Business Type</label>
              <Select 
                value={businessType} 
                onValueChange={(value) => setBusinessType(value as BusinessType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="taxId" className="text-sm font-medium">Tax ID / EIN</label>
              <Input 
                id="taxId" 
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="XX-XXXXXXX"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">Default Currency</label>
              <Select 
                value={currency} 
                onValueChange={setCurrency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="defaultTax" className="text-sm font-medium">Default Tax Rate (%)</label>
              <Input 
                id="defaultTax" 
                type="number"
                value={defaultTaxPercentage}
                onChange={(e) => setDefaultTaxPercentage(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Business Details"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Logo</CardTitle>
          <CardDescription>Upload your business logo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded bg-eazybooks-purple-dark flex items-center justify-center text-xl text-white font-medium overflow-hidden">
              {business?.logo_url ? (
                <img src={business.logo_url} alt="Business Logo" className="h-full w-full object-cover" />
              ) : (
                businessName.substring(0, 2).toUpperCase() || "B"
              )}
            </div>
            <Button variant="outline">Upload Logo</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettings;
