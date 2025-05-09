
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Invite, UserRole } from "@/types/auth";

const InviteAccept = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) return;

      try {
        const { data, error } = await (supabase
          .from('invites') as any)
          .select('*')
          .eq('token', token)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Check if invitation has expired
          const now = new Date();
          const expiresAt = new Date(data.expires_at);
          
          if (now > expiresAt) {
            setError("This invitation has expired");
          } else if (data.status !== 'pending') {
            setError("This invitation has already been used");
          } else {
            setInvite(data as Invite);
          }
        } else {
          setError("Invalid invitation");
        }
      } catch (err) {
        console.error("Error fetching invite:", err);
        setError("Invalid or expired invitation");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;

    setFormLoading(true);
    setError(null);

    try {
      // Basic validation
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        setFormLoading(false);
        return;
      }

      // Create the user account
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: invite.role
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!userData.user) {
        throw new Error("Failed to create user");
      }

      // Update the invite status
      const { error: updateError } = await (supabase
        .from('invites') as any)
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      if (updateError) {
        throw updateError;
      }

      // If it's an employee, create employee record
      if (invite.role === 'employee' && invite.employee_role) {
        const { error: employeeError } = await (supabase
          .from('employees') as any)
          .insert([{
            user_id: userData.user.id,
            business_id: invite.business_id,
            employee_role: invite.employee_role,
          }]);

        if (employeeError) {
          console.error("Error creating employee record:", employeeError);
          // Continue anyway, the user is created
        }
      }

      // If it's a client, create client-business relationship
      if (invite.role === 'client') {
        const { error: clientError } = await (supabase
          .from('client_businesses') as any)
          .insert([{
            client_id: userData.user.id,
            business_id: invite.business_id,
          }]);

        if (clientError) {
          console.error("Error creating client-business record:", clientError);
          // Continue anyway, the user is created
        }
      }

      toast.success("Account created successfully. Please check your email for verification.");
      navigate("/login", { state: { message: "Account created! Please check your email to verify your account." } });
    } catch (err: any) {
      console.error("Error accepting invite:", err);
      setError(err.message || "An error occurred while accepting the invitation");
    } finally {
      setFormLoading(false);
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case "business_owner":
        return "Business Owner";
      case "employee":
        return "Employee";
      case "client":
        return "Client";
      default:
        return "User";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
        <Logo size="lg" />
        <p className="mt-4 text-xl">Loading invitation...</p>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
        <div className="w-full max-w-md rounded-xl bg-black/60 p-8 backdrop-blur-md">
          <div className="mb-6 flex flex-col items-center">
            <Logo size="lg" />
            <h1 className="mt-4 text-2xl font-bold">Invitation Error</h1>
          </div>
          
          <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">
            <p>{error || "Invalid invitation"}</p>
          </div>
          
          <Button
            onClick={() => navigate("/login")}
            className="mt-6 w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
      <div className="w-full max-w-md rounded-xl bg-black/60 p-8 backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-bold">Accept Invitation</h1>
          <p className="text-center text-sm text-muted-foreground">
            You've been invited as a {getRoleTitle(invite.role)}. Complete your account setup to accept.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleAcceptInvite} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={invite.email}
              disabled
              className="bg-secondary/20 border-border opacity-70"
            />
          </div>

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
            disabled={formLoading}
            className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
          >
            {formLoading ? "Processing..." : "Accept Invitation"}
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

export default InviteAccept;
