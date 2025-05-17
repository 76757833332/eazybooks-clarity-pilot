
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Download } from "lucide-react";
import { LoadingState } from "@/components/invoices/list/LoadingState";
import { fetchBankAccounts, importTransactions } from "@/services/bankService";
import * as XLSX from "xlsx";
import { Database } from "@/integrations/supabase/types";

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

interface ParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  category?: string;
  accountName: string;
}

const TransactionUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  React.useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accounts = await fetchBankAccounts();
        setBankAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccountId(accounts[0].id);
        }
      } catch (error) {
        console.error("Error loading bank accounts:", error);
        toast.error("Failed to load bank accounts");
      }
    };

    loadAccounts();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const parseExcelDate = (excelDate: number): Date => {
    // Excel dates start from January 1, 1900
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!selectedAccountId) {
      toast.error("Please select a bank account");
      return;
    }

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setIsUploading(true);

    try {
      const data = await readExcelFile(selectedFile);
      const transactions = parseTransactions(data);
      
      if (transactions.length === 0) {
        toast.error("No valid transactions found in file");
        setIsUploading(false);
        return;
      }

      // Convert to Supabase schema
      const supabaseTransactions = transactions.map(t => ({
        bank_account_id: selectedAccountId,
        amount: t.amount,
        description: t.description,
        transaction_date: t.date.toISOString().split('T')[0],
        category: t.category || null,
        transaction_type: t.amount > 0 ? 'deposit' : 'expense'
      }));

      await importTransactions(supabaseTransactions);
      
      toast.success(`Successfully imported ${transactions.length} transactions!`);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('transaction-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Error uploading transactions:", error);
      toast.error("Failed to import transactions. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("Failed to read file"));
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const parseTransactions = (data: any[]): ParsedTransaction[] => {
    const transactions: ParsedTransaction[] = [];
    
    data.forEach((row) => {
      // Expected columns: Date, Description, Amount, Category (optional), Account Name
      const dateValue = row.Date;
      let date: Date;
      
      if (typeof dateValue === 'number') {
        date = parseExcelDate(dateValue);
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        return; // Skip rows without valid dates
      }
      
      if (isNaN(date.getTime())) {
        return; // Skip rows with invalid dates
      }
      
      const description = row.Description || 'Unknown Transaction';
      const amount = typeof row.Amount === 'number' ? row.Amount : parseFloat(row.Amount);
      
      if (isNaN(amount)) {
        return; // Skip rows without valid amounts
      }
      
      transactions.push({
        date,
        description,
        amount,
        category: row.Category || undefined,
        accountName: row['Account Name'] || 'Unknown Account'
      });
    });
    
    return transactions;
  };

  const handleDownloadTemplate = () => {
    toast.info("Downloading template file...");
    
    // Create a sample template workbook
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Date', 'Description', 'Amount', 'Category', 'Account Name'],
      [new Date(), 'Sample Deposit', 1000, 'Income', 'Business Checking'],
      [new Date(), 'Sample Expense', -50.25, 'Office Supplies', 'Business Checking']
    ]);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    
    // Generate file and download
    XLSX.writeFile(workbook, 'transaction_template.xlsx');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Transactions</CardTitle>
        <CardDescription>
          Upload bank statements or transaction data in Excel format (.xlsx or .xls)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isUploading ? (
          <LoadingState />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Select 
                value={selectedAccountId} 
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.length === 0 ? (
                    <SelectItem value="none" disabled>No accounts available</SelectItem>
                  ) : (
                    bankAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.bank_name} - {account.account_name} (ending in {account.last_four})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Input 
                id="transaction-file"
                type="file" 
                accept=".xlsx,.xls" 
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
              </p>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium">Required format:</p>
              <ul className="list-disc list-inside text-muted-foreground pl-2 space-y-1">
                <li>Date (MM/DD/YYYY)</li>
                <li>Description</li>
                <li>Amount (positive for deposits, negative for expenses)</li>
                <li>Category (optional)</li>
                <li>Account Name</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleDownloadTemplate}
          className="flex gap-2 items-center"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading || !selectedAccountId || bankAccounts.length === 0}
          className="flex gap-2 items-center bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Transactions"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionUpload;
