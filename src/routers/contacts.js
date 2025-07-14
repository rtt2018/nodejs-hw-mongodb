import { Router } from "express";
import { getAllContactsController, getContactsByIdController, pingController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, updateContactController, replaceContactController } from "../controllers/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';



const router = Router();

router.get('/', ctrlWrapper(pingController));
router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:id', isValidId, ctrlWrapper(getContactsByIdController));

router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));

router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));

router.patch('/contacts/:id', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

router.put('/contacts/:id', isValidId, validateBody(createContactSchema), ctrlWrapper(replaceContactController));


export default router;
