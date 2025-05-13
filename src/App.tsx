
import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "./contexts/theme/ThemeContext";

// Auth
import { AuthProvider } from "./contexts/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import RoleSelection from "./pages/RoleSelection";
import InviteAccept from "./pages/InviteAccept";

// Invoice Pages
import InvoicesPage from "./pages/invoices/InvoicesPage";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";
import CreateInvoice from "./pages/invoices/CreateInvoice";

// Customer Pages
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetails from "./pages/customers/CustomerDetails";
import CreateCustomer from "./pages/customers/CreateCustomer";

// Expense Pages
import ExpensesPage from "./pages/expenses/ExpensesPage";
import ExpenseDetails from "./pages/expenses/ExpenseDetails";
import CreateExpense from "./pages/expenses/CreateExpense";

// Income Pages
import IncomePage from "./pages/income/IncomePage";
import IncomeDetails from "./pages/income/IncomeDetails";
import CreateIncome from "./pages/income/CreateIncome";

// Project Pages
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetails from "./pages/projects/ProjectDetails";
import CreateProject from "./pages/projects/CreateProject";
import ServicesPage from "./pages/projects/ServicesPage";
import ServiceDetails from "./pages/projects/ServiceDetails";
import CreateService from "./pages/projects/CreateService";
import TasksPage from "./pages/projects/TasksPage";
import TaskDetails from "./pages/projects/TaskDetails";
import CreateTask from "./pages/projects/CreateTask";
import JobRequestsPage from "./pages/projects/JobRequestsPage";
import JobRequestDetails from "./pages/projects/JobRequestDetails";
import CreateJobRequest from "./pages/projects/CreateJobRequest";

// Payroll Pages
import PayrollPage from "./pages/payroll/PayrollPage";
import PayrollDetails from "./pages/payroll/PayrollDetails";
import CreatePayroll from "./pages/payroll/CreatePayroll";
import EmployeesPage from "./pages/payroll/EmployeesPage";
import EmployeeDetails from "./pages/payroll/EmployeeDetails";
import CreateEmployee from "./pages/payroll/CreateEmployee";
import EditEmployee from "./pages/payroll/EditEmployee";

// Leave Pages
import LeavesPage from "./pages/leaves/LeavesPage";
import ApplyForLeave from "./pages/leaves/ApplyForLeave";

// Banking Pages
import BankPage from "./pages/bank/BankPage";

// Reports Pages
import ReportsPage from "./pages/reports/ReportsPage";

// Tax Pages
import TaxesPage from "./pages/taxes/TaxesPage";
import TaxDetails from "./pages/taxes/TaxDetails";
import CreateTax from "./pages/taxes/CreateTax";
import EditTax from "./pages/taxes/EditTax";

// Settings Pages
import Settings from "./pages/settings/Settings";

// Upgrade Pages  
import UpgradePage from "./pages/upgrade/UpgradePage";

// Admin Pages
import AdminPages from "./pages/admin/AdminPages";

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/role" element={<RoleSelection />} />
            <Route path="/invite/:token" element={<InviteAccept />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/invoices/:id" element={<InvoiceDetails />} />
                  <Route path="/invoices/create" element={<CreateInvoice />} />
                  
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/customers/:id" element={<CustomerDetails />} />
                  <Route path="/customers/add" element={<CreateCustomer />} />
                  
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/expenses/:id" element={<ExpenseDetails />} />
                  <Route path="/expenses/add" element={<CreateExpense />} />
                  
                  <Route path="/income" element={<IncomePage />} />
                  <Route path="/income/:id" element={<IncomeDetails />} />
                  <Route path="/income/add" element={<CreateIncome />} />
                  
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/projects/create" element={<CreateProject />} />
                  
                  <Route path="/projects/services" element={<ServicesPage />} />
                  <Route path="/projects/services/:id" element={<ServiceDetails />} />
                  <Route path="/projects/services/create" element={<CreateService />} />
                  
                  <Route path="/projects/tasks" element={<TasksPage />} />
                  <Route path="/projects/tasks/:id" element={<TaskDetails />} />
                  <Route path="/projects/tasks/create" element={<CreateTask />} />
                  
                  <Route path="/projects/job-requests" element={<JobRequestsPage />} />
                  <Route path="/projects/job-requests/:id" element={<JobRequestDetails />} />
                  <Route path="/projects/job-requests/create" element={<CreateJobRequest />} />
                  
                  <Route path="/payroll" element={<PayrollPage />} />
                  <Route path="/payroll/:id" element={<PayrollDetails />} />
                  <Route path="/payroll/create" element={<CreatePayroll />} />
                  
                  <Route path="/payroll/employees" element={<EmployeesPage />} />
                  <Route path="/payroll/employees/:id" element={<EmployeeDetails />} />
                  <Route path="/payroll/employees/create" element={<CreateEmployee />} />
                  <Route path="/payroll/employees/:id/edit" element={<EditEmployee />} />
                  
                  <Route path="/leaves" element={<LeavesPage />} />
                  <Route path="/leaves/apply" element={<ApplyForLeave />} />
                  
                  <Route path="/bank" element={<BankPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  
                  <Route path="/taxes" element={<TaxesPage />} />
                  <Route path="/taxes/:id" element={<TaxDetails />} />
                  <Route path="/taxes/create" element={<CreateTax />} />
                  <Route path="/taxes/:id/edit" element={<EditTax />} />
                  
                  <Route path="/settings/*" element={<Settings />} />
                  <Route path="/upgrade" element={<UpgradePage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/*" element={<AdminPages />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
        <SonnerToaster />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
