'use client';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { BiLoaderAlt } from 'react-icons/bi';
import { defaultTaskStatus, type Task, type TaskStatus } from '@/types';
import TaskDrawer from './TaskDrawer';
import Column from './Column';
import { transformTaskList } from '@/utils/transformTaskData';
import { useTasks } from '@/api/queries';
import { useAddTask, useDeleteTask, useReoderTasks, useUpdateTask } from '@/api/mutations';

const defaultEmptyTask: Partial<Task> = {
  title: '',
  description: '',
  status: undefined,
  priority: undefined,
  deadline: undefined,
  position: -1,
};

function Board({
  showTaskDrawer,
  setShowTaskDrawer,
}: {
  showTaskDrawer: boolean;
  setShowTaskDrawer: (val: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { isLoading, data: groupedTasks } = useTasks();

  const addTaskMutation = useAddTask({
    onSuccessHandler: () => {
      setShowTaskDrawer(false);
    },
  });

  const updateTaskMutation = useUpdateTask({
    onSuccessHandler: () => {
      setShowTaskDrawer(false);
    },
  });

  const reorderMutation = useReoderTasks();

  const deleteTaskMutation = useDeleteTask({
    onSuccessHandler: () => {
      setShowTaskDrawer(false);
    },
  });

  const [activeTask, setActiveTask] = useState<Partial<Task>>(defaultEmptyTask);
  const [isEditMode, setIsEditMode] = useState(false);

  const isSaving = addTaskMutation.isPending || updateTaskMutation.isPending;

  useEffect(() => {
    if (!showTaskDrawer) {
      setActiveTask(defaultEmptyTask);
      setIsEditMode(false);
    }
  }, [showTaskDrawer]);

  function handleDragEnd(result: DropResult) {
    if (!result.destination || !groupedTasks) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCol = groupedTasks[source.droppableId as TaskStatus];
    const destCol = groupedTasks[destination.droppableId as TaskStatus];

    if (sourceCol === destCol) {
      const tasks = [...sourceCol];
      const [removed] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, removed);

      tasks.forEach((task, index) => {
        task.position = index;
      });

      queryClient.setQueryData(['tasks'], () => {
        const updatedTasks = defaultTaskStatus
          .map((status) => {
            if (status === source.droppableId) {
              return tasks;
            }
            return groupedTasks[status as TaskStatus];
          })
          .filter(Boolean);
        return { tasks: updatedTasks.flat() };
      });

      reorderMutation.mutate({
        id: draggableId,
        status: source.droppableId as TaskStatus,
        position: destination.index,
        sourceTasks: tasks.map(({ _id, position }) => ({ _id, position })),
        destinationTasks: tasks.map(({ _id, position }) => ({ _id, position })),
        sameColumn: true,
      });

      return;
    }

    const sourceTasks = [...sourceCol];
    const destTasks = destCol ? [...destCol] : [];

    // Remove task from source column
    const [removed] = sourceTasks.splice(source.index, 1);

    destTasks.splice(destination.index, 0, {
      ...removed,
      status: destination.droppableId as TaskStatus,
    });

    sourceTasks.forEach((task, index) => {
      task.position = index;
    });

    destTasks.forEach((task, index) => {
      task.position = index;
    });

    // Add task to destination column

    queryClient.setQueryData(['tasks'], () => {
      const tasks = defaultTaskStatus
        .map((status) => {
          if (status === source.droppableId) {
            return sourceTasks;
          } else if (status === destination.droppableId) {
            return destTasks;
          }
          return groupedTasks[status as TaskStatus];
        })
        .filter(Boolean);
      return { tasks: tasks.flat() };
    });

    reorderMutation.mutate({
      id: draggableId,
      status: destination.droppableId as TaskStatus,
      position: destination.index,
      sourceTasks: sourceTasks.map(({ _id, position }) => ({ _id, position })),
      destinationTasks: destTasks.map(({ _id, position }) => ({ _id, position })),
      sameColumn: false,
    });
  }

  function handleSave(task: Partial<Task>) {
    if (!isEditMode) {
      return addTaskMutation.mutate({
        ...task,
        position: groupedTasks?.[task.status!]?.length ?? 0,
      });
    }

    updateTaskMutation.mutate(task);
  }

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg max-h-full min-h-72 flex items-center justify-center">
        <BiLoaderAlt className="animate-spin w-8 h-8" />
      </section>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <section className="bg-white rounded-lg h-full flex-1 flex gap-4 p-4 mt-2 overflow-auto custom-scrollar">
        {groupedTasks && (
          <>
            {defaultTaskStatus.map((status) => (
              <Column
                key={status}
                name={status}
                tasks={groupedTasks[status] ?? []}
                setShowTaskDrawer={setShowTaskDrawer}
                setActiveTask={setActiveTask}
                setIsEditMode={setIsEditMode}
              />
            ))}
          </>
        )}
      </section>
      <TaskDrawer
        task={activeTask}
        handleSave={handleSave}
        isSaving={isSaving}
        isEditMode={isEditMode}
        handleDelete={deleteTaskMutation.mutate}
        isDeletePending={deleteTaskMutation.isPending}
      />
    </DragDropContext>
  );
}

export default Board;
