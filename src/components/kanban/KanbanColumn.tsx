
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import TaskCard from './TaskCard';
import { KanbanColumn as ColumnType } from './KanbanContext';
import { Badge } from '@/components/ui/badge';
import { useKanban } from './KanbanContext';

interface KanbanColumnProps {
  column: ColumnType;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  
  const { 
    handleDeleteColumn, 
    handleUpdateColumnName, 
    handleAddTask, 
    handleEditTask 
  } = useKanban();
  
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });
  
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const handleEditStart = () => {
    // Don't allow editing default column names
    if (['todo', 'in_progress', 'review', 'completed'].includes(column.id)) {
      return;
    }
    setIsEditing(true);
  };
  
  const handleEditEnd = () => {
    setIsEditing(false);
    if (columnName.trim() !== '') {
      handleUpdateColumnName(column.id, columnName);
    } else {
      setColumnName(column.name);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditEnd();
    }
  };
  
  const combinedRef = (node: HTMLDivElement) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const getColumnHeaderColor = (columnId: string) => {
    switch(columnId) {
      case 'todo': return 'bg-gray-500/20';
      case 'in_progress': return 'bg-blue-500/20';
      case 'review': return 'bg-orange-500/20';
      case 'completed': return 'bg-green-500/20';
      default: return 'bg-gray-500/20';
    }
  };
  
  return (
    <div
      ref={combinedRef}
      style={style}
      className="flex-shrink-0 w-[280px]"
      {...attributes}
    >
      <Card className="bg-black/40 backdrop-blur-sm border-gray-700 h-full">
        <CardHeader className={`p-3 flex flex-row justify-between items-center space-y-0 ${getColumnHeaderColor(column.id)}`}>
          {isEditing ? (
            <Input
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onBlur={handleEditEnd}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-base font-semibold h-8 bg-transparent"
            />
          ) : (
            <CardTitle
              className="text-base font-semibold cursor-pointer flex items-center gap-2"
              onClick={handleEditStart}
              {...listeners}
            >
              {column.name}
              <Badge variant="outline" className="text-xs">
                {column.tasks.length}
              </Badge>
            </CardTitle>
          )}
          
          {/* Only show delete button for non-default columns */}
          {!['todo', 'in_progress', 'review', 'completed'].includes(column.id) && (
            <X 
              className="h-4 w-4 cursor-pointer hover:text-red-500" 
              onClick={() => handleDeleteColumn(column.id)}
              aria-label="Delete column"
            />
          )}
        </CardHeader>
        <CardContent className="p-2 space-y-2 min-h-[100px]">
          <SortableContext
            items={column.tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleEditTask(task)}
              />
            ))}
          </SortableContext>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => handleAddTask(column.id)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add task
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanColumn;
