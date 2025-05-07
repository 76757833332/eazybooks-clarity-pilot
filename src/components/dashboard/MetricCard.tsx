
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  changeValue?: string;
  changeDirection?: "up" | "down";
  latestDate?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changeValue,
  changeDirection,
  latestDate,
  className,
}) => {
  return (
    <div className={cn("rounded-lg bg-secondary/40 p-4", className)}>
      <div className="text-sm text-muted-foreground mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {changeValue && (
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
          Latest: {latestDate}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
