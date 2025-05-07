
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Building2, // Replace Bank with Building2 which is available in lucide-react
  FileText,
  FileDown,
  Users,
  Receipt,
  CreditCard,
  CalendarClock,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const sidebarLinks = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Building2, label: "Bank", path: "/bank" }, // Updated icon here
  { icon: FileDown, label: "Income", path: "/income" },
  { icon: FileText, label: "Expenses", path: "/expenses" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Receipt, label: "Invoices", path: "/invoices" },
  { icon: CreditCard, label: "Taxes", path: "/taxes" },
  { icon: CalendarClock, label: "Payroll", path: "/payroll" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-black/80 backdrop-blur-md">
      <div className="flex items-center gap-2 p-6">
        <Logo size="md" />
      </div>

      <div className="mx-3 mb-3 rounded-lg bg-secondary px-3 py-2 flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Search...</span>
        <span className="ml-auto text-xs text-muted-foreground">⌘ S</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-3">
        {sidebarLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-eazybooks-purple/10",
              location.pathname === link.path
                ? "bg-eazybooks-purple/20 text-eazybooks-purple font-medium"
                : "text-muted-foreground"
            )}
          >
            <link.icon size={18} />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mx-3 mb-3 rounded-lg bg-eazybooks-purple bg-opacity-20 p-4">
        <div className="mb-2 text-sm font-semibold text-eazybooks-purple">
          EazyBooks Pro
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Unlock premium features including payroll, advanced reporting and AI insights
        </p>
        <button className="w-full rounded-lg bg-eazybooks-purple px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-eazybooks-purple-secondary">
          Upgrade now
        </button>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-eazybooks-gray-dark flex items-center justify-center text-xs text-white font-medium">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Business account</span>
          </div>
          <button className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
