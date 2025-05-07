
import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import { formatCurrency, recentTransactions } from '@/lib/utils';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-eazybooks-purple-dark/80">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">October 2025</span>
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
            <h2 className="text-lg font-medium mb-1">Good morning!</h2>
            <p className="text-muted-foreground">Here's what's happening with your business today.</p>
          </div>
          
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total Revenue" 
                  value={formatCurrency(14850.50)}
                  changeValue="12%" 
                  changeDirection="up" 
                  latestDate="Today" 
                />
                <MetricCard 
                  title="Total Expenses" 
                  value={formatCurrency(5230.25)}
                  changeValue="8%" 
                  changeDirection="up" 
                  latestDate="Today" 
                />
                <MetricCard 
                  title="Net Profit" 
                  value={formatCurrency(9620.25)}
                  changeValue="15%" 
                  changeDirection="up" 
                  latestDate="Today" 
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
