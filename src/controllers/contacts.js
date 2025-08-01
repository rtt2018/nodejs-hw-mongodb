import { getContactsById, getAllContacts, createContact, deleteContact, updateContact, replaceContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { savePhoto } from '../utils/savePhoto.js';


export const pingController = (req, res) => {
    res.json({
        message: 'Hello world!',
    });
};

export const getAllContactsController = async (req, res) => {

    const { page, perPage } = parsePaginationParams(req.query);

    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId: req.user._id
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    });
};

export const getContactsByIdController = async (req, res) => {
    const contactId = req.params.id;
    const contact = await getContactsById(contactId);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {

    const photo = await savePhoto(req);

    const newContact = await createContact({ ...req.body, photo, userId: req.user._id });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const deleteContactController = async (req, res) => {

    const deletedContact = await deleteContact(req.params.id, req.user._id);

    if (!deletedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).json({
        status: 204,
        message: `Successfully deleted contact with id ${req.params.id}!`,
        data: deletedContact,
    });
};

export const updateContactController = async (req, res) => {

    const photo = await savePhoto(req);

    const updatedContact = await updateContact(req.params.id, req.user._id, { ...req.body, photo, userId: req.user._id });

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully updated contact with id ${req.params.id}!`,
        data: updatedContact,
    });
};

export const replaceContactController = async (req, res) => {

    const photo = await savePhoto(req);

    const replacedContact = await replaceContact(req.params.id, req.user._id, { ...req.body, photo, userId: req.user._id });

    if (!replacedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully replaced contact with id ${req.params.id}!`,
        data: replacedContact,
    });
};
