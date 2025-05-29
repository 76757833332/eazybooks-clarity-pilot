
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, FileText } from "lucide-react";
import { quotationService } from "@/services/quotation/quotationService";
import { Quotation } from "@/types/quotation";
import { format } from "date-fns";

const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: quotationService.getQuotations,
  });

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AppLayout title="Quotations">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eazybooks-purple"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Quotations">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
            <p className="text-gray-600">Manage your quotations and proposals</p>
          </div>
          <Button
            onClick={() => navigate("/quotations/create")}
            className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quotation
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quotations List */}
        {filteredQuotations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {quotations.length === 0 ? "No quotations yet" : "No quotations found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {quotations.length === 0 
                  ? "Create your first quotation to get started"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {quotations.length === 0 && (
                <Button
                  onClick={() => navigate("/quotations/create")}
                  className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quotation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuotations.map((quotation) => (
              <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{quotation.quotation_number}</h3>
                        <Badge className={getStatusColor(quotation.status)}>
                          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Customer:</span> {quotation.customer?.name || "No customer"}</p>
                        <p><span className="font-medium">Issue Date:</span> {format(new Date(quotation.issue_date), "MMM d, yyyy")}</p>
                        <p><span className="font-medium">Valid Until:</span> {format(new Date(quotation.valid_until), "MMM d, yyyy")}</p>
                        <p><span className="font-medium">Amount:</span> ${quotation.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/quotations/${quotation.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default QuotationsPage;
