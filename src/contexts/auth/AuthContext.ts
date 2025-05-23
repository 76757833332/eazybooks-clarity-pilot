import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile, Business, UserRole, EmployeeRole } from './types';

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
  
  // Add currency-related functions
  formatCurrency: (amount: number) => string;
  getCurrencySymbol: () => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

