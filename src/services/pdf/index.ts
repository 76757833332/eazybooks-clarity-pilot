
import { PayslipPdfService } from "./payslipPdfService";

// Create instances of services
const payslipService = new PayslipPdfService();

// Export as a facade pattern
export const pdfService = {
  generatePayslipPDF: (payroll: any, business: any): void => {
    return payslipService.generatePayslipPDF(payroll, business);
  },
};
