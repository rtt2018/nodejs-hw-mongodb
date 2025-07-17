import { Contacts } from '../models/contacts.js';
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
}) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const contactsQuery = Contacts.find();

    const [total, contacts] = await Promise.all([
        Contacts.find().merge(contactsQuery).countDocuments(),
        contactsQuery
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems: total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
    };
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