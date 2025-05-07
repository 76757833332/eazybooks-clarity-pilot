
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import CreateExpense from "./pages/expenses/CreateExpense";
import ExpenseDetails from "./pages/expenses/ExpenseDetails";
import PayrollPage from "./pages/payroll/PayrollPage";
import EmployeesPage from "./pages/payroll/EmployeesPage";
import CreateEmployee from "./pages/payroll/CreateEmployee";
import EmployeeDetails from "./pages/payroll/EmployeeDetails";
import CreatePayroll from "./pages/payroll/CreatePayroll";
import PayrollDetails from "./pages/payroll/PayrollDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authenticated route wrapper component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!session) {
      return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices" element={
              <ProtectedRoute>
                <InvoicesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/create" element={
              <ProtectedRoute>
                <CreateInvoice />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/:id" element={
              <ProtectedRoute>
                <InvoiceDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/expenses/create" element={
              <ProtectedRoute>
                <CreateExpense />
              </ProtectedRoute>
            } />
            
            <Route path="/expenses/:id" element={
              <ProtectedRoute>
                <ExpenseDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/payroll" element={
              <ProtectedRoute>
                <PayrollPage />
              </ProtectedRoute>
            } />
            
            <Route path="/payroll/create" element={
              <ProtectedRoute>
                <CreatePayroll />
              </ProtectedRoute>
            } />
            
            <Route path="/payroll/:id" element={
              <ProtectedRoute>
                <PayrollDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/payroll/employees" element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/payroll/employees/create" element={
              <ProtectedRoute>
                <CreateEmployee />
              </ProtectedRoute>
            } />
            
            <Route path="/payroll/employees/:id" element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
