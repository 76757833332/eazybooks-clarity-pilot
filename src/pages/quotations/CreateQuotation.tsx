
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { quotationService } from "@/services/quotation/quotationService";
import { customerService } from "@/services/customerService";
import { toast } from "sonner";
import { format } from "date-fns";
import QuotationDetailsForm from "@/components/quotations/QuotationDetailsForm";
import QuotationItemsSection from "@/components/quotations/QuotationItemsSection";
import QuotationNotesSection from "@/components/quotations/QuotationNotesSection";
import QuotationActions from "@/components/quotations/QuotationActions";

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
          <QuotationDetailsForm
            quotationNumber={quotationNumber}
            customerId={customerId}
            setCustomerId={setCustomerId}
            issueDate={issueDate}
            setIssueDate={setIssueDate}
            validUntil={validUntil}
            setValidUntil={setValidUntil}
            customers={customers}
          />

          <QuotationItemsSection
            items={items}
            setItems={setItems}
            addItem={addItem}
            removeItem={removeItem}
            updateItemAmount={updateItemAmount}
            calculateTotal={calculateTotal}
          />

          <QuotationNotesSection
            notes={notes}
            setNotes={setNotes}
          />

          <QuotationActions isLoading={isLoading} />
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateQuotation;
