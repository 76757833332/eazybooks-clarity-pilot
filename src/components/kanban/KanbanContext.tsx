
import React, { createContext, useContext, useState } from 'react';
import { KanbanContextProps } from './KanbanContextTypes';
import { KanbanTask } from './types';
import { KanbanColumn } from './KanbanContextTypes';
import { useTasksData } from './useTasksData';
import { useColumnHandlers } from './useColumnHandlers';
import { useTaskHandlers } from './useTaskHandlers';

export const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<KanbanTask | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  
  const { 
    columns, 
    setColumns, 
    tasksData, 
    isLoading, 
    refetchTasks 
  } = useTasksData();
  
  const {
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumnName,
    findColumnByTaskId
  } = useColumnHandlers(columns, setColumns);
  
  const {
    handleAddTask,
    handleEditTask,
    handleSaveTask,
    handleDeleteTask
  } = useTaskHandlers(
    columns, 
    setColumns, 
    setCurrentTask, 
    setIsNewTask, 
    setIsTaskModalOpen, 
    refetchTasks
  );

  return (
    <KanbanContext.Provider
      value={{
        columns,
        setColumns,
        activeTask,
        setActiveTask,
        activeColumn,
        setActiveColumn,
        isTaskModalOpen,
        setIsTaskModalOpen,
        currentTask,
        setCurrentTask,
        isNewTask,
        setIsNewTask,
        isLoading,
        tasksData,
        refetchTasks,
        findColumnByTaskId,
        handleAddColumn,
        handleDeleteColumn,
        handleUpdateColumnName,
        handleAddTask,
        handleEditTask,
        handleSaveTask,
        handleDeleteTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
