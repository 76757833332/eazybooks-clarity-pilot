
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "account-type">("details");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic password validation
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }
      
      setStep("account-type");
    } catch (err) {
      console.error("Form error:", err);
      toast.error("An error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error("An error occurred during Google signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountTypeSelection = async (type: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            account_type: type
          }
        }
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        setStep("details");
      } else {
        toast.success(`Account created as ${type}!`);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An error occurred during signup");
      setStep("details");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "account-type") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
        <div className="w-full max-w-md rounded-xl bg-black/60 p-8 backdrop-blur-md">
          <div className="mb-6 flex flex-col items-center">
            <Logo size="lg" />
            <h1 className="mt-4 text-2xl font-bold">Who are you?</h1>
            <p className="text-sm text-muted-foreground">
              Before we begin, we need some small details.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={() => handleAccountTypeSelection("Student")}
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-20 text-eazybooks-purple">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  I'm working as a student
                </span>
                <span className="text-xs text-muted-foreground">
                  Studying with self-employed status
                </span>
              </div>
            </button>

            <button 
              onClick={() => handleAccountTypeSelection("Individual")}
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-eazybooks-purple bg-eazybooks-purple/20 p-3 transition-colors hover:bg-eazybooks-purple/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-20 text-eazybooks-purple">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  I'm working as a natural person
                </span>
                <span className="text-xs text-muted-foreground">
                  Working as a natural person
                </span>
              </div>
            </button>

            <button 
              onClick={() => handleAccountTypeSelection("Business")}
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-20 text-eazybooks-purple">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  I'm working as a legal person
                </span>
                <span className="text-xs text-muted-foreground">
                  Working with a legal business
                </span>
              </div>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you accept:{" "}
            <a href="#" className="text-eazybooks-purple hover:underline">
              terms and conditions
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
      <div className="w-full max-w-md rounded-xl bg-black/60 p-8 backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <button 
          onClick={handleGoogleSignup}
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
          <span className="ml-2">Sign up with Google</span>
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

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First name
              </label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="bg-secondary/20 border-border"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last name
              </label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                className="bg-secondary/20 border-border"
              />
            </div>
          </div>
          
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-secondary/20 border-border"
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-eazybooks-purple text-white hover:bg-eazybooks-purple-secondary"
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="font-medium text-eazybooks-purple hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
