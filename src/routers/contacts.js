import { Router } from "express";
import { getAllContactsController, getContactsByIdController, pingController } from "../controllers/contacts";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createStudentController, deleteStudentController, updateStudentController, replaceStudentController } from "../controllers/contacts.js";

const router = Router();

router.get('/', ctrlWrapper(pingController));
router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:id', ctrlWrapper(getContactsByIdController));

router.post('/contacts', ctrlWrapper(createStudentController));

router.delete('/contacts/:id', ctrlWrapper(deleteStudentController));

router.patch('/contacts/:id', ctrlWrapper(updateStudentController));

router.put('/contacts/:id', ctrlWrapper(replaceStudentController));


export default router;
