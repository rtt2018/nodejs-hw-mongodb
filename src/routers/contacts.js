import { Router } from "express";
import { getAllContactsController, getContactsByIdController, pingController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, updateContactController, replaceContactController } from "../controllers/contacts.js";

const router = Router();

router.get('/', ctrlWrapper(pingController));
router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:id', ctrlWrapper(getContactsByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.delete('/contacts/:id', ctrlWrapper(deleteContactController));

router.patch('/contacts/:id', ctrlWrapper(updateContactController));

router.put('/contacts/:id', ctrlWrapper(replaceContactController));


export default router;
