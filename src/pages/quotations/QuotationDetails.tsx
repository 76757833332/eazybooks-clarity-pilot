
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, FileDown } from "lucide-react";
import { quotationService } from "@/services/quotation/quotationService";
import { format } from "date-fns";
import { toast } from "sonner";

const QuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", id],
    queryFn: () => quotationService.getQuotationById(id!),
    enabled: !!id,
  });

  const handleStatusUpdate = async (status: 'sent' | 'accepted' | 'rejected') => {
    if (!quotation) return;
    
    try {
      await quotationService.updateQuotationStatus(quotation.id, status);
      toast.success(`Quotation marked as ${status}`);
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error("Error updating quotation status:", error);
      toast.error("Failed to update quotation status");
    }
  };

  const handleDelete = async () => {
    if (!quotation) return;
    
    if (confirm("Are you sure you want to delete this quotation?")) {
      try {
        await quotationService.deleteQuotation(quotation.id);
        toast.success("Quotation deleted successfully");
        navigate("/quotations");
      } catch (error) {
        console.error("Error deleting quotation:", error);
        toast.error("Failed to delete quotation");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Quotation Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eazybooks-purple"></div>
        </div>
      </AppLayout>
    );
  }

  if (!quotation) {
    return (
      <AppLayout title="Quotation Details">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Quotation not found</h2>
          <p className="text-gray-600 mt-2">The quotation you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/quotations")} className="mt-4">
            Back to Quotations
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Quotation ${quotation.quotation_number}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/quotations")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quotation.quotation_number}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(quotation.status)}>
                  {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quotation.status === 'draft' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('sent')}
              >
                Mark as Sent
              </Button>
            )}
            {quotation.status === 'sent' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate('accepted')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate('rejected')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Reject
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quotation Info */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
                {quotation.customer ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{quotation.customer.name}</p>
                    {quotation.customer.email && <p>{quotation.customer.email}</p>}
                    {quotation.customer.phone && <p>{quotation.customer.phone}</p>}
                    {quotation.customer.address && <p>{quotation.customer.address}</p>}
                  </div>
                ) : (
                  <p className="text-gray-500">No customer assigned</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quotation Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span>{format(new Date(quotation.issue_date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span>{format(new Date(quotation.valid_until), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{format(new Date(quotation.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.price.toFixed(2)}</td>
                      <td className="text-right py-2">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td colSpan={3} className="text-right py-2">Total:</td>
                    <td className="text-right py-2">${quotation.total_amount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {quotation.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{quotation.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default QuotationDetails;
