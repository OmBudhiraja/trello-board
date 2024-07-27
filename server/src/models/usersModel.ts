import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  checkPassword(inputPassword: string, storedPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser, mongoose.Model<IUser>>({
  name: {
    type: String,
    required: [true, 'Name field is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: 6,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (inputPassword: string, storedPassword: string) {
  return await bcrypt.compare(inputPassword, storedPassword);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
