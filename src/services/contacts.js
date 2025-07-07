import { ContactsModel } from '../models/contacts.js';

export const getAllContacts = async () => {
    const contacts = await ContactsModel.find();
    return contacts;
};

export const getContactsById = async (contactId) => {
    const student = await ContactsModel.findById(contactId);
    return student;
};