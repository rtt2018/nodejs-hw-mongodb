import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import { pingController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import path from 'node:path';
import express from 'express';


const router = Router();
router.get('/', ctrlWrapper(pingController));

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/photo', express.static(path.resolve('src/uploads/photo')));


export default router;