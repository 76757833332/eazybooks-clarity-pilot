
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/theme/ThemeContext";

interface TaskDescriptionProps {
  description: string | null;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  return (
    <Card className={isLightMode ? "border-gray-200 shadow-sm" : ""}>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {description || "No description provided"}
        </p>
      </CardContent>
    </Card>
  );
};

export default TaskDescription;
