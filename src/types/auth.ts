
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'business_owner' | 'employee' | 'client';

export type BusinessType = 'sole_proprietor' | 'partnership' | 'llc' | 'corporation' | 'freelancer' | 'other';

export type EmployeeRole = 'admin' | 'accountant' | 'project_manager' | 'staff' | 'custom';

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  onboarding_step: number;
  role: UserRole;
  created_at: string;
  updated_at: string;
  belongs_to_business_id: string | null;
  verified: boolean;
}

export interface Business {
  id: string;
  name: string;
  logo_url: string | null;
  business_type: BusinessType;
  tax_id: string | null;
  currency: string;
  owner_id: string;
  default_invoice_terms: string | null;
  default_tax_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  business_id: string;
  employee_role: EmployeeRole;
  departments: string[] | null;
  can_manage_clients: boolean;
  can_manage_invoices: boolean;
  can_manage_expenses: boolean;
  can_manage_employees: boolean;
  can_manage_projects: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invite {
  id: string;
  email: string;
  business_id: string;
  invited_by: string;
  role: UserRole;
  employee_role: EmployeeRole | null;
  status: InviteStatus;
  token: string;
  created_at: string;
  expires_at: string;
}

export interface ClientBusiness {
  id: string;
  client_id: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  business: Business | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateOnboardingStep: (step: number) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  createBusiness: (business: Partial<Business>) => Promise<void>;
  inviteUser: (email: string, role: UserRole, employeeRole?: EmployeeRole) => Promise<void>;
}
