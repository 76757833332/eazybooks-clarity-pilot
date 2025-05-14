
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/theme/ThemeContext';

interface TaskFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  viewMode: string;
  setViewMode: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter
}) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full sm:w-auto">
        <TabsList className={isLightMode ? "bg-gray-100" : "bg-background/5"}>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
      </Tabs>
      {viewMode === "list" && (
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default TaskFilters;
