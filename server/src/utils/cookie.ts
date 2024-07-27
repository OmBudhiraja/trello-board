import { type Response } from 'express';

export function setCookie(
  res: Response,
  cookieName: string,
  token: string,
  expireTime = 24 * 60 * 60 * 1000 // 1 hour
) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    expires: new Date(Date.now() + expireTime),
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  // res.cookie(flag, true, cookieOption);
}
