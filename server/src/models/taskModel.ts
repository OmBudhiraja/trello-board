import { InferSchemaType, Schema, model } from 'mongoose';

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
      enum: ['to do', 'in progress', 'under review', 'completed'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'urgent'],
    },
    deadline: {
      type: Date,
    },
    position: {
      type: Number,
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
