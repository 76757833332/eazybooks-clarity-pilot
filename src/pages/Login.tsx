
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface LocationState {
  message?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Check for any success message passed from other screens
  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.message) {
      toast.success(state.message);
      // Clear the message from state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "An error occurred during Google login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
      <div className="w-full max-w-md rounded-xl bg-black/60 p-8 backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Please enter your details.
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/20 py-2.5 px-4 text-sm font-medium hover:bg-secondary/40 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.4 9.2C17.4 8.567 17.34 7.9 17.24 7.267H9V10.667H13.7C13.46 11.767 12.74 12.733 11.7 13.367V15.567H14.44C16.02 14.133 17.4 11.933 17.4 9.2Z"
              fill="#4285F4"
            />
            <path
              d="M9 18C11.34 18 13.32 17.233 14.44 15.566L11.7 13.367C10.94 13.9 10.02 14.2 9 14.2C6.74 14.2 4.82 12.667 4.14 10.6H1.32V12.867C2.44 15.933 5.48 18 9 18Z"
              fill="#34A853"
            />
            <path
              d="M4.14 10.6C3.94 10.067 3.84 9.5 3.84 8.9C3.84 8.3 3.96 7.733 4.14 7.2V4.933H1.32C0.78 6.133 0.5 7.483 0.5 8.9C0.5 10.317 0.78 11.667 1.32 12.867L4.14 10.6Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.6C10.26 3.6 11.4 4.033 12.3 4.867L14.74 2.433C13.32 1.1 11.34 0.3 9 0.3C5.48 0.3 2.44 2.367 1.32 5.433L4.14 7.7C4.82 5.633 6.74 3.6 9 3.6Z"
              fill="#EA4335"
            />
          </svg>
          <span className="ml-2">Log in with Google</span>
        </button>

        <div className="relative mb-4 flex items-center justify-center">
          <hr className="w-full border-t border-border" />
          <span className="absolute bg-black/60 px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="bg-secondary/20 border-border"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs text-eazybooks-purple hover:underline"
              >
                Forgot password
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-secondary/20 border-border"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-eazybooks-purple text-white hover:bg-eazybooks-purple-secondary"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a
            href="/select-role"
            onClick={(e) => {
              e.preventDefault();
              navigate("/select-role");
            }}
            className="font-medium text-eazybooks-purple hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
