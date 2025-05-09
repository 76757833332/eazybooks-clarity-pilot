
import {
  Home,
  Building2,
  FileText,
  FileDown,
  Users,
  Receipt,
  CreditCard,
  CalendarClock,
  BarChart3,
  Settings,
  CalendarDays,
  Briefcase,
  TrendingUp
} from "lucide-react";

export type SidebarLinkType = {
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: {
    label: string;
    path: string;
    icon?: React.ElementType;
  }[];
};

export const sidebarLinks: SidebarLinkType[] = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Building2, label: "Bank", path: "/bank" },
  { icon: FileDown, label: "Income", path: "/income" },
  { icon: FileText, label: "Expenses", path: "/expenses" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Receipt, label: "Invoices", path: "/invoices" },
  { icon: CreditCard, label: "Taxes", path: "/taxes" },
  { 
    icon: CalendarClock, 
    label: "Payroll", 
    path: "/payroll",
    subItems: [
      { label: "Payroll Records", path: "/payroll" },
      { label: "Employees", path: "/payroll/employees" },
    ]
  },
  { icon: CalendarDays, label: "Leave", path: "/leaves" },
  // Project management section
  { 
    icon: Briefcase, 
    label: "Projects", 
    path: "/projects",
    subItems: [
      { label: "All Projects", path: "/projects" },
      { label: "Job Requests", path: "/projects/job-requests" },
      { label: "Tasks", path: "/projects/tasks" },
      { label: "Services", path: "/projects/services" },
    ]
  },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: TrendingUp, label: "Upgrade", path: "/upgrade" },
];
