import { Request, Response } from 'express';
import * as authService from '@/services/auth.service';
import asyncHandler from '@/utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
    token,
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

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new Error("User not authenticated");

  const updatedUser = await authService.updateUser(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body;
  const result = await authService.sendOTP(identifier);
  res.status(200).json({
    success: true,
    ...result
  });
});

export const loginWithOTP = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, otp } = req.body;
  const { user, token } = await authService.loginWithOTP(identifier, otp);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token
  });
});