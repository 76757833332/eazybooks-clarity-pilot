
import { User, Session } from '@supabase/supabase-js';
import { Profile, Business, UserRole, EmployeeRole } from '@/types/auth';

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
  updateOnboardingStep: (step: number) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  createBusiness: (business: Partial<Business>) => Promise<void>;
  inviteUser: (email: string, role: UserRole, employeeRole?: EmployeeRole) => Promise<void>;
}
