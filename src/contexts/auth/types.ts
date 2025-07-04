
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'business_owner' | 'employee' | 'client';
export type EmployeeRole = 'admin' | 'manager' | 'staff' | 'accountant' | 'project_manager' | 'custom';
export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface Profile {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
  belongs_to_business_id?: string;
  created_at: string;
  updated_at: string;
  subscription_tier: SubscriptionTier;
  email?: string;
  // Add tenant-specific fields
  tenant_id?: string;
}

export interface Business {
  id: string;
  name: string;
  owner_id: string;
  legal_name: string;
  tax_id: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  type: string;
  description: string;
  logo_url: string;
  business_type: string;
  currency: string;
  default_invoice_terms: string;
  default_tax_percentage: number;
  created_at: string;
  updated_at: string;
  // Make the business ID act as a tenant ID
  tenant_id?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  business: Business | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<boolean | void>; // Updated to allow boolean return
  updateBusiness: (business: Partial<Business>) => Promise<boolean | void>; // Updated to allow boolean return
  createBusiness: (business: Partial<Business>) => Promise<boolean | void>; // Updated to allow boolean return
  inviteUser: (email: string, role: UserRole, employeeRole?: EmployeeRole) => Promise<void>;
  // Add multi-tenant specific methods
  getCurrentTenantId: () => string | undefined;
  switchTenant: (tenantId: string) => Promise<boolean | void>; // Updated to allow boolean return
  fetchUserBusiness: (businessId: string) => Promise<void>;
}
