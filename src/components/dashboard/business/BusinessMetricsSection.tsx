import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const BusinessMetricsSection = () => {
  const { formatCurrency } = useAuth();

  // Example data, in a real app this would come from an API
  const totalRevenue = 56789;
  const expenses = 34567;
  const netProfit = totalRevenue - expenses;
  const newCustomers = 45;
  const churnRate = 2.5;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <div className="text-sm text-green-500 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            12% increase
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
          <div className="text-sm text-red-500 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            8% increase
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
          <div className="text-sm text-green-500 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            5% increase
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newCustomers}</div>
          <div className="text-sm text-green-500 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            20% increase
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Churn Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{churnRate}%</div>
          <div className="text-sm text-red-500 flex items-center">
            <ArrowDownLeft className="h-4 w-4 mr-1" />
            2% decrease
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessMetricsSection;
