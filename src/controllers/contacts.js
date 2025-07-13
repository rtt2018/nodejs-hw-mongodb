import { getContactsById, getAllContacts, createContact, deleteContact, updateContact, replaceContact } from './services/contacts.js';
import createHttpError from 'http-errors';


export const pingController = (req, res) => {
    res.json({
        message: 'Hello world!',
    });
};

export const getAllContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
        status: 201,
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

    if (!req.bodyname || !req.body.phoneNumber || !req.body.contactType) {
        throw createHttpError(400, 'Missing contact name, phone number, or contact type');
    }
    const newContact = await createContact(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const deleteContactController = async (req, res) => {
    const contactId = req.params.id;
    const deletedContact = await deleteContact(contactId);

    if (!deletedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).json({
        status: 204,
        message: `Successfully deleted contact with id ${contactId}!`,
        data: deletedContact,
    });
};

export const updateContactController = async (req, res) => {
    const contactId = req.params.id;
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully updated contact with id ${contactId}!`,
        data: updatedContact,
    });
};

export const replaceContactController = async (req, res) => {
    const contactId = req.params.id;
    const replacedContact = await replaceContact(contactId, req.body);

    if (!replacedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully replaced contact with id ${contactId}!`,
        data: replacedContact,
    });
};
