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

/**
 * Send OTP to user (Mock)
 * @param {string} identifier (email or phone)
 */
export const sendOTP = async (identifier: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier }
      ]
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found with this identifier');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt }
  });

  console.log(`[MOCK SMS/EMAIL] To: ${identifier}, OTP: ${otp}`);

  return { message: 'OTP sent successfully', identifier };
};

/**
 * Login with OTP
 * @param {string} identifier
 * @param {string} otp
 */
export const loginWithOTP = async (identifier: string, otp: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier }
      ],
      otp,
      otpExpiresAt: { gt: new Date() }
    },
    include: { farms: true }
  });

  if (!user) {
    throw new ApiError(401, 'Invalid or expired OTP');
  }

  // Clear OTP after use
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiresAt: null }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

  return { user: userWithoutPassword, token };
};