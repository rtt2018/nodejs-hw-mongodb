import { Contacts } from '../models/contacts.js';

export const getAllContacts = async () => {
    const contacts = await Contacts.find();
    return contacts;
};

export const getContactsById = async (contactId) => {
    const contact = await Contacts.findById(contactId);
    return contact;
};

export function createContact(payload) {
    return Contacts.create(payload);
}

export function deleteContact(contactId) {
    return Contacts.findByIdAndDelete(contactId);
}

export function updateContact(contactId, payload) {
    return Contacts.findByIdAndUpdate(contactId, payload, { new: true });
}

export async function replaceContact(contactId, payload) {
    const result = await Contacts.findByIdAndUpdate(contactId, payload, {
        new: true,
        upsert: true,
        includeResultMetadata: true,
    });

    return {
        value: result.value,
        updatedExisting: result.lastErrorObject.updatedExisting,
    };
}