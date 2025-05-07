
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/expenses/create" element={<CreateExpense />} />
          <Route path="/expenses/:id" element={<ExpenseDetails />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/payroll/create" element={<CreatePayroll />} />
          <Route path="/payroll/:id" element={<PayrollDetails />} />
          <Route path="/payroll/employees" element={<EmployeesPage />} />
          <Route path="/payroll/employees/create" element={<CreateEmployee />} />
          <Route path="/payroll/employees/:id" element={<EmployeeDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
