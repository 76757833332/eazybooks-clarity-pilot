
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data - in a real app, this would come from your API
const data = [
  { name: "Jan", revenue: 1000, expenditure: 1400 },
  { name: "Feb", revenue: 2000, expenditure: 1200 },
  { name: "Mar", revenue: 2500, expenditure: 1600 },
  { name: "Apr", revenue: 1500, expenditure: 2000 },
  { name: "May", revenue: 3000, expenditure: 1800 },
  { name: "Jun", revenue: 2800, expenditure: 1500 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm">
        <p className="text-white font-medium">{label}</p>
        <p className="text-[#A78BFF]">
          Revenue: € {payload[0].value.toFixed(2)}
        </p>
        <p className="text-[#FF9F7A]">
          Expenditure: € {payload[1].value.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

const PerformanceChart: React.FC = () => {
  return (
    <div className="bg-secondary/40 rounded-lg p-4 h-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Performance</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#A78BFF]"></div>
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF9F7A]"></div>
            <span className="text-xs text-muted-foreground">Expenditure</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A78BFF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#A78BFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenditure" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF9F7A" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FF9F7A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#999", fontSize: 12 }}
          />
          <YAxis 
            hide={true}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#A78BFF"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, fill: "#A78BFF" }}
          />
          <Line
            type="monotone"
            dataKey="expenditure"
            stroke="#FF9F7A"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, fill: "#FF9F7A" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
