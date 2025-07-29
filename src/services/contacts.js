import { Contacts } from '../models/contacts.js';
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    userId
}) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const contactsQuery = Contacts.find({ userId });

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

export const getContactsById = async (contactId, userId) => {
    const contact = await Contacts.findOne({ _id: contactId, userId });
    return contact;
};

export function createContact(payload, userId) {
    return Contacts.create({ ...payload, userId });
}

export function deleteContact(contactId, userId) {
    return Contacts.findOneAndDelete({ _id: contactId, userId });
}

export function updateContact(contactId, payload, userId) {
    return Contacts.findOneAndUpdate({ _id: contactId, userId }, payload, { new: true });
}

export async function replaceContact(contactId, payload, userId) {
    const result = await Contacts.findByIdAndUpdate({ _id: contactId, userId }, payload, {
        new: true,
        upsert: true,
        includeResultMetadata: true,
    });

    return {
        value: result.value,
        updatedExisting: result.lastErrorObject.updatedExisting,
    };
}