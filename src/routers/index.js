import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import { pingController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import path from 'node:path';
import express from 'express';
// import { swaggerDocs } from '../middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from '../constants/index.js';
import { authenticate } from '../middlewares/authenticate.js';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';


const router = Router();
router.get('/', ctrlWrapper(pingController));

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/photo', authenticate, express.static(path.resolve('src/uploads/photo')));

router.use('/uploads', authenticate, express.static(UPLOAD_DIR));
router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync(SWAGGER_PATH).toString())));

export default router;