
import { PayslipPdfService } from "./payslipPdfService";
import { InvoicePdfService } from "./invoicePdfService";

// Create instances of services
const payslipService = new PayslipPdfService();
const invoicePdf = new InvoicePdfService();

// Export as a facade pattern
export const pdfService = {
  generatePayslipPDF: (payroll: any, business: any): void => {
    return payslipService.generatePayslipPDF(payroll, business);
  },
  generateInvoicePDF: (invoice: any, items: any[], business: any): void => {
    return invoicePdf.generateInvoicePDF(invoice, items, business);
  },
};
