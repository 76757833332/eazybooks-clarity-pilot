
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Payroll } from "@/types/payroll";
import { Employee } from "@/types/employee";

export const pdfService = {
  /**
   * Generate a payslip PDF
   */
  generatePayslipPDF: (payroll: Payroll, business: any): void => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Set default font
      doc.setFont("helvetica");
      
      // Add company logo if available
      if (business?.logo_url) {
        try {
          doc.addImage(business.logo_url, 'JPEG', 20, 10, 30, 30);
        } catch (logoError) {
          console.error("Error adding logo to PDF:", logoError);
          // Continue without the logo if there's an error
        }
        // Adjust company info position if logo is present
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(business?.name || "Company Name", pageWidth / 2, 20, { align: "center" });
      } else {
        // No logo, standard positioning
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(business?.name || "Company Name", pageWidth / 2, 20, { align: "center" });
      }
      
      // Add company info
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
      
      if (business?.phone || business?.email) {
        const contactInfo = [];
        if (business?.phone) contactInfo.push(`Phone: ${business.phone}`);
        if (business?.email) contactInfo.push(`Email: ${business.email}`);
        doc.text(contactInfo, pageWidth / 2, 36, { align: "center" });
      }
      
      // Add payslip title
      doc.setFontSize(16);
      doc.text("PAYSLIP", pageWidth / 2, 45, { align: "center" });
      
      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 50, pageWidth - 20, 50);
      
      // Add payroll details
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      // Employee details
      const employee = payroll.employee as Employee;
      if (employee) {
        doc.text("Employee:", 20, 60);
        doc.text(`${employee?.first_name || ""} ${employee?.last_name || ""}`, 70, 60);
        doc.text("Position:", 20, 65);
        doc.text(employee?.position || "", 70, 65);
        doc.text("Employee ID:", 20, 70);
        doc.text(employee?.id?.substring(0, 8) || "", 70, 70);
      }
      
      // Payroll details
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
      
      // Payment summary
      doc.setFontSize(12);
      doc.text("Payment Summary", 20, 105);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 108, 190, 108);
      
      // Payment details table
      autoTable(doc, {
        startY: 115,
        head: [["Description", "Amount"]],
        body: [
          ["Gross Amount", `$${payroll.gross_amount.toFixed(2)}`],
          ["Taxes", `$${payroll.taxes.toFixed(2)}`],
          ["Deductions", `$${payroll.deductions.toFixed(2)}`],
          ["Net Amount", `$${payroll.net_amount.toFixed(2)}`],
        ],
        theme: "plain",
        styles: {
          cellPadding: 5,
          fontSize: 10,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          1: { halign: "right" },
        },
      });
      
      // Add deductions detail if available
      if (payroll.payroll_deductions && payroll.payroll_deductions.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY || 200;
        
        doc.setFontSize(12);
        doc.text("Deductions Breakdown", 20, finalY + 15);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, finalY + 18, 190, finalY + 18);
        
        const deductionsData = payroll.payroll_deductions.map((deduction) => [
          deduction.deduction_type?.name || "Deduction",
          `$${deduction.amount.toFixed(2)}`,
        ]);
        
        autoTable(doc, {
          startY: finalY + 25,
          head: [["Deduction Type", "Amount"]],
          body: deductionsData,
          theme: "plain",
          styles: {
            cellPadding: 5,
            fontSize: 10,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" },
          },
        });
      }
      
      // Add notes if available
      if (payroll.notes) {
        const finalY = (doc as any).lastAutoTable.finalY || 200;
        
        doc.setFontSize(12);
        doc.text("Notes", 20, finalY + 15);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, finalY + 18, 190, finalY + 18);
        
        doc.setFontSize(10);
        const splitNotes = doc.splitTextToSize(payroll.notes, 170);
        doc.text(splitNotes, 20, finalY + 25);
      }
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on ${format(new Date(), "MMMM d, yyyy")}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      
      // Save the PDF
      const fileName = `payslip-${employee?.last_name || "employee"}-${format(
        new Date(payroll.payment_date),
        "yyyyMMdd"
      )}.pdf`;
      
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  },
};
