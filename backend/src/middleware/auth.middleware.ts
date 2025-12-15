import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '@/utils/ApiError';
import asyncHandler from '@/utils/asyncHandler';
import prisma from '@/utils/prisma';

interface JwtPayload {
    sub: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any; // To allow attaching user to request
        }
    }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            req.user = await prisma.user.findUnique({
                where: { id: decoded.sub },
                select: { id: true, email: true, role: true, firstName: true, lastName: true },
            });

            if (!req.user) {
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            throw new ApiError(401, 'Not authorized, token failed');
        }
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized, no token');
    }
});
