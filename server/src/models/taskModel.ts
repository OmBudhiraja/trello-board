import { InferSchemaType, Schema, model } from 'mongoose';

export const statusEnum = ['to do', 'in progress', 'under review', 'completed'] as const;
export const priorityEnum = ['low', 'medium', 'urgent'] as const;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Name field is required'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: [true, 'Status field is required'],
      enum: statusEnum,
    },
    priority: {
      type: String,
      enum: priorityEnum,
    },
    deadline: {
      type: Date,
    },
    position: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

export type Task = InferSchemaType<typeof taskSchema>;

const TaskModel = model('Task', taskSchema);

export default TaskModel;
