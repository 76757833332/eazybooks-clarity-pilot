
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Tax } from "@/types/tax";
import { formatCurrency } from "@/lib/utils";

interface TaxReportChartProps {
  taxes: Tax[];
}

const COLORS = ["#8b5cf6", "#d946ef", "#f97316", "#0ea5e9", "#10b981"];

const TaxReportChart: React.FC<TaxReportChartProps> = ({ taxes }) => {
  const chartData = useMemo(() => {
    if (!taxes?.length) return [];

    // Group taxes by category and sum amounts
    const categoryMap = taxes.reduce<Record<string, number>>((acc, tax) => {
      const category = tax.category;
      acc[category] = (acc[category] || 0) + tax.amount;
      return acc;
    }, {});

    // Convert to array for chart
    return Object.entries(categoryMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [taxes]);

  if (!chartData.length) {
    return <div className="h-full flex items-center justify-center">No tax data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TaxReportChart;
