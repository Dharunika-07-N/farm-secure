import { Request, Response } from 'express';
import * as authService from '@/services/auth.service';
import asyncHandler from '@/utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token,
  });
});