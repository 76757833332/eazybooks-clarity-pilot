
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { taxService } from "@/services/taxService";
import TaxReportChart from "@/components/reports/TaxReportChart";
import TaxReportTable from "@/components/reports/TaxReportTable";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import FeatureGuard from "@/components/feature-access/FeatureGuard";

const ReportsPage = () => {
  const { toast } = useToast();
  const { isFeatureAvailable } = useFeatureAccess();
  const { data: taxes, isLoading } = useQuery({
    queryKey: ["taxes"],
    queryFn: taxService.getTaxes,
  });

  const { data: taxSummary } = useQuery({
    queryKey: ["tax-summary"],
    queryFn: taxService.getTaxSummary,
  });

  const handleExportCSV = () => {
    if (!taxes || taxes.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no tax records to export.",
        variant: "destructive",
      });
      return;
    }

    // Format taxes data for CSV
    const headers = "Name,Category,Amount,Due Date,Status,Tax Authority\n";
    const csvContent = taxes.map(tax => 
      `"${tax.name}","${tax.category}",${tax.amount},"${format(new Date(tax.due_date), 'yyyy-MM-dd')}","${tax.status}","${tax.tax_authority || ''}"`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tax-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Your tax report has been exported as CSV.",
    });
  };

  // Use feature guard for advanced reporting
  return (
    <AppLayout title="Reports">
      <FeatureGuard 
        feature="basic_reporting"
        requiredTier="free"
        fallbackMessage="Access to reports requires a subscription. Please upgrade your plan to view financial reports."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Financial Reports</h1>
              <p className="text-muted-foreground">View and analyze your financial data</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <Tabs defaultValue="tax" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tax">Tax Reports</TabsTrigger>
              <TabsTrigger value="income" disabled>Income Reports</TabsTrigger>
              <TabsTrigger value="expense" disabled>Expense Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tax" className="space-y-4">
              {taxSummary && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Tax Liabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${taxSummary.total.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${taxSummary.pending.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Paid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${taxSummary.paid.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Overdue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">${taxSummary.overdue.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p>Loading tax data...</p>
                </div>
              ) : (
                <FeatureGuard 
                  feature="advanced_reporting"
                  requiredTier="premium"
                  fallbackMessage="Advanced reporting is only available on Premium and Enterprise plans. Upgrade to access detailed charts and analytics."
                >
                  <>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Tax Breakdown by Category</CardTitle>
                        <CardDescription>
                          Distribution of your tax liabilities by category
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <TaxReportChart taxes={taxes || []} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Tax Records</CardTitle>
                        <CardDescription>
                          Complete listing of your tax records
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TaxReportTable taxes={taxes || []} />
                      </CardContent>
                    </Card>
                  </>
                </FeatureGuard>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </FeatureGuard>
    </AppLayout>
  );
};

export default ReportsPage;
