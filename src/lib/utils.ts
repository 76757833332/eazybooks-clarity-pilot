
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
}

// Demo data for the dashboard
export const recentTransactions = [
  {
    id: '1',
    name: 'Client Payment',
    date: 'Today, 14:35',
    amount: 350.00,
    type: 'income' as const,
  },
  {
    id: '2',
    name: 'Office Supplies',
    date: 'Yesterday, 10:20',
    amount: 42.50,
    type: 'expense' as const,
  },
  {
    id: '3',
    name: 'Freelance Work',
    date: '20 Oct, 09:15',
    amount: 275.00,
    type: 'income' as const,
  },
  {
    id: '4',
    name: 'Software Subscription',
    date: '18 Oct, 11:45',
    amount: 29.99,
    type: 'expense' as const,
  },
  {
    id: '5',
    name: 'Consulting Fee',
    date: '15 Oct, 16:30',
    amount: 500.00,
    type: 'income' as const,
  },
];
