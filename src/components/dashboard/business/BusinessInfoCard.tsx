
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Business } from "@/contexts/auth/types";

interface BusinessInfoCardProps {
  business: Business | null;
}

const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({ business }) => {
  if (business) {
    return (
      <Card className="mb-8 border-eazybooks-purple/10 bg-eazybooks-purple/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {business.industry && (
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium">{business.industry}</p>
            </div>
          )}
          {business.phone && (
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{business.phone}</p>
            </div>
          )}
          {business.email && (
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{business.email}</p>
            </div>
          )}
          {business.website && (
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <p className="font-medium">
                <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-eazybooks-purple hover:underline">
                  {business.website}
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8 border-amber-300/30 bg-amber-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Complete Your Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">Add your business details to customize your dashboard and documents</p>
        <Button 
          className="bg-eazybooks-purple hover:bg-eazybooks-purple/90" 
          asChild
        >
          <Link to="/settings/business">
            <Settings className="mr-2 h-4 w-4" />
            Set Up Business Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoCard;
