
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Download } from "lucide-react";
import { LoadingState } from "@/components/invoices/list/LoadingState";

const TransactionUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate processing delay for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Transactions imported successfully!");
      setSelectedFile(null);
      // Reset file input by clearing value
      const fileInput = document.getElementById('transaction-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Error uploading transactions:", error);
      toast.error("Failed to import transactions. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    toast.info("Downloading template file...");
    // In a real implementation, this would download an Excel template file
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
          disabled={!selectedFile || isUploading}
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
