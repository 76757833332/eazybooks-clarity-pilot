
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
import { KanbanColumn as ColumnType, KanbanTask } from './KanbanBoard';

interface KanbanColumnProps {
  column: ColumnType;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumnName: (columnId: string, newName: string) => void;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: KanbanTask) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onDeleteColumn,
  onUpdateColumnName,
  onAddTask,
  onEditTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  
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
    setIsEditing(true);
  };
  
  const handleEditEnd = () => {
    setIsEditing(false);
    if (columnName.trim() !== '') {
      onUpdateColumnName(column.id, columnName);
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
  
  return (
    <div
      ref={combinedRef}
      style={style}
      className="flex-shrink-0 w-[280px]"
      {...attributes}
    >
      <Card className="bg-black/40 backdrop-blur-sm border-gray-700 h-full">
        <CardHeader className="p-3 flex flex-row justify-between items-center space-y-0">
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
              className="text-base font-semibold cursor-pointer"
              onClick={handleEditStart}
              {...listeners}
            >
              {column.name}
            </CardTitle>
          )}
          <X 
            className="h-4 w-4 cursor-pointer hover:text-red-500" 
            onClick={() => onDeleteColumn(column.id)}
            aria-label="Delete column"
          />
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
                onClick={() => onEditTask(task)}
              />
            ))}
          </SortableContext>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => onAddTask(column.id)}
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
