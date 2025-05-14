
import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { KanbanProvider, useKanban } from './KanbanContext';
import { useKanbanDnd } from './useKanbanDnd';
import { useTheme } from '@/contexts/theme/ThemeContext';

const KanbanBoardContent = () => {
  const {
    columns,
    activeTask,
    handleAddColumn,
    isTaskModalOpen,
    currentTask,
    setIsTaskModalOpen,
    handleSaveTask,
    handleDeleteTask,
    isNewTask,
    isLoading
  } = useKanban();
  
  const { resolvedTheme } = useTheme();
  const { handleDragStart, handleDragOver, handleDragEnd } = useKanbanDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddColumn}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </div>
      
      <div className={`relative overflow-x-auto pb-4 ${
        resolvedTheme === 'light' 
          ? 'bg-white/70 rounded-lg p-4 border border-gray-200 shadow-sm' 
          : ''
      }`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>

      {isTaskModalOpen && currentTask && (
        <TaskModal
          task={currentTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          isNew={isNewTask}
        />
      )}
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  return (
    <KanbanProvider>
      <KanbanBoardContent />
    </KanbanProvider>
  );
};

export default KanbanBoard;
