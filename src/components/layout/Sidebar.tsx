import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  DollarSign,
  UserRound,
  LogOut,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type SidebarLinkType = {
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: {
    label: string;
    path: string;
    icon?: React.ElementType;
  }[];
};

const sidebarLinks: SidebarLinkType[] = [
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
  { icon: BarChart3, label: "Reports", path: "/reports" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({
    "/payroll": true, // Default expanded state
  });

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return "?";
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

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
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
          const hasSubItems = link.subItems && link.subItems.length > 0;
          const isExpanded = expandedItems[link.path];
          const showSubItems = hasSubItems && isExpanded;
          
          return (
            <React.Fragment key={link.path}>
              {hasSubItems ? (
                <button
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-eazybooks-purple/10",
                    isActive
                      ? "bg-eazybooks-purple/20 text-eazybooks-purple font-medium"
                      : "text-muted-foreground"
                  )}
                  onClick={() => toggleExpand(link.path)}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                </button>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-eazybooks-purple/10",
                    isActive
                      ? "bg-eazybooks-purple/20 text-eazybooks-purple font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              )}
              
              {showSubItems && (
                <div className="ml-7 mt-1 space-y-1 border-l border-border pl-3">
                  {link.subItems?.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
                    
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-eazybooks-purple/10",
                          isSubActive
                            ? "bg-eazybooks-purple/10 text-eazybooks-purple font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {subItem.icon && <subItem.icon size={16} />}
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          );
        })}
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
            {getInitials()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.email || 'User'}</span>
            <span className="text-xs text-muted-foreground">Business account</span>
          </div>
          <div className="ml-auto flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={() => navigate('/settings')}
            >
              <Settings size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
