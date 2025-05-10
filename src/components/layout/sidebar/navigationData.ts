
import { BarChart3, CreditCard, FileCog, FileSpreadsheet, FolderKanban, Home, LucideIcon, Package, Receipt, Settings, Users, DollarSign, Calendar, Briefcase, FileCheck, MessageCircle, PanelLeft, Wallet, CreditCard as CreditCardIcon, Building2, Crown } from "lucide-react";

export interface SidebarLinkGroup {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  subItems?: SidebarLink[];
}

export type SidebarLink = SidebarLinkGroup;

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
    subItems: [
      {
        label: "All Customers",
        path: "/customers",
        icon: Users
      },
      {
        label: "Add Customer",
        path: "/customers/add",
        icon: Users
      }
    ]
  },
  {
    label: "Invoices",
    path: "/invoices",
    icon: FileSpreadsheet,
    subItems: [
      {
        label: "All Invoices",
        path: "/invoices",
        icon: FileSpreadsheet
      },
      {
        label: "Create Invoice",
        path: "/invoices/create",
        icon: FileSpreadsheet
      }
    ]
  },
  {
    label: "Banking",
    path: "/bank",
    icon: Building2
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
    subItems: [
      {
        label: "All Projects",
        path: "/projects",
        icon: FolderKanban
      },
      {
        label: "Create Project",
        path: "/projects/create",
        icon: FolderKanban
      },
      {
        label: "Job Requests",
        path: "/projects/job-requests",
        icon: MessageCircle
      },
      {
        label: "Services",
        path: "/projects/services",
        icon: Package
      },
      {
        label: "Tasks",
        path: "/projects/tasks",
        icon: FileCheck
      }
    ]
  },
  {
    label: "Income",
    path: "/income",
    icon: DollarSign
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: CreditCard
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3
  },
  {
    label: "Taxes",
    path: "/taxes",
    icon: Receipt
  },
  {
    label: "Payroll",
    path: "/payroll",
    icon: Wallet,
    subItems: [
      {
        label: "Payroll",
        path: "/payroll",
        icon: CreditCardIcon
      },
      {
        label: "Employees",
        path: "/payroll/employees",
        icon: Briefcase
      },
      {
        label: "Leave Management",
        path: "/leaves",
        icon: Calendar
      }
    ]
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings
  },
  {
    label: "Upgrade",
    path: "/upgrade",
    icon: Crown,
    badge: "New"
  },
  // Add Admin section with subscription approvals
  {
    label: "Admin",
    path: "/admin",
    icon: FileCog,
    subItems: [
      {
        label: "Subscription Approvals",
        path: "/admin/subscriptions",
        icon: Crown
      }
    ]
  }
];
