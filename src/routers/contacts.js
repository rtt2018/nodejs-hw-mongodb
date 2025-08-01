import { Router } from "express";
import { getAllContactsController, getContactsByIdController, createContactController, deleteContactController, updateContactController, replaceContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from "../middlewares/multer.js";


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

contactsRouter.patch('/:id', upload.single('photo'), isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

contactsRouter.put('/:id', upload.single('photo'), isValidId, validateBody(createContactSchema), ctrlWrapper(replaceContactController));


export default contactsRouter;
