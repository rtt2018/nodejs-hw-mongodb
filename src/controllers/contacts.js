import { getContactsById, getAllContacts, createContact, deleteContact, updateContact, replaceContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UPLOAD_TO_CLOUDINARY } from '../constants/index.js';


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

    let photo = null;

    if (UPLOAD_TO_CLOUDINARY) {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
    } else {
        await fs.rename(
            req.file.path,
            path.resolve('src/uploads/photo', req.file.filename),
        );
        photo = `${getEnvVar('APP_DOMAIN')}/photo/${req.file.filename}`;
    }

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

    let photo = null;

    if (UPLOAD_TO_CLOUDINARY) {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
    } else {
        await fs.rename(
            req.file.path,
            path.resolve('src/uploads/photo', req.file.filename),
        );
        photo = `${getEnvVar('APP_DOMAIN')}/photo/${req.file.filename}`;
    }


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

    let photo = null;

    if (UPLOAD_TO_CLOUDINARY) {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
    } else {
        await fs.rename(
            req.file.path,
            path.resolve('src/uploads/photo', req.file.filename),
        );
        photo = `${getEnvVar('APP_DOMAIN')}/photo/${req.file.filename}`;
    }

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
