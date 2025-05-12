
export interface InvoiceFormValues {
  customer_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  notes: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
}
