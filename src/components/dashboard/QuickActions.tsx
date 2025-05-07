
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt, 
  FileText, 
  CreditCard,
  CalendarDays
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center space-y-2 rounded-lg bg-secondary/40 p-3 transition-all hover:bg-secondary/60",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-eazybooks-purple/20 text-eazybooks-purple">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-secondary/40 rounded-lg p-4">
      <h3 className="text-sm font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        <ActionButton
          icon={<PlusCircle size={20} />}
          label="New Transaction"
          onClick={() => console.log("New Transaction")}
        />
        <ActionButton
          icon={<ArrowDownLeft size={20} />}
          label="Record Income"
          onClick={() => console.log("Record Income")}
        />
        <ActionButton
          icon={<ArrowUpRight size={20} />}
          label="Record Expense"
          onClick={() => navigate("/expenses/create")}
        />
        <ActionButton
          icon={<Receipt size={20} />}
          label="Create Invoice"
          onClick={() => navigate("/invoices/create")}
        />
        <ActionButton
          icon={<FileText size={20} />}
          label="Create Quote"
          onClick={() => console.log("Create Quote")}
        />
        <ActionButton
          icon={<CreditCard size={20} />}
          label="Pay Taxes"
          onClick={() => console.log("Pay Taxes")}
        />
        <ActionButton
          icon={<CalendarDays size={20} />}
          label="Apply for Leave"
          onClick={() => navigate("/leaves/apply")}
        />
      </div>
    </div>
  );
};

export default QuickActions;
