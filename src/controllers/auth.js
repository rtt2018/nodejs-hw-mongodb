export async function getContactsController(req, res) {
    const contacts = await getContacts();

    if (!contacts || contacts.length === 0) {
        throw createHttpError(404, 'No contacts found');
    }
    res.json({
        status: 200,
        message: 'Successfully retrieved contacts!',
        data: contacts,
    });
}