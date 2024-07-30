'use client';
import clsx from 'clsx';
import TimeAgo from 'react-timeago';
import { MdOutlineWatchLater } from 'react-icons/md';
import { type Task } from '@/types';
import { Draggable } from '@hello-pangea/dnd';
import { memo } from 'react';

function TaskCard({
  task,
  index,
  handleClick,
}: {
  task: Task;
  index: number;

  handleClick: (task: Task) => void;
}) {
  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <div
          onClick={() => handleClick(task)}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          className="w-full bg-gray-100 border-[1.5px] border-gray-200 p-3.5 rounded-lg flex flex-col gap-1.5"
        >
          <h4 className="font-medium text-[15px] leading-snug">{task.title}</h4>
          <p className="text-sm leading-snug line-clamp-3 text-gray-500">{task.description}</p>
          {task.priority && <PriorityTile priority={task.priority} />}
          {task.deadline && (
            <div className="flex gap-2 items-center text-sm mt-2 font-medium">
              <MdOutlineWatchLater size={18} />
              {task.deadline.toISOString().split('T')[0]}
            </div>
          )}
          <div className="text-sm font-medium text-gray-500 mt-3">
            <TimeAgo date={task.createdAt} />
          </div>
        </div>
      )}
    </Draggable>
  );
}

function PriorityTile({ priority }: { priority: Task['priority'] }) {
  return (
    <span
      className={clsx(
        'py-1.5 px-2 rounded-md text-white w-fit capitalize text-[10px] cursor-default block mt-2',
        {
          'bg-green-500': priority === 'low',
          'bg-yellow-500': priority === 'medium',
          'bg-red-400': priority === 'urgent',
        }
      )}
    >
      {priority}
    </span>
  );
}

export default memo(TaskCard);
