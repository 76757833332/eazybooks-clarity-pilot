
import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-eazybooks-purple-light dark:from-black dark:to-eazybooks-purple-dark/80">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between border-b border-border p-4 bg-white dark:bg-background/5 backdrop-blur-sm">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto bg-white/80 dark:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
