
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { quotationService } from "@/services/quotation/quotationService";
import { customerService } from "@/services/customerService";
import { toast } from "sonner";
import { format } from "date-fns";

interface QuotationItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

const CreateQuotation: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [customerId, setCustomerId] = useState<string>("");
  const [issueDate, setIssueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [validUntil, setValidUntil] = useState(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { description: "", quantity: 1, price: 0, amount: 0 }
  ]);

  // Fetch data
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getCustomers,
  });

  const { data: quotationNumber } = useQuery({
    queryKey: ["quotation-number"],
    queryFn: quotationService.generateQuotationNumber,
  });

  const updateItemAmount = (index: number, quantity: number, price: number) => {
    const amount = quantity * price;
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity, price, amount } : item
    ));
  };

  const addItem = () => {
    setItems(prev => [...prev, { description: "", quantity: 1, price: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quotationNumber) {
      toast.error("Quotation number not generated yet");
      return;
    }

    if (items.some(item => !item.description.trim())) {
      toast.error("Please fill in all item descriptions");
      return;
    }

    setIsLoading(true);
    
    try {
      const totalAmount = calculateTotal();
      
      const quotationData = {
        quotation_number: quotationNumber,
        customer_id: customerId || null,
        issue_date: issueDate,
        valid_until: validUntil,
        status: 'draft' as const,
        total_amount: totalAmount,
        notes: notes.trim() || null,
      };

      const validItems = items.filter(item => item.description.trim());
      
      await quotationService.createQuotation(quotationData, validItems);
      
      toast.success("Quotation created successfully!");
      navigate("/quotations");
    } catch (error) {
      console.error("Error creating quotation:", error);
      toast.error("Failed to create quotation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Create Quotation">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Quotation</h1>
          <p className="text-gray-600">Create a new quotation for your customer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotation-number">Quotation Number</Label>
                  <Input
                    id="quotation-number"
                    value={quotationNumber || "Generating..."}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="valid-until">Valid Until</Label>
                  <Input
                    id="valid-until"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Items</CardTitle>
                <Button type="button" onClick={addItem} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 md:col-span-5">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Input
                        id={`description-${index}`}
                        value={item.description}
                        onChange={(e) => setItems(prev => prev.map((item, i) => 
                          i === index ? { ...item, description: e.target.value } : item
                        ))}
                        placeholder="Item description"
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = parseFloat(e.target.value) || 0;
                          updateItemAmount(index, quantity, item.price);
                        }}
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Label htmlFor={`price-${index}`}>Price</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const price = parseFloat(e.target.value) || 0;
                          updateItemAmount(index, item.quantity, price);
                        }}
                        required
                      />
                    </div>
                    <div className="col-span-10 md:col-span-2">
                      <Label>Amount</Label>
                      <Input
                        value={`$${item.amount.toFixed(2)}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Total: ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or terms..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/quotations")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
            >
              {isLoading ? "Creating..." : "Create Quotation"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateQuotation;
