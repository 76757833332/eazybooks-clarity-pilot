
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { UserRole } from "@/types/auth";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-eazybooks-purple/10 to-eazybooks-purple-dark/90">
      <div className="w-full max-w-md rounded-xl bg-black/60 p-8 backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-bold">Welcome to EazyBooks</h1>
          <p className="text-center text-sm text-muted-foreground">
            Choose how you'd like to use EazyBooks to get started with the right setup
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleRoleSelect("business_owner")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-eazybooks-purple bg-eazybooks-purple/20 p-3 transition-colors hover:bg-eazybooks-purple/30"
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
                <path d="M18 21v-2a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <path d="M12 13h.01"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                I'm a business owner
              </span>
              <span className="text-xs text-muted-foreground">
                Create a business account to manage your finances, invoices, and team
              </span>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect("employee")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
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
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <path d="M12 11h4"/>
                <path d="M12 16h4"/>
                <path d="M8 11h.01"/>
                <path d="M8 16h.01"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                I'm an employee
              </span>
              <span className="text-xs text-muted-foreground">
                Join your company's workspace to track time, submit expenses, and manage tasks
              </span>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect("client")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                I'm a client
              </span>
              <span className="text-xs text-muted-foreground">
                Work with businesses, view projects, and manage invoices
              </span>
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
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

export default RoleSelection;
