
import { employeeService } from "./employeeService";
import { payrollManagementService } from "./payrollManagementService";
import { deductionService } from "./deductionService";

// Re-export all services for backwards compatibility
export const payrollService = {
  // Employee services
  getEmployees: employeeService.getEmployees,
  getEmployeeById: employeeService.getEmployeeById,
  createEmployee: employeeService.createEmployee,
  updateEmployee: employeeService.updateEmployee,
  deleteEmployee: employeeService.deleteEmployee,
  
  // Payroll services
  getPayrolls: payrollManagementService.getPayrolls,
  getPayrollById: payrollManagementService.getPayrollById,
  createPayroll: payrollManagementService.createPayroll,
  updatePayroll: payrollManagementService.updatePayroll,
  deletePayroll: payrollManagementService.deletePayroll,
  
  // Deduction services
  getDeductionTypes: deductionService.getDeductionTypes,
  createDeductionType: deductionService.createDeductionType
};
