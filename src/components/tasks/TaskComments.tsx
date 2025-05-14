
import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const TaskComments: React.FC = () => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
    
    setComment("");
  };

  return (
    <Card className={isLightMode ? "border-gray-200 shadow-sm" : ""}>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>
          Discussion about this task
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
          <p className="text-muted-foreground mt-2">
            No comments yet
          </p>
        </div>
        
        <Separator />
        
        <div className="flex gap-4 mt-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`min-h-[80px] ${isLightMode ? "border-gray-300" : ""}`}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment}>
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskComments;
