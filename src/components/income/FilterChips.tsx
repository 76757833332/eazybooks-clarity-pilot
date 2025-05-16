
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { IncomeSource } from "@/types/income";

interface FilterChipsProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filter, setFilter }) => {
  const incomeSources: IncomeSource[] = ["sales", "services", "consulting", "investment", "other"];

  return (
    <div className="flex flex-wrap gap-2">
      {incomeSources.map((source) => (
        <Badge
          key={source}
          variant="outline"
          className={`
            cursor-pointer px-3 py-1 
            ${filter === source ? 'bg-primary/10 border-primary' : ''}
          `}
          onClick={() => setFilter(filter === source ? null : source)}
        >
          {filter === source && <ChevronRight className="mr-1 h-3 w-3" />}
          {source.charAt(0).toUpperCase() + source.slice(1)}
        </Badge>
      ))}
    </div>
  );
};

export default FilterChips;
