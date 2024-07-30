'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { BiLoaderAlt } from 'react-icons/bi';
import { createTask, getTasks, updateTask } from '@/api/task';
import { defaultTaskStatus, type Task, type TaskStatus } from '@/types';
import TaskDrawer from './TaskDrawer';
import Column from './Column';
import { transformTaskList } from '@/utils/transformTaskData';

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
  const { isLoading, data: groupedTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    select: transformTaskList,
    refetchOnWindowFocus: false,
  });

  const addTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: ({ task: newTask }) => {
      toast.success('Task created successfully');

      queryClient.setQueryData(['tasks'], (oldData: { tasks: Task[] }) => {
        const updatedTasks = [...oldData.tasks, newTask];
        return { tasks: updatedTasks };
      });

      setShowTaskDrawer(false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: ({ task: updatedTask }) => {
      toast.success('Task updated successfully');

      queryClient.setQueryData(['tasks'], (oldData: { tasks: Task[] }) => {
        const updatedTasks = oldData.tasks.map((task) => {
          if (task._id === updatedTask._id) {
            return updatedTask;
          }
          return task;
        });
        return { tasks: updatedTasks };
      });

      setShowTaskDrawer(false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
    if (!result.destination) return;
    console.log({ result });
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // handle reordering within the same column
    if (source.droppableId === destination.droppableId) {
    }
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
      <TaskDrawer task={activeTask} handleSave={handleSave} isSaving={isSaving} />
    </DragDropContext>
  );
}

export default Board;
