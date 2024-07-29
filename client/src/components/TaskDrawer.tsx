import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { IoMdClose } from 'react-icons/io';
import { CgArrowsExpandLeft } from 'react-icons/cg';
import { GoShareAndroid } from 'react-icons/go';
import { defaultTaskStatus, priorityOptions, TaskStatus, type Task } from '@/types';

function TaskDrawer({ task }: { task: Partial<Task> }) {
  const [title, setTitle] = useState(task.title ?? '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(task.deadline);
  const [description, setDescription] = useState(task.description);
  const [content, setContent] = useState('');

  useEffect(() => {
    setTitle(task.title ?? '');
    setStatus(task.status);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setDescription(task.description);
  }, [task]);

  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Content
        className="bg-white flex flex-col h-full w-[600px] py-4 px-6 fixed bottom-0 right-0"
        aria-describedby="Create or edit Tasks"
      >
        <Drawer.Handle />
        <Drawer.Title className="sr-only">Create or edit Task</Drawer.Title>
        <header className="flex justify-between items-center w-full text-gray-500">
          <div className="flex items-center gap-6">
            <Drawer.Close>
              <IoMdClose size={24} />
            </Drawer.Close>
            <button>
              <CgArrowsExpandLeft size={20} />
            </button>
          </div>
          <div className="flex gap-4">
            <button className="p-2 rounded bg-gray-100 flex gap-3 items-center">
              Share
              <GoShareAndroid size={20} />
            </button>
            <button className="p-2 rounded bg-gray-100 flex gap-3 items-center">
              Favourite
              <GoShareAndroid size={20} />
            </button>
          </div>
        </header>
        <section>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <div>
              Priority
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </Drawer.Content>
    </Drawer.Portal>
  );
}

export function DrawerRoot({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer.Root direction="right" open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer.Root>
  );
}

export default TaskDrawer;
