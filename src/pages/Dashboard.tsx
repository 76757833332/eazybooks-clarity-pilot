
import React, { useEffect, useState } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Fetch financial summaries
  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: async () => {
      try {
        // Fetch invoices for revenue
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('total_amount')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        
        if (invoicesError) throw invoicesError;
        
        // Fetch expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
          
        if (expensesError) throw expensesError;
        
        // Calculate totals
        const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        const netProfit = totalRevenue - totalExpenses;
        
        return {
          revenue: totalRevenue,
          expenses: totalExpenses,
          profit: netProfit
        };
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Data fetch error",
          description: "Could not load financial summary",
          variant: "destructive"
        });
        return {
          revenue: 0,
          expenses: 0,
          profit: 0
        };
      }
    }
  });

  // Fetch recent transactions (combining recent invoices and expenses)
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        
        // Get recent invoices
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('*, customers(name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (invoicesError) throw invoicesError;
        
        // Get recent expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (expensesError) throw expensesError;
        
        // Format transactions for display
        const formattedInvoices = invoicesData?.map(invoice => ({
          id: invoice.id,
          type: 'invoice',
          description: `Invoice #${invoice.invoice_number}`,
          amount: Number(invoice.total_amount),
          date: new Date(invoice.issue_date),
          status: invoice.status,
          entity: invoice.customers?.name || 'Unknown Customer'
        })) || [];
        
        const formattedExpenses = expenses?.map(expense => ({
          id: expense.id,
          type: 'expense',
          description: expense.description || 'Expense',
          amount: -Number(expense.amount),
          date: new Date(expense.expense_date),
          status: expense.status,
          entity: expense.category
        })) || [];
        
        // Combine and sort by date
        const combined = [...formattedInvoices, ...formattedExpenses]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 5);
        
        setRecentTransactions(combined);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    
    fetchRecentTransactions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-eazybooks-purple-dark/80">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-1">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!</h2>
            <p className="text-muted-foreground">Here's what's happening with your business today.</p>
          </div>
          
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total Revenue" 
                  value={formatCurrency(isLoadingSummary ? 0 : financialSummary?.revenue || 0)}
                  changeValue="12%" 
                  changeDirection="up" 
                  latestDate="Today" 
                  isLoading={isLoadingSummary}
                />
                <MetricCard 
                  title="Total Expenses" 
                  value={formatCurrency(isLoadingSummary ? 0 : financialSummary?.expenses || 0)}
                  changeValue="8%" 
                  changeDirection="up" 
                  latestDate="Today" 
                  isLoading={isLoadingSummary}
                />
                <MetricCard 
                  title="Net Profit" 
                  value={formatCurrency(isLoadingSummary ? 0 : financialSummary?.profit || 0)}
                  changeValue="15%" 
                  changeDirection="up" 
                  latestDate="Today" 
                  isLoading={isLoadingSummary}
                />
              </div>
              
              {/* Performance Chart */}
              <PerformanceChart />
              
              {/* Quick Actions */}
              <QuickActions />
              
            </div>
            
            <div className="space-y-6">
              <RecentTransactions transactions={recentTransactions} />
              
              {/* Tax Due Section */}
              <div className="bg-secondary/40 rounded-lg p-4 border border-yellow-500/30">
                <h3 className="text-sm font-medium mb-2">Tax Payment Due</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-yellow-500 text-sm">VAT Q3 payment due in 5 days</p>
                  <p className="text-xl font-bold">{formatCurrency(1245.78)}</p>
                  <Button 
                    className="mt-2 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                    size="sm"
                  >
                    Pay now
                  </Button>
                </div>
              </div>
              
              {/* Unpaid Invoices */}
              <div className="bg-secondary/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Unpaid Invoices</h3>
                  <span className="text-xs text-muted-foreground">View all</span>
                </div>
                <p className="text-xl font-bold">{formatCurrency(3280.00)}</p>
                <p className="text-sm text-muted-foreground mb-4">4 invoices pending</p>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">Send reminder</Button>
                  <Button 
                    size="sm"
                    className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
