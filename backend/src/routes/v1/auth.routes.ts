import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import validate from '@/middleware/validate';
import { registerSchema, loginSchema } from '@/validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

import { protect } from '@/middleware/auth.middleware';
router.patch('/profile', protect, authController.updateProfile);

export default router;