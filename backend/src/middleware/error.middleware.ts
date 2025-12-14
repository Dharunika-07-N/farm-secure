import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;

    if (!err.isOperational && !(err instanceof ApiError)) {
        statusCode = statusCode || 500;
        message = message || 'Internal Server Error';
    } else {
        statusCode = err.statusCode;
    }

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};
