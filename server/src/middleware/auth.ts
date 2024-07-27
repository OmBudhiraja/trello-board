// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/token';
import User from '../models/usersModel';

const tokenSecret = process.env.TOKEN_SECRET!;

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;

    // console.log({ accessToken, refreshToken });
    if (!token) {
      return res.status(401).json({
        message: 'Token not found',
      });
    }

    const decoded = await verifyToken(token, tokenSecret);

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    req.user = user;

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError && err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token Expired',
      });
    } else {
      return res.status(401).json({
        message: 'Invalid Token',
      });
    }
  }
};

//// Calculate last updated date to throttle write updates to database
// Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
//     e.g. ({expiry date} - 30 days) + 1 day
// sessionIsDueToBeUpdatedDate := session.Expires.Add(-db.SessionExpiry).Add(db.SessionUpdateAge)

// if time.Now().After(sessionIsDueToBeUpdatedDate) {
// 	fmt.Println("Updating session expiry")
// 	db.UpdateSessionExpiry(token.Value)
// 	http.SetCookie(w, CreateCookie(SessionCookieName, session.Token, time.Now().Add(db.SessionExpiry)))
// }

export default protect;
