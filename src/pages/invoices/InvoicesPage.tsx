
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { InvoiceHeader } from "@/components/invoices/list/InvoiceHeader";
import { SearchAndFilter } from "@/components/invoices/filters/SearchAndFilter";
import { InvoicesList } from "@/components/invoices/list/InvoicesList";
import { EmptyInvoiceState } from "@/components/invoices/list/EmptyInvoiceState";
import { LoadingState } from "@/components/invoices/list/LoadingState";
import { useInvoiceList } from "@/hooks/invoices/useInvoiceList";

const InvoicesPage: React.FC = () => {
  const {
    invoices,
    isLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    getStatusColor,
  } = useInvoiceList();

  return (
    <AppLayout title="Invoices">
      <div className="flex flex-col">
        <InvoiceHeader />
        
        {/* Search and filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        {/* Invoices list */}
        {isLoading ? (
          <LoadingState />
        ) : !invoices?.length ? (
          <EmptyInvoiceState statusFilter={statusFilter} searchTerm={searchTerm} />
        ) : (
          <InvoicesList invoices={invoices} getStatusColor={getStatusColor} />
        )}
      </div>
    </AppLayout>
  );
};

export default InvoicesPage;
