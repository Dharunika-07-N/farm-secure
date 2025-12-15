import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/utils/prisma';
import { ApiError } from '@/utils/ApiError';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
export const registerUser = async (userBody: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: userBody.email } });
  if (existingUser) {
    throw new ApiError(400, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hash(userBody.password, 10);
  const user = await prisma.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  return { user: userWithoutPassword, token };
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Omit<User, 'password'>, token: string}>}
 */
export const loginUser = async (email: string, pass: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { farms: true },
  });
  if (!user || !(await bcrypt.compare(pass, user.password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

  return { user: userWithoutPassword, token };
};

export const updateUser = async (userId: string, data: Partial<Prisma.UserUpdateInput>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: { farms: true },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};