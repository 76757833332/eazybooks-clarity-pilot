
// Re-export components from the auth context
export { AuthContext } from './AuthContext';
export type { AuthContextType } from './AuthContext';
export { AuthProvider } from './AuthProvider';
export * from './types';

// Don't re-export the useAuth hook because it's already exported from AuthContext
