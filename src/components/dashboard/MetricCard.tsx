
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string;
  changeValue?: string;
  changeDirection?: "up" | "down";
  latestDate?: string;
  className?: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changeValue,
  changeDirection,
  latestDate,
  className,
  isLoading = false,
}) => {
  return (
    <div className={cn("rounded-lg bg-white dark:bg-secondary/40 p-6 shadow-sm border border-gray-100 dark:border-transparent h-full", className)}>
      <div className="text-sm text-muted-foreground mb-2">{title}</div>
      <div className="flex items-end justify-between">
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {changeValue && !isLoading && (
          <div
            className={cn(
              "flex items-center text-xs gap-0.5",
              changeDirection === "up" ? "text-green-500" : "text-red-500"
            )}
          >
            {changeDirection === "up" ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
            {changeValue}
          </div>
        )}
      </div>
      {latestDate && (
        <div className="mt-1 text-xs text-muted-foreground">
          {isLoading ? <Skeleton className="h-3 w-16" /> : `Latest: ${latestDate}`}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
