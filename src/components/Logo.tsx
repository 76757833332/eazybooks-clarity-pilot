
import React from "react";
import { Receipt } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", withText = true }) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-eazybooks-purple to-eazybooks-purple-secondary p-2">
        <Receipt className="text-white" size={size === "sm" ? 16 : size === "md" ? 20 : 28} />
      </div>
      {withText && (
        <span className={`font-semibold ${textSizeMap[size]}`}>EazyBooks</span>
      )}
    </div>
  );
};

export default Logo;
