
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Auth & layout
import { AuthProvider } from "./contexts/auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelection from "./pages/RoleSelection";
import InviteAccept from "./pages/InviteAccept";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Settings from "./pages/settings/Settings";
import UpgradePage from "./pages/upgrade/UpgradePage";

// Bank
import BankPage from "./pages/bank/BankPage";

// Income
import IncomePage from "./pages/income/IncomePage";
import CreateIncome from "./pages/income/CreateIncome";
import IncomeDetails from "./pages/income/IncomeDetails";

// Expenses
import ExpensesPage from "./pages/expenses/ExpensesPage";
import CreateExpense from "./pages/expenses/CreateExpense";
import ExpenseDetails from "./pages/expenses/ExpenseDetails";

// Customers
import CustomersPage from "./pages/customers/CustomersPage";
import CreateCustomer from "./pages/customers/CreateCustomer";
import CustomerDetails from "./pages/customers/CustomerDetails";

// Invoices
import InvoicesPage from "./pages/invoices/InvoicesPage";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";

// Taxes
import TaxesPage from "./pages/taxes/TaxesPage";
import CreateTax from "./pages/taxes/CreateTax";
import TaxDetails from "./pages/taxes/TaxDetails";
import EditTax from "./pages/taxes/EditTax";

// Payroll
import PayrollPage from "./pages/payroll/PayrollPage";
import CreatePayroll from "./pages/payroll/CreatePayroll";
import PayrollDetails from "./pages/payroll/PayrollDetails";
import EmployeesPage from "./pages/payroll/EmployeesPage";
import CreateEmployee from "./pages/payroll/CreateEmployee";
import EmployeeDetails from "./pages/payroll/EmployeeDetails";

// Leaves
import LeavesPage from "./pages/leaves/LeavesPage";
import ApplyForLeave from "./pages/leaves/ApplyForLeave";

// Reports
import ReportsPage from "./pages/reports/ReportsPage";

// Projects - New module
import ProjectsPage from "./pages/projects/ProjectsPage";
import CreateProject from "./pages/projects/CreateProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import TasksPage from "./pages/projects/TasksPage";
import TaskDetails from "./pages/projects/TaskDetails";
import CreateTask from "./pages/projects/CreateTask";
import ServicesPage from "./pages/projects/ServicesPage";
import CreateService from "./pages/projects/CreateService";
import ServiceDetails from "./pages/projects/ServiceDetails";
import JobRequestsPage from "./pages/projects/JobRequestsPage";
import CreateJobRequest from "./pages/projects/CreateJobRequest";
import JobRequestDetails from "./pages/projects/JobRequestDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/invite/:token" element={<InviteAccept />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            
            {/* Bank */}
            <Route path="/bank" element={<BankPage />} />
            
            {/* Income */}
            <Route path="/income">
              <Route index element={<IncomePage />} />
              <Route path="create" element={<CreateIncome />} />
              <Route path=":id" element={<IncomeDetails />} />
            </Route>
            
            {/* Expenses */}
            <Route path="/expenses">
              <Route index element={<ExpensesPage />} />
              <Route path="create" element={<CreateExpense />} />
              <Route path=":id" element={<ExpenseDetails />} />
            </Route>
            
            {/* Customers */}
            <Route path="/customers">
              <Route index element={<CustomersPage />} />
              <Route path="create" element={<CreateCustomer />} />
              <Route path=":id" element={<CustomerDetails />} />
            </Route>
            
            {/* Invoices */}
            <Route path="/invoices">
              <Route index element={<InvoicesPage />} />
              <Route path="create" element={<CreateInvoice />} />
              <Route path=":id" element={<InvoiceDetails />} />
            </Route>
            
            {/* Taxes */}
            <Route path="/taxes">
              <Route index element={<TaxesPage />} />
              <Route path="create" element={<CreateTax />} />
              <Route path=":id" element={<TaxDetails />} />
              <Route path="edit/:id" element={<EditTax />} />
            </Route>
            
            {/* Payroll */}
            <Route path="/payroll">
              <Route index element={<PayrollPage />} />
              <Route path="create" element={<CreatePayroll />} />
              <Route path=":id" element={<PayrollDetails />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="employees/create" element={<CreateEmployee />} />
              <Route path="employees/:id" element={<EmployeeDetails />} />
            </Route>
            
            {/* Leaves */}
            <Route path="/leaves">
              <Route index element={<LeavesPage />} />
              <Route path="apply" element={<ApplyForLeave />} />
            </Route>
            
            {/* Project Management */}
            <Route path="/projects">
              <Route index element={<ProjectsPage />} />
              <Route path="create" element={<CreateProject />} />
              <Route path=":id" element={<ProjectDetails />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/create" element={<CreateTask />} />
              <Route path="tasks/:id" element={<TaskDetails />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/create" element={<CreateService />} />
              <Route path="services/:id" element={<ServiceDetails />} />
              <Route path="job-requests" element={<JobRequestsPage />} />
              <Route path="job-requests/create" element={<CreateJobRequest />} />
              <Route path="job-requests/:id" element={<JobRequestDetails />} />
            </Route>
            
            {/* Reports */}
            <Route path="/reports" element={<ReportsPage />} />

            {/* Settings */}
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
