
import { UserRole, EmployeeRole } from '@/contexts/auth/types';
import * as authService from '@/services/authService';
import { toast } from 'sonner';

// Invite user utility function
export const inviteUser = async (
  userId: string,
  businessId: string | undefined,
  email: string,
  role: UserRole,
  employeeRole?: EmployeeRole
) => {
  if (!businessId) {
    toast.error('You need to create a business first');
    return;
  }
  
  try {
    await authService.inviteUser(userId, businessId, email, role, employeeRole);
    toast.success(`Invitation sent to ${email}`);
  } catch (error) {
    console.error("Error inviting user:", error);
    toast.error("Failed to send invitation");
  }
};

// Get current tenant ID utility function
export const getCurrentTenantId = (businessId?: string, belongsToBusinessId?: string) => {
  // For business owners and employees, the tenant ID is the business ID
  return businessId || belongsToBusinessId;
};
