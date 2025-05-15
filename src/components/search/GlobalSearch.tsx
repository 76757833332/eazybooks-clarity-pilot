
import React, { useState, useEffect, useRef } from "react";
import { Command } from "cmdk";
import { SearchBox } from "./SearchBox";
import { SearchResults, SearchResultItem } from "./SearchResults";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { baseService } from "@/services/base/baseService";
import { Search as SearchIcon } from "lucide-react";

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Close with escape key
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Focus search input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [open]);

  // Search query
  const { data: results, isLoading } = useQuery({
    queryKey: ["global-search", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        return [];
      }

      try {
        const userId = await baseService.getCurrentUserId();
        const searchResults: SearchResultItem[] = [];

        // Search invoices
        const { data: invoices } = await supabase
          .from("invoices")
          .select("id, invoice_number, total_amount, customer:customers(name)")
          .eq("user_id", userId)
          .or(`invoice_number.ilike.%${debouncedSearchTerm}%`)
          .limit(5);

        if (invoices) {
          invoices.forEach((invoice: any) => {
            searchResults.push({
              id: invoice.id,
              type: "invoice",
              title: `Invoice #${invoice.invoice_number}`,
              subtitle: `${invoice.customer?.name || 'No customer'} - $${invoice.total_amount}`,
              link: `/invoices/${invoice.id}`,
            });
          });
        }

        // Search customers
        const { data: customers } = await supabase
          .from("customers")
          .select("id, name, email")
          .eq("user_id", userId)
          .or(`name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`)
          .limit(5);

        if (customers) {
          customers.forEach((customer: any) => {
            searchResults.push({
              id: customer.id,
              type: "customer",
              title: customer.name,
              subtitle: customer.email || 'No email',
              link: `/customers/${customer.id}`,
            });
          });
        }

        // Search expenses
        const { data: expenses } = await supabase
          .from("expenses")
          .select("id, description, amount, date")
          .eq("user_id", userId)
          .or(`description.ilike.%${debouncedSearchTerm}%`)
          .limit(5);

        if (expenses) {
          expenses.forEach((expense: any) => {
            searchResults.push({
              id: expense.id,
              type: "expense",
              title: expense.description,
              subtitle: `$${expense.amount} - ${new Date(expense.date).toLocaleDateString()}`,
              link: `/expenses/${expense.id}`,
            });
          });
        }

        return searchResults;
      } catch (error) {
        console.error("Error searching:", error);
        return [];
      }
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <>
      <div className="hidden md:flex" onClick={() => setOpen(true)}>
        <div className="relative w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer">
          <span className="flex items-center text-muted-foreground">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search...
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              {navigator.userAgent.indexOf('Mac') !== -1 ? '⌘' : 'Ctrl'} K
            </kbd>
          </span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-3xl overflow-hidden">
          <Command className="rounded-lg border shadow-md">
            <div className="p-2 border-b">
              <SearchBox 
                onSearch={handleSearch} 
                placeholder="Search invoices, customers, expenses..." 
                className="w-full"
              />
            </div>
            <SearchResults
              results={results || []}
              isLoading={isLoading && debouncedSearchTerm.length >= 2}
              searchTerm={debouncedSearchTerm}
            />
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};
