'use client';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BiLoaderAlt, BiMenuAltLeft } from 'react-icons/bi';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { IoMdAdd } from 'react-icons/io';
import { getTasks } from '@/api/task';
import { defaultTaskStatus, type Task, type TaskStatus } from '@/types';
import Button from './Button';
import TaskCard from './TaskCard';
import TaskDrawer from './TaskDrawer';

const task: Task = {
  _id: '1',
  title: 'Implement User Authentication with JWT',
  description:
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod quasi autem tempore ut corporis nulla consectetur voluptatem adipisci, sed rerum architecto explicabo accusamus, perferendis sint.',
  status: 'to do',
  priority: 'urgent',
  userId: '1',
  deadline: new Date('2022-12-31'),
  position: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
  const { isLoading, data: groupedTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    select: (data) => {
      return data.tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, {} as Record<TaskStatus, Task[]>);
    },
    refetchOnWindowFocus: false,
  });

  const [activeTask, setActiveTask] = useState<Partial<Task>>(defaultEmptyTask);

  useEffect(() => {
    if (!showTaskDrawer) {
      setActiveTask(defaultEmptyTask);
    }
  }, [showTaskDrawer]);

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    console.log({ result });
    // TODO: Implement reordering of tasks
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
        {groupedTasks &&
          Object.entries(groupedTasks).map(([status, tasks]) => (
            <Column
              key={status}
              name={status as TaskStatus}
              tasks={tasks}
              setShowTaskDrawer={setShowTaskDrawer}
              setActiveTask={setActiveTask}
            />
          ))}

        {groupedTasks && Object.entries(groupedTasks).length === 0 && (
          <>
            {defaultTaskStatus.map((status) => (
              <Column
                key={status}
                name={status}
                tasks={status === 'to do' ? [task] : []}
                setShowTaskDrawer={setShowTaskDrawer}
                setActiveTask={setActiveTask}
              />
            ))}
          </>
        )}
      </section>
      <TaskDrawer task={activeTask} />
    </DragDropContext>
  );
}

function Column({
  name,
  tasks,
  setShowTaskDrawer,
  setActiveTask,
}: {
  name: TaskStatus;
  tasks: Task[];
  setShowTaskDrawer: (val: boolean) => void;
  setActiveTask: Dispatch<SetStateAction<Partial<Task>>>;
}) {
  return (
    <Droppable droppableId={name}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-w-56 flex-1 flex flex-col gap-4 pb-2"
        >
          <header className="flex items-center justify-between">
            <h4 className="text-lg capitalize">{name}</h4>
            <button className="">
              <BiMenuAltLeft className="-scale-y-100" size={20} />
            </button>
          </header>
          {tasks.map((task, idx) => (
            <TaskCard key={task._id} index={idx} task={task} />
          ))}
          {provided.placeholder}

          <Button
            onClick={() => {
              setActiveTask((prev) => ({
                ...prev,
                status: name,
              }));
              setShowTaskDrawer(true);
            }}
            className="justify-between bg-neutral-800 font-normal"
          >
            Add new
            <IoMdAdd size={20} />
          </Button>
          <div className="h-[0.5px] shrink-0 w-full invisible" />
        </div>
      )}
    </Droppable>
  );
}

export default Board;
