import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createUserSchema, loginUserSchema, requestPasswordResetSchema, resetPasswordSchema } from '../validation/auth.js';
import { registerUserController, loginUserController, logoutUserController, refreshUserController, requestPasswordResetController, resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

// authRouter.post('/', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/register', validateBody(createUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/send-reset-email', validateBody(requestPasswordResetSchema), ctrlWrapper(requestPasswordResetController));
// authRouter.post('/reset-password', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRouter;