import { Request, Response } from 'express';
import { generateToken } from '../utils/token';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import User from '../models/usersModel';
import { setCookie } from '../utils/cookie';

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (req: Request, res: Response) => {
  const { sucess, body } = validate(loginBodySchema, req, res);

  if (!sucess) {
    return;
  }

  // find user with the email
  const user = await User.findOne({
    email: body.email,
  }).select('+password');

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // check password
  if (!(await user.checkPassword(body.password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = await generateToken(user._id.toString());

  // set cookie
  setCookie(res, 'token', token);
  res.json({ user: { ...user.toJSON(), password: undefined } });
};

const signupBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const { sucess, body } = validate(signupBodySchema, req, res);

    if (!sucess) {
      return;
    }

    // check user with email exists
    const usersExists = await User.findOne({
      email: body.email,
    });

    if (usersExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create user
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    // generate token
    const token = await generateToken(user._id.toString());

    // set cookie
    setCookie(res, 'token', token);

    res.status(201).json({
      user: {
        ...user.toJSON(),
        password: undefined,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (_: Request, res: Response) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};
