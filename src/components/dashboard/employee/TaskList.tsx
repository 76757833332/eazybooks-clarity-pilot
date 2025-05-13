
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
}

interface TaskListProps {
  tasks: Task[];
  getPriorityColor: (priority: string) => string;
}

const TaskList = ({ tasks, getPriorityColor }: TaskListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-eazybooks-purple" />
              Your Tasks
            </div>
          </CardTitle>
          <a
            href="/projects/tasks"
            className="text-sm text-eazybooks-purple hover:underline"
          >
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-10">
                  <CheckCircle size={16} className="text-eazybooks-purple" />
                </div>
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <button className="rounded-md border border-eazybooks-purple px-2 py-1 text-xs text-eazybooks-purple hover:bg-eazybooks-purple/10">
                Start
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
