
import React from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  User, 
  CircleDollarSign, 
  FileSpreadsheet 
} from "lucide-react";

export type SearchResultItem = {
  id: string;
  type: 'invoice' | 'customer' | 'expense' | 'income';
  title: string;
  subtitle?: string;
  link: string;
};

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading?: boolean;
  searchTerm: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading = false,
  searchTerm
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText size={16} />;
      case 'customer':
        return <User size={16} />;
      case 'expense':
        return <CircleDollarSign size={16} />;
      case 'income':
        return <FileSpreadsheet size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eazybooks-purple mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-2">Searching...</p>
      </div>
    );
  }

  if (results.length === 0 && searchTerm) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] md:h-[500px]">
      <div className="p-2">
        {results.map((result) => (
          <Link
            key={`${result.type}-${result.id}`}
            to={result.link}
            className="flex items-center p-3 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="mr-3 text-muted-foreground">
              {getIcon(result.type)}
            </div>
            <div>
              <p className="font-medium">{result.title}</p>
              {result.subtitle && (
                <p className="text-sm text-muted-foreground">{result.subtitle}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};
