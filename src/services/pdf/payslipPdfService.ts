
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
      const headerHeight = this.addBusinessHeader(doc, business, width);
      
      // Add payslip title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("PAYSLIP", width / 2, headerHeight + 15, { align: "center" });
      
      // Add horizontal line
      this.addHorizontalLine(doc, headerHeight + 20);
      
      // Add employee and payroll details
      let currentY = headerHeight + 30;
      currentY = this.addEmployeeDetails(doc, payroll, currentY);
      currentY = this.addPayrollDetails(doc, payroll, currentY);
      
      // Add payment summary
      currentY = this.addPaymentSummary(doc, payroll, currentY);
      
      // Add deductions detail if available
      if (payroll.payroll_deductions && payroll.payroll_deductions.length > 0) {
        currentY = this.addDeductionsBreakdown(doc, payroll, currentY);
      }
      
      // Add notes if available
      if (payroll.notes) {
        this.addNotes(doc, payroll.notes, currentY);
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
  
  private addBusinessHeader(doc: jsPDF, business: any, pageWidth: number): number {
    let currentY = 15;
    let logoHeight = 0;
    
    // Add company logo if available
    if (business?.logo_url) {
      try {
        // Create a promise to handle image loading
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        // Try to add logo - if it fails, continue without it
        try {
          const logoWidth = 25;
          const logoHeightCalc = 25;
          doc.addImage(business.logo_url, 'JPEG', 15, currentY, logoWidth, logoHeightCalc);
          logoHeight = logoHeightCalc + 5;
        } catch (logoError) {
          console.warn("Could not load logo for PDF:", logoError);
          // Continue without logo
        }
      } catch (error) {
        console.warn("Logo loading error:", error);
      }
    }
    
    // Add company name - positioned to the right of logo or at left if no logo
    const nameX = business?.logo_url ? 45 : 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(business?.name || "Company Name", nameX, currentY + 8);
    
    // Add legal name if different from business name
    currentY += 15;
    if (business?.legal_name && business.legal_name !== business.name) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(business.legal_name, nameX, currentY);
      currentY += 5;
    }
    
    // Add company address in a well-formatted way
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    if (business?.address) {
      doc.text(business.address, nameX, currentY);
      currentY += 4;
    }
    
    if (business?.city || business?.state || business?.postal_code) {
      const cityStateZip = [business?.city, business?.state, business?.postal_code]
        .filter(Boolean)
        .join(", ");
      if (cityStateZip) {
        doc.text(cityStateZip, nameX, currentY);
        currentY += 4;
      }
    }
    
    if (business?.country) {
      doc.text(business.country, nameX, currentY);
      currentY += 4;
    }
    
    // Add contact information on the right side
    const contactX = pageWidth - 60;
    let contactY = 20;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    if (business?.phone) {
      doc.text("Phone:", contactX, contactY);
      doc.text(business.phone, contactX + 20, contactY);
      contactY += 5;
    }
    
    if (business?.email) {
      doc.text("Email:", contactX, contactY);
      doc.text(business.email, contactX + 20, contactY);
      contactY += 5;
    }
    
    if (business?.website) {
      doc.text("Website:", contactX, contactY);
      doc.text(business.website, contactX + 20, contactY);
      contactY += 5;
    }
    
    // Return the maximum Y position used
    return Math.max(currentY + 5, logoHeight + 15, contactY);
  }
  
  private addEmployeeDetails(doc: jsPDF, payroll: Payroll, startY: number): number {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Employee Information", 20, startY);
    
    let currentY = startY + 8;
    
    const employee = payroll.employee as Employee;
    if (employee) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Left column
      doc.text("Name:", 20, currentY);
      doc.text(`${employee?.first_name || ""} ${employee?.last_name || ""}`, 60, currentY);
      
      currentY += 5;
      doc.text("Position:", 20, currentY);
      doc.text(employee?.position || "", 60, currentY);
      
      currentY += 5;
      doc.text("Employee ID:", 20, currentY);
      doc.text(employee?.id?.substring(0, 8) || "", 60, currentY);
      
      // Right column
      if (employee?.email) {
        doc.text("Email:", 120, startY + 8);
        doc.text(employee.email, 150, startY + 8);
      }
      
      if (employee?.department) {
        doc.text("Department:", 120, startY + 13);
        doc.text(employee.department, 150, startY + 13);
      }
    }
    
    return currentY + 10;
  }
  
  private addPayrollDetails(doc: jsPDF, payroll: Payroll, startY: number): number {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Payroll Details", 20, startY);
    
    let currentY = startY + 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Left column
    doc.text("Pay Period:", 20, currentY);
    doc.text(
      `${format(new Date(payroll.pay_period_start), "MMM d")} - ${format(
        new Date(payroll.pay_period_end),
        "MMM d, yyyy"
      )}`,
      60,
      currentY
    );
    
    currentY += 5;
    doc.text("Payment Date:", 20, currentY);
    doc.text(format(new Date(payroll.payment_date), "MMMM d, yyyy"), 60, currentY);
    
    // Right column
    doc.text("Status:", 120, startY + 8);
    doc.text(payroll.status.toUpperCase(), 150, startY + 8);
    
    return currentY + 10;
  }
  
  private addPaymentSummary(doc: jsPDF, payroll: Payroll, startY: number): number {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Summary", 20, startY);
    
    this.addHorizontalLine(doc, startY + 3);
    
    const tableStartY = startY + 10;
    
    pdfFormatUtils.createTable(
      doc,
      tableStartY,
      ["Description", "Amount"],
      [
        ["Gross Amount", `$${payroll.gross_amount.toFixed(2)}`],
        ["Taxes", `$${payroll.taxes.toFixed(2)}`],
        ["Deductions", `$${payroll.deductions.toFixed(2)}`],
        ["Net Amount", `$${payroll.net_amount.toFixed(2)}`],
      ],
      {
        startX: 20,
        columnStyles: {
          0: { cellWidth: 120 },
          1: { halign: "right", cellWidth: 60 },
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        bodyStyles: {
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
      }
    );
    
    return (doc as any).lastAutoTable.finalY + 10;
  }
  
  private addDeductionsBreakdown(doc: jsPDF, payroll: Payroll, startY: number): number {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Deductions Breakdown", 20, startY);
    
    this.addHorizontalLine(doc, startY + 3);
    
    const tableStartY = startY + 10;
    
    const deductionsData = payroll.payroll_deductions!.map((deduction) => [
      deduction.deduction_type?.name || "Deduction",
      deduction.deduction_type?.is_percentage ? "Percentage" : "Fixed",
      `$${deduction.amount.toFixed(2)}`,
    ]);
    
    pdfFormatUtils.createTable(
      doc,
      tableStartY,
      ["Deduction Type", "Type", "Amount"],
      deductionsData,
      {
        startX: 20,
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 40, halign: "center" },
          2: { halign: "right", cellWidth: 40 },
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        bodyStyles: {
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
      }
    );
    
    return (doc as any).lastAutoTable.finalY + 10;
  }
  
  private addNotes(doc: jsPDF, notes: string, startY: number): number {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Notes", 20, startY);
    
    this.addHorizontalLine(doc, startY + 3);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitNotes = doc.splitTextToSize(notes, 170);
    doc.text(splitNotes, 20, startY + 10);
    
    return startY + 10 + (splitNotes.length * 4);
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
