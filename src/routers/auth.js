import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createUserSchema } from '../validation/auth.js';
import { registerUserController, loginUserController, logoutUserController, refreshUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

// authRouter.post('/', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/register', validateBody(createUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', ctrlWrapper(loginUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserController));
export default authRouter;