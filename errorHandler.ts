import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import ApiError from '@/utils/ApiError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    if (err.code === 'P2002') {
      // Unique constraint violation
      statusCode = 409; // Conflict
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      message = `A record with this ${target} already exists.`;
    }
  }

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;