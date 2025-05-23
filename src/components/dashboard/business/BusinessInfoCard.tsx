import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBusinessAddress } from "@/components/dashboard/dashboardUtils";
import { useAuth } from "@/contexts/auth";

interface BusinessInfoCardProps {
  business: any;
}

const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({ business }) => {
  const { getCurrencySymbol } = useAuth();

  const address = formatBusinessAddress(business?.city, business?.state, business?.country);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={business?.logo_url} alt={business?.name} />
            <AvatarFallback>{business?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{business?.name}</p>
            <p className="text-sm text-muted-foreground">{business?.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-sm">{business?.description || 'No description available.'}</p>
        </div>
        {address && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Address:</span>
            <span className="ml-2 text-sm">{address}</span>
          </div>
        )}
        {business?.phone && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Phone:</span>
            <span className="ml-2 text-sm">{business.phone}</span>
          </div>
        )}
        {business?.website && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Website:</span>
            <span className="ml-2 text-sm">
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-eazybooks-purple hover:underline">
                {business.website}
              </a>
            </span>
          </div>
        )}
        {business?.currency && (
          <div className="mt-2">
            <span className="text-sm font-medium text-muted-foreground">Currency:</span>
            <span className="ml-2">{business.currency} ({getCurrencySymbol()})</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessInfoCard;
