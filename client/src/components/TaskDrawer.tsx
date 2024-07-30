import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { IoMdClose } from 'react-icons/io';
import { CgArrowsExpandLeft } from 'react-icons/cg';
import { TbLoader } from 'react-icons/tb';
import { CiCalendar } from 'react-icons/ci';
import { LuPencil } from 'react-icons/lu';
import { BiErrorAlt } from 'react-icons/bi';
import { GoShareAndroid } from 'react-icons/go';
import { GoPlus } from 'react-icons/go';
import { defaultTaskStatus, priorityOptions, TaskStatus, type Task } from '@/types';
import { cn } from '@/utils/cn';
import Button from './Button';
import toast from 'react-hot-toast';

function TaskDrawer({
  task,
  handleSave,
  isSaving,
}: {
  task: Partial<Task>;
  handleSave: (task: Partial<Task>) => void;
  isSaving: boolean;
}) {
  const [title, setTitle] = useState(task.title ?? '');
  const [status, setStatus] = useState(task.status ?? '');
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(task.deadline);
  const [description, setDescription] = useState(task.description ?? '');
  const [content, setContent] = useState(task.content ?? '');

  useEffect(() => {
    setTitle(task.title ?? '');
    setStatus(task.status ?? '');
    setPriority(task.priority);
    setDeadline(task.deadline);
    setDescription(task.description ?? '');
    setContent(task.content ?? '');
  }, [task]);

  function onSave() {
    if (!title || title.length < 2) {
      return toast.error('Title should be atleast 2 characters long');
    }
    if (!status) {
      return toast.error('Status is required');
    }
    console.log('-----deadline', deadline, typeof deadline);
    handleSave({
      _id: task._id,
      title,
      status: status as TaskStatus,
      priority: priority || undefined,
      deadline: deadline || undefined,
      description: description || undefined,
      content: content,
      position: task.position,
    });
  }

  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Content
        className="bg-white flex flex-col h-full w-[600px] py-4 px-6 fixed bottom-0 right-0 text-gray-500"
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
            <Button
              disabled={isSaving}
              isLoading={isSaving}
              onClick={onSave}
              className="rounded-md"
            >
              Save
            </Button>
          </div>
        </header>
        <section className="flex flex-col gap-7 mt-7">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold text-4xl lg:text-5xl outline-none text-gray-600"
          />
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-10">
              <label htmlFor="status" className="flex items-center gap-6 min-w-36">
                <TbLoader size={22} />
                Status
              </label>
              <div className="flex-1">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className={cn('w-full  outline-none capitalize', {
                    'text-gray-400': !status,
                    'text-gray-700': status,
                  })}
                >
                  <option value="">Not Selected</option>
                  {defaultTaskStatus.map((status) => (
                    <option
                      className="capitalize py-1 px-2 text-gray-700"
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-6 min-w-36">
                <BiErrorAlt size={22} />
                Priority
              </label>
              <div className="flex-1">
                <select
                  name="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                  className={cn('w-full  outline-none capitalize', {
                    'text-gray-400': !priority,
                    'text-gray-700': priority,
                  })}
                >
                  <option value="">Not Selected</option>
                  {priorityOptions.map((priority) => (
                    <option
                      className="capitalize py-1 px-2 text-gray-700"
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <label htmlFor="deadline" className="flex items-center gap-6 min-w-36">
                <CiCalendar size={22} />
                Deadline
              </label>
              <div className="flex-1">
                <input
                  id="deadline"
                  type="date"
                  className="w-full outline-none text-gray-700"
                  value={deadline?.toISOString().split('T')[0] ?? ''}
                  onChange={(e) => setDeadline(new Date(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center gap-10">
              <label htmlFor="description" className="flex items-center gap-6 min-w-36">
                <LuPencil size={20} />
                Description
              </label>
              <div className="flex-1">
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full outline-none text-gray-600"
                  placeholder="Add Description here..."
                />
              </div>
            </div>
            <button className="text-black flex items-center gap-6 mt-1.5">
              <GoPlus size={20} />
              Add Custom Property
            </button>
          </div>
        </section>
        <div className="w-full h-[1px] mt-8 bg-gray-200 shrink-0" />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none text-gray-600 mt-7 outline-none"
          placeholder="Start writing, or drag your own files here."
        ></textarea>
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
