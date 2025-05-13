
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { Payroll } from "@/types/payroll";
import { Employee } from "@/types/employee";
import { BasePdfService } from "./pdfBase";
import { pdfFormatUtils } from "./pdfFormatUtils";

/**
 * Service for generating payslip PDFs
 */
export class PayslipPdfService extends BasePdfService {
  /**
   * Generate a payslip PDF
   */
  generatePayslipPDF(payroll: Payroll, business: any): void {
    try {
      const doc = this.createDocument();
      const { width, height } = this.getPageDimensions(doc);
      
      // Set default font
      doc.setFont("helvetica");
      
      // Add header with business info and logo
      this.addBusinessHeader(doc, business, width);
      
      // Add payslip title
      doc.setFontSize(16);
      doc.text("PAYSLIP", width / 2, 45, { align: "center" });
      
      // Add horizontal line
      this.addHorizontalLine(doc, 50);
      
      // Add employee and payroll details
      this.addEmployeeDetails(doc, payroll);
      this.addPayrollDetails(doc, payroll);
      
      // Add payment summary
      this.addPaymentSummary(doc, payroll);
      
      // Add deductions detail if available
      if (payroll.payroll_deductions && payroll.payroll_deductions.length > 0) {
        this.addDeductionsBreakdown(doc, payroll);
      }
      
      // Add notes if available
      if (payroll.notes) {
        this.addNotes(doc, payroll.notes);
      }
      
      // Add footer
      this.addFooter(doc);
      
      // Save the PDF
      this.savePdf(doc, payroll);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }
  
  private addBusinessHeader(doc: jsPDF, business: any, pageWidth: number): void {
    // Add company logo if available
    let logoAdded = false;
    if (business?.logo_url) {
      logoAdded = pdfFormatUtils.addLogo(doc, business.logo_url, 20, 10, 30, 30);
    }
    
    // Add company name and info
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(business?.name || "Company Name", pageWidth / 2, 20, { align: "center" });
    
    // Add company address
    doc.setFontSize(10);
    const addressParts = [];
    if (business?.address) addressParts.push(business.address);
    if (business?.city && business?.state) {
      addressParts.push(`${business.city}, ${business.state} ${business?.postal_code || ""}`);
    }
    if (business?.country) addressParts.push(business.country);
    if (addressParts.length > 0) {
      doc.text(addressParts, pageWidth / 2, 28, { align: "center" });
    }
    
    // Add contact info
    if (business?.phone || business?.email) {
      const contactInfo = [];
      if (business?.phone) contactInfo.push(`Phone: ${business.phone}`);
      if (business?.email) contactInfo.push(`Email: ${business.email}`);
      doc.text(contactInfo, pageWidth / 2, 36, { align: "center" });
    }
  }
  
  private addEmployeeDetails(doc: jsPDF, payroll: Payroll): void {
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const employee = payroll.employee as Employee;
    if (employee) {
      doc.text("Employee:", 20, 60);
      doc.text(`${employee?.first_name || ""} ${employee?.last_name || ""}`, 70, 60);
      doc.text("Position:", 20, 65);
      doc.text(employee?.position || "", 70, 65);
      doc.text("Employee ID:", 20, 70);
      doc.text(employee?.id?.substring(0, 8) || "", 70, 70);
    }
  }
  
  private addPayrollDetails(doc: jsPDF, payroll: Payroll): void {
    doc.text("Pay Period:", 20, 80);
    doc.text(
      `${format(new Date(payroll.pay_period_start), "MMM d")} - ${format(
        new Date(payroll.pay_period_end),
        "MMM d, yyyy"
      )}`,
      70,
      80
    );
    doc.text("Payment Date:", 20, 85);
    doc.text(format(new Date(payroll.payment_date), "MMMM d, yyyy"), 70, 85);
    doc.text("Payment Status:", 20, 90);
    doc.text(payroll.status.toUpperCase(), 70, 90);
  }
  
  private addPaymentSummary(doc: jsPDF, payroll: Payroll): void {
    doc.setFontSize(12);
    doc.text("Payment Summary", 20, 105);
    this.addHorizontalLine(doc, 108);
    
    pdfFormatUtils.createTable(
      doc,
      115,
      ["Description", "Amount"],
      [
        ["Gross Amount", `$${payroll.gross_amount.toFixed(2)}`],
        ["Taxes", `$${payroll.taxes.toFixed(2)}`],
        ["Deductions", `$${payroll.deductions.toFixed(2)}`],
        ["Net Amount", `$${payroll.net_amount.toFixed(2)}`],
      ],
      {
        columnStyles: {
          1: { halign: "right" },
        }
      }
    );
  }
  
  private addDeductionsBreakdown(doc: jsPDF, payroll: Payroll): void {
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    
    doc.setFontSize(12);
    doc.text("Deductions Breakdown", 20, finalY + 15);
    this.addHorizontalLine(doc, finalY + 18);
    
    const deductionsData = payroll.payroll_deductions!.map((deduction) => [
      deduction.deduction_type?.name || "Deduction",
      `$${deduction.amount.toFixed(2)}`,
    ]);
    
    pdfFormatUtils.createTable(
      doc,
      finalY + 25,
      ["Deduction Type", "Amount"],
      deductionsData,
      {
        columnStyles: {
          1: { halign: "right" },
        }
      }
    );
  }
  
  private addNotes(doc: jsPDF, notes: string): void {
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    
    doc.setFontSize(12);
    doc.text("Notes", 20, finalY + 15);
    this.addHorizontalLine(doc, finalY + 18);
    
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(notes, 170);
    doc.text(splitNotes, 20, finalY + 25);
  }
  
  private savePdf(doc: jsPDF, payroll: Payroll): void {
    const employee = payroll.employee as Employee;
    const fileName = `payslip-${employee?.last_name || "employee"}-${format(
      new Date(payroll.payment_date),
      "yyyyMMdd"
    )}.pdf`;
    
    doc.save(fileName);
  }
}
