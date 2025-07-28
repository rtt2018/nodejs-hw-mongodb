import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import { pingController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const router = Router();
router.get('/', ctrlWrapper(pingController));

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;