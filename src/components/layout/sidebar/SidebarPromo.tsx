
import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarPromo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mx-3 mb-3 rounded-lg bg-eazybooks-purple bg-opacity-20 p-4">
      <div className="mb-2 text-sm font-semibold text-eazybooks-purple">
        EazyBooks Pro
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Unlock premium features including payroll, advanced reporting and AI insights
      </p>
      <button 
        onClick={() => navigate('/upgrade')}
        className="w-full rounded-lg bg-eazybooks-purple px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-eazybooks-purple-secondary">
        Upgrade now
      </button>
    </div>
  );
};

export default SidebarPromo;
