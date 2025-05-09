
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'business_owner' | 'employee' | 'client';
export type EmployeeRole = 'admin' | 'manager' | 'staff';

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  belongs_to_business_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  legal_name?: string;
  owner_id: string;
  tax_id?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  type?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  business: Business | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateBusiness: (business: Partial<Business>) => Promise<void>;
  updateOnboardingStep: (step: number) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  createBusiness: (business: Partial<Business>) => Promise<void>;
  inviteUser: (email: string, role: UserRole, employeeRole?: EmployeeRole) => Promise<void>;
}
