import { Contacts } from '../models/contacts.js';

export const getAllContacts = async () => {
    const contacts = await Contacts.find();
    return contacts;
};

export const getContactsById = async (contactId) => {
    const contact = await Contacts.findById(contactId);
    return contact;
};