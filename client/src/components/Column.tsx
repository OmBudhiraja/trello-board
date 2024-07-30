import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { IoMdAdd } from 'react-icons/io';
import Button from './Button';
import TaskCard from './TaskCard';
import { BiMenuAltLeft } from 'react-icons/bi';
import { Droppable } from '@hello-pangea/dnd';
import { type Task, type TaskStatus } from '@/types';

function Column({
  name,
  tasks,
  setShowTaskDrawer,
  setActiveTask,
  setIsEditMode,
}: {
  name: TaskStatus;
  tasks: Task[];
  setShowTaskDrawer: (val: boolean) => void;
  setActiveTask: Dispatch<SetStateAction<Partial<Task>>>;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}) {
  const handleTaskClick = useCallback(
    (task: Task) => {
      setActiveTask(task);
      setIsEditMode(true);
      setShowTaskDrawer(true);
    },
    [setActiveTask, setIsEditMode, setShowTaskDrawer]
  );

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
            <TaskCard key={task._id} index={idx} task={task} handleClick={handleTaskClick} />
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

export default Column;
