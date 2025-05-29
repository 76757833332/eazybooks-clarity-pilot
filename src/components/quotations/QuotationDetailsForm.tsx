
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "@/types/invoice";

interface QuotationDetailsFormProps {
  quotationNumber: string | undefined;
  customerId: string;
  setCustomerId: (value: string) => void;
  issueDate: string;
  setIssueDate: (value: string) => void;
  validUntil: string;
  setValidUntil: (value: string) => void;
  customers: Customer[];
}

const QuotationDetailsForm: React.FC<QuotationDetailsFormProps> = ({
  quotationNumber,
  customerId,
  setCustomerId,
  issueDate,
  setIssueDate,
  validUntil,
  setValidUntil,
  customers
}) => {
  return (
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
  );
};

export default QuotationDetailsForm;
