
import React from "react";
import Sidebar from "@/components/layout/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-eazybooks-purple-dark/80">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold">{title}</h1>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
