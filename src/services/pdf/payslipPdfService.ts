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
    const margin = 15;
    let currentY = margin;
    let logoHeight = 0;
    
    // Add company logo if available
    if (business?.logo_url) {
      try {
        // Try to add logo - if it fails, continue without it
        try {
          const logoWidth = 25;
          const logoHeightCalc = 25;
          doc.addImage(business.logo_url, 'JPEG', margin, currentY, logoWidth, logoHeightCalc);
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
    const nameX = business?.logo_url ? 45 : margin;
    const maxNameWidth = pageWidth - nameX - 80; // Reserve space for contact info
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    
    const companyName = business?.name || "Company Name";
    const splitName = doc.splitTextToSize(companyName, maxNameWidth);
    doc.text(splitName, nameX, currentY + 8);
    
    // Add legal name if different from business name
    currentY += 15;
    if (business?.legal_name && business.legal_name !== business.name) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const splitLegalName = doc.splitTextToSize(business.legal_name, maxNameWidth);
      doc.text(splitLegalName, nameX, currentY);
      currentY += splitLegalName.length * 4;
    }
    
    // Add company address in a well-formatted way
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    if (business?.address) {
      const splitAddress = doc.splitTextToSize(business.address, maxNameWidth);
      doc.text(splitAddress, nameX, currentY);
      currentY += splitAddress.length * 4;
    }
    
    if (business?.city || business?.state || business?.postal_code) {
      const cityStateZip = [business?.city, business?.state, business?.postal_code]
        .filter(Boolean)
        .join(", ");
      if (cityStateZip) {
        const splitCityState = doc.splitTextToSize(cityStateZip, maxNameWidth);
        doc.text(splitCityState, nameX, currentY);
        currentY += splitCityState.length * 4;
      }
    }
    
    if (business?.country) {
      const splitCountry = doc.splitTextToSize(business.country, maxNameWidth);
      doc.text(splitCountry, nameX, currentY);
      currentY += splitCountry.length * 4;
    }
    
    // Add contact information on the right side
    const contactX = pageWidth - 70;
    const contactLabelX = contactX - 25;
    let contactY = 20;
    const maxContactWidth = 65;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    if (business?.phone) {
      doc.text("Phone:", contactLabelX, contactY, { align: "right" });
      const splitPhone = doc.splitTextToSize(business.phone, maxContactWidth);
      doc.text(splitPhone, contactX, contactY);
      contactY += Math.max(splitPhone.length * 4, 5);
    }
    
    if (business?.email) {
      doc.text("Email:", contactLabelX, contactY, { align: "right" });
      const splitEmail = doc.splitTextToSize(business.email, maxContactWidth);
      doc.text(splitEmail, contactX, contactY);
      contactY += Math.max(splitEmail.length * 4, 5);
    }
    
    if (business?.website) {
      doc.text("Website:", contactLabelX, contactY, { align: "right" });
      const splitWebsite = doc.splitTextToSize(business.website, maxContactWidth);
      doc.text(splitWebsite, contactX, contactY);
      contactY += Math.max(splitWebsite.length * 4, 5);
    }
    
    // Return the maximum Y position used
    return Math.max(currentY + 10, logoHeight + margin, contactY + 5);
  }
  
  private addEmployeeDetails(doc: jsPDF, payroll: Payroll, startY: number): number {
    const { width } = this.getPageDimensions(doc);
    const margin = 20;
    const labelWidth = 35;
    const maxLeftWidth = (width / 2) - margin - 10;
    const maxRightWidth = (width / 2) - 10;
    const rightColumnStart = width / 2;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Employee Information", margin, startY);
    
    let currentY = startY + 8;
    let rightColumnY = startY + 8;
    
    const employee = payroll.employee as Employee;
    if (employee) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Left column
      doc.text("Name:", margin, currentY);
      const fullName = `${employee?.first_name || ""} ${employee?.last_name || ""}`.trim();
      const splitName = doc.splitTextToSize(fullName, maxLeftWidth - labelWidth);
      doc.text(splitName, margin + labelWidth, currentY);
      currentY += Math.max(splitName.length * 4, 5);
      
      doc.text("Position:", margin, currentY);
      const position = employee?.position || "";
      const splitPosition = doc.splitTextToSize(position, maxLeftWidth - labelWidth);
      doc.text(splitPosition, margin + labelWidth, currentY);
      currentY += Math.max(splitPosition.length * 4, 5);
      
      doc.text("Employee ID:", margin, currentY);
      const employeeId = employee?.id?.substring(0, 8) || "";
      doc.text(employeeId, margin + labelWidth, currentY);
      currentY += 5;
      
      // Right column
      if (employee?.email) {
        doc.text("Email:", rightColumnStart, rightColumnY);
        const splitEmail = doc.splitTextToSize(employee.email, maxRightWidth - labelWidth);
        doc.text(splitEmail, rightColumnStart + labelWidth, rightColumnY);
        rightColumnY += Math.max(splitEmail.length * 4, 5);
      }
      
      if (employee?.department) {
        doc.text("Department:", rightColumnStart, rightColumnY);
        const splitDept = doc.splitTextToSize(employee.department, maxRightWidth - labelWidth);
        doc.text(splitDept, rightColumnStart + labelWidth, rightColumnY);
        rightColumnY += Math.max(splitDept.length * 4, 5);
      }
    }
    
    return Math.max(currentY, rightColumnY) + 10;
  }
  
  private addPayrollDetails(doc: jsPDF, payroll: Payroll, startY: number): number {
    const { width } = this.getPageDimensions(doc);
    const margin = 20;
    const labelWidth = 40;
    const maxLeftWidth = (width / 2) - margin - 10;
    const maxRightWidth = (width / 2) - 10;
    const rightColumnStart = width / 2;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Payroll Details", margin, startY);
    
    let currentY = startY + 8;
    let rightColumnY = startY + 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Left column
    doc.text("Pay Period:", margin, currentY);
    const payPeriod = `${format(new Date(payroll.pay_period_start), "MMM d")} - ${format(
      new Date(payroll.pay_period_end),
      "MMM d, yyyy"
    )}`;
    const splitPayPeriod = doc.splitTextToSize(payPeriod, maxLeftWidth - labelWidth);
    doc.text(splitPayPeriod, margin + labelWidth, currentY);
    currentY += Math.max(splitPayPeriod.length * 4, 5);
    
    doc.text("Payment Date:", margin, currentY);
    const paymentDate = format(new Date(payroll.payment_date), "MMMM d, yyyy");
    const splitPaymentDate = doc.splitTextToSize(paymentDate, maxLeftWidth - labelWidth);
    doc.text(splitPaymentDate, margin + labelWidth, currentY);
    currentY += Math.max(splitPaymentDate.length * 4, 5);
    
    // Right column
    doc.text("Status:", rightColumnStart, rightColumnY);
    const status = payroll.status.toUpperCase();
    const splitStatus = doc.splitTextToSize(status, maxRightWidth - labelWidth);
    doc.text(splitStatus, rightColumnStart + labelWidth, rightColumnY);
    rightColumnY += Math.max(splitStatus.length * 4, 5);
    
    return Math.max(currentY, rightColumnY) + 10;
  }
  
  private addPaymentSummary(doc: jsPDF, payroll: Payroll, startY: number): number {
    const { width } = this.getPageDimensions(doc);
    const margin = 20;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Summary", margin, startY);
    
    this.addHorizontalLine(doc, startY + 3);
    
    const tableStartY = startY + 10;
    const availableWidth = width - (margin * 2);
    const descriptionWidth = availableWidth * 0.7;
    const amountWidth = availableWidth * 0.3;
    
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
        margin: { left: margin },
        columnStyles: {
          0: { cellWidth: descriptionWidth },
          1: { halign: "right", cellWidth: amountWidth },
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
    const { width } = this.getPageDimensions(doc);
    const margin = 20;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Deductions Breakdown", margin, startY);
    
    this.addHorizontalLine(doc, startY + 3);
    
    const tableStartY = startY + 10;
    const availableWidth = width - (margin * 2);
    const deductionTypeWidth = availableWidth * 0.5;
    const typeWidth = availableWidth * 0.25;
    const amountWidth = availableWidth * 0.25;
    
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
        margin: { left: margin },
        columnStyles: {
          0: { cellWidth: deductionTypeWidth },
          1: { cellWidth: typeWidth, halign: "center" },
          2: { halign: "right", cellWidth: amountWidth },
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
    const { width } = this.getPageDimensions(doc);
    const margin = 20;
    const maxNotesWidth = width - (margin * 2);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Notes", margin, startY);
    
    this.addHorizontalLine(doc, startY + 3);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitNotes = doc.splitTextToSize(notes, maxNotesWidth);
    doc.text(splitNotes, margin, startY + 10);
    
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
