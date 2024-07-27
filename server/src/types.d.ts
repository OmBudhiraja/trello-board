import { User } from './models/usersModel';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
